import {
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Alert,
  Button,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Iconify } from "react-native-iconify";
import DiarySwitchTabs from "../../components/DiarySwitchTabs";
import {
  LoadingComponent,
  useIsDeleting,
} from "../../components/DiaryLoadingDelete";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase/firebase";
import {
  collection,
  deleteDoc,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { getAuthToken, getCurrentUserId } from "../../src/authToken";
import Modal from "react-native-modal";
import styles from "./dms";
import { DateTime } from "luxon";
import * as Notifications from "expo-notifications";
import { setNotificationHandler } from "../../components/NotificationHandler";
import { registerForPushNotificationsAsync } from "../Notification/NotificationScreen";

setNotificationHandler();

const DiaryMaintenanceScreen = () => {
  const navigation = useNavigation();
  const [trackerTab, setTrackerTab] = useState(1);
  const [userId, setUserId] = useState(null);
  const [diaryMaintenanceData, setDiaryMaintenanceData] = useState([]);
  const [diaryRemindersData, setDiaryRemindersData] = useState([]);
  const [selectedDiaryMaintenanceId, setSelectedDiaryMaintenanceId] =
    useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isXButtonVisible, setIsXButtonVisible] = useState(true);
  const { isDeleting, startDeleting, stopDeleting } = useIsDeleting();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log(response);
          if (response.actionIdentifier === "snooze") {
            // Snooze the reminder
            Notifications.cancelAllScheduledNotificationsAsync();
            const snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5); // Snooze for 5 minutes
            const notificationId = await schedulePushNotification();
            setNotificationId(notificationId);
          } else if (response.actionIdentifier === "stop") {
            Notifications.cancelAllScheduledNotificationsAsync();
            Notifications.dismissAllNotificationsAsync();
          } else {
            const snoozeTime = new Date();
            snoozeTime.setMinutes(snoozeTime.getMinutes() + 5);
            if (snoozeTime > new Date()) {
              // Check if the notification was snoozed
              const notificationId = await schedulePushNotification();
              setNotificationId(notificationId);
            }
          }
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleCreateDiaryMaintenance = () => {
    navigation.navigate("CreateDiaryMaintenance");
  };

  const handleUpdateDiaryMaintenance = (diaryMaintenanceId) => {
    navigation.navigate("UpdateDiaryMaintenance", {
      userID: userId,
      diaryID: diaryMaintenanceId,
    });
  };

  const onSelectSwitch = (value) => {
    setTrackerTab(value);
  };

  //---------------------------TO DELETE THE DIARY
  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setIsXButtonVisible(false);
  };

  const handleLongPress = (diaryMaintenanceId) => {
    if (diaryMaintenanceId === selectedDiaryMaintenanceId) {
      // If the same item is long-pressed again, deselect it
      setSelectedDiaryMaintenanceId(null);
    } else {
      setSelectedDiaryMaintenanceId(diaryMaintenanceId);
    }
  };

  const handleXButtonPress = (diaryMaintenanceId) => {
    setSelectedDiaryMaintenanceId(diaryMaintenanceId);

    // Show an alert when 'X' button is pressed
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this diary maintenance?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteConfirm(),
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderXButton = (diaryMaintenanceId) => {
    if (diaryMaintenanceId === selectedDiaryMaintenanceId) {
      return (
        <TouchableOpacity
          style={styles.xButton}
          onPress={() => handleXButtonPress(diaryMaintenanceId)}
        >
          <Iconify icon="ic:outline-close" size={16} color="white" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.xButton}
          onPress={() => handleUpdateDiaryMaintenance(diaryMaintenanceId)}
        >
          <Iconify icon="ri:pencil-fill" size={16} color="white" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const handleDeleteConfirm = async () => {
    try {
      startDeleting();

      const diaryMaintenanceDocRef = doc(
        db,
        "diaryMaintenance",
        selectedDiaryMaintenanceId
      );

      // Get the associated diaryReminders documents
      const diaryRemindersQuery = query(
        collection(db, "diaryReminders"),
        where("diaryMaintenanceId", "==", selectedDiaryMaintenanceId)
      );
      const diaryRemindersSnapshot = await getDocs(diaryRemindersQuery);

      // Delete the associated diaryReminders documents
      const deletePromises = diaryRemindersSnapshot.docs.map(
        async (diaryReminderDoc) => {
          await deleteDoc(diaryReminderDoc.ref);
        }
      );

      // Wait for all diaryReminders documents to be deleted
      await Promise.all(deletePromises);
      await deleteDoc(diaryMaintenanceDocRef);

      setSelectedDiaryMaintenanceId(null);
      closeDeleteModal();
      stopDeleting();
    } catch (error) {
      stopDeleting();
      console.error("Error deleting document:", error);
    }
  };
  //---------------------------END OF DELETE

  //---------------------------TO FETCH THE DATA FROM FIRESTORE
  useEffect(() => {
    async function fetchDiaryData() {
      try {
        const authToken = await getAuthToken();
        setUserId(authToken.userId);

        // Query the 'diaryMaintenance' collection with a condition to match the user ID
        const diaryMaintenanceQuery = query(
          collection(db, "diaryMaintenance"),
          where("userId", "==", authToken.userId)
        );

        // Use onSnapshot to listen for changes in the 'diaryMaintenance' collection
        const unsubscribeDiaryMaintenance = onSnapshot(
          diaryMaintenanceQuery,
          (querySnapshot) => {
            const diaryMaintenanceData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDiaryMaintenanceData(diaryMaintenanceData);

            // Log successful update
            //console.log("Diary Maintenance Data Updated:", diaryMaintenanceData);

            // Check if diaryMaintenanceData is empty
            if (diaryMaintenanceData.length === 0) {
              // Display a message when the diaryMaintenanceData is empty
              setDiaryRemindersData([]); // Clear diaryRemindersData
            } else {
              // Query the 'diaryReminders' collection to match diaryMaintenanceId with diaryMaintenance document IDs
              const diaryRemindersQuery = query(
                collection(db, "diaryReminders"),
                where(
                  "diaryMaintenanceId",
                  "in",
                  diaryMaintenanceData.map((item) => item.id)
                )
              );

              // Use onSnapshot to listen for changes in the 'diaryReminders' collection
              const unsubscribeDiaryReminders = onSnapshot(
                diaryRemindersQuery,
                (querySnapshot) => {
                  const initialDiaryRemindersData = querySnapshot.docs.map(
                    (doc) => ({
                      id: doc.id,
                      ...doc.data(),
                    })
                  );
                  setDiaryRemindersData(initialDiaryRemindersData);

                  // Log successful update
                  //console.log("Diary Reminders Data Updated:", initialDiaryRemindersData);
                }
              );

              // Remember to unsubscribe when the component unmounts to prevent memory leaks
              return () => {
                unsubscribeDiaryMaintenance();
                unsubscribeDiaryReminders();
              };
            }
          },
          (error) => {
            // Log error if there's an issue with onSnapshot
            console.error("Error in onSnapshot for diaryMaintenance:", error);
          }
        );
      } catch (error) {
        // Log error if there's an issue with fetching data
        console.error("Error fetching data:", error);
      }
    }

    fetchDiaryData();
  }, []);

  //---------------------------END OF FETCH

  //---------------------------TO DISPLAY THE SCHEDULE OF REMINDERS
  const mapNumberToDay = (number) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[number];
  };

  const renderReminderSchedule = (reminderSched) => {
    const allDays = [0, 1, 2, 3, 4, 5, 6];

    const isEveryday = allDays.every((day) => reminderSched.includes(day));

    if (isEveryday) {
      return <Text style={styles.whenText}>Everyday</Text>;
    } else {
      const normalWeek = [0, 1, 2, 3, 4, 5, 6];

      const sortedReminderSched = reminderSched.sort(
        (a, b) => normalWeek.indexOf(a) - normalWeek.indexOf(b)
      );

      const dayNames = sortedReminderSched.map((dayNumber) =>
        mapNumberToDay(dayNumber)
      );
      const scheduleText = dayNames.join(", ");

      return <Text style={styles.whenText}>{scheduleText}</Text>;
    }
  };

  //---------------------------END OF TO SCHEDULE REMINDERS

  //---------------------------

  //Change the switchState field status based on the on/off button
  const handleSwitchToggleAndCheckReminder = async (reminderId) => {
    // Find the reminder object that matches the reminderId
    const reminderToUpdate = diaryRemindersData.find(
      (item) => item.id === reminderId
    );

    if (reminderToUpdate) {
      try {
        const newSwitchState = !reminderToUpdate.switchState;

        // Update the switchState in the local state
        const updatedDiaryRemindersData = diaryRemindersData.map((item) => {
          if (item.id === reminderId) {
            return {
              ...item,
              switchState: newSwitchState,
            };
          }
          return item;
        });

        setDiaryRemindersData(updatedDiaryRemindersData);

        // Update the switchState in Firestore
        const reminderDocRef = doc(db, "diaryReminders", reminderId);
        await updateDoc(reminderDocRef, {
          switchState: newSwitchState,
        });
        console.log("set new switchState", newSwitchState);
        // Check the reminder immediately after toggling the switch
        //checkReminder(reminderId, newSwitchState);
      } catch (error) {
        console.error("Error updating reminder switch state:", error);
      }
    }
  };

  async function schedulePushNotification(maintenanceItem, remindersData) {
    const currentTimeInPH = DateTime.now().setZone("Asia/Manila");
    const matchingReminders = remindersData.filter(
      (item) => item.diaryMaintenanceId === maintenanceItem.id
    );

    const notificationIds = [];

    for (const item of matchingReminders) {
      const { reminderSched, currentDay } = await getReminderSchedAndCurrentDay(
        item.diaryMaintenanceId,
        currentTimeInPH
      );

      const reminderTime = item.reminderTime?.seconds
        ? new Date(item.reminderTime.seconds * 1000)
        : null;

      let adjustedDay = currentDay % 7;
      const isCurrentDayInReminderchedule = reminderSched.includes(adjustedDay);
      const switchState = item.switchState;

      if (switchState === true && isCurrentDayInReminderchedule) {
        try {
          const { hours, minutes, period } = getTimeDetails(reminderTime);

          let date = new Date();
          date.setHours(hours);
          date.setMinutes(minutes);

          await Notifications.setNotificationCategoryAsync(
            "alarm",
            [
              {
                identifier: "stop",
                buttonTitle: "Stop",
                isAuthenticationRequired: false,
              },
              {
                identifier: "snooze",
                buttonTitle: "Snooze",
                isAuthenticationRequired: false,
              },
            ],
            {
              name: "alarm",
              sound: true,
              importance: Notifications.AndroidImportance.MAX,
              bypassDnd: true,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: "#FF231F7C",
              priority: Notifications.AndroidNotificationPriority.MAX,
              lockscreenVisibility:
                Notifications.AndroidNotificationVisibility.PUBLIC,
              enableLights: true,
            }
          );

          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: "Reminder",
              body: `Time to take your Medicine ${item.reminderName}`,
              sound: true,
              categoryIdentifier: "alarm",
              vibrate: [0, 1000, 500, 1000],
              priority: Notifications.AndroidNotificationPriority.MAX,
              name: "alarm",
              importance: Notifications.AndroidImportance.MAX,
              bypassDnd: true,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: "#FF231F7C",
              lockscreenVisibility:
                Notifications.AndroidNotificationVisibility.PUBLIC,
              enableLights: true,
            },
            trigger: { date: date },
          });

          setTimeout(() => {
            Notifications.dismissNotificationAsync(notificationId);
          }, 180000);

          notificationIds.push(notificationId);
        } catch (error) {
          console.error("Failed to schedule notification. Error:", error);
        }
      } else {
        console.log("No Reminders");
      }
    }
    return notificationIds;
  }

  const getReminderSchedAndCurrentDay = async (
    diaryMaintenanceId,
    currentTimeInPH
  ) => {
    const diaryMaintenanceDocRef = doc(
      db,
      "diaryMaintenance",
      diaryMaintenanceId
    );
    const diaryMaintenanceDocSnap = await getDoc(diaryMaintenanceDocRef);

    if (!diaryMaintenanceDocSnap.exists()) {
      return { reminderSched: null, currentDay: null };
    }

    const reminderSched = diaryMaintenanceDocSnap.data().reminderSched;
    const currentDay = currentTimeInPH.weekday;

    return { reminderSched, currentDay };
  };

  const getTimeDetails = (reminderTime) => {
    const hours = reminderTime.getHours();
    const minutes = String(reminderTime.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    return { hours, minutes, period };
  };

  //---------------------------FOR DISPLAYg
  const renderReminderTimes = (maintenanceItem, remindersData) => {
    // Filter reminders that match the current maintenance item's ID
    const matchingReminders = remindersData.filter(
      (item) => item.diaryMaintenanceId === maintenanceItem.id
    );
    //console.log("remderReminderTimes", maintenanceItem);
    schedulePushNotification(maintenanceItem, remindersData);

    return (
      <View style={styles.columnContainer}>
        {matchingReminders.map((item, index) => {
          const reminderTime = item.reminderTime?.seconds
            ? new Date(item.reminderTime.seconds * 1000)
            : null;

          const { hours, minutes, period } = getTimeDetails(reminderTime);

          // Log the switch state for the current reminder
          if (index === 0) {
            //console.log("Switch State:", item.switchState);
          }

          return (
            <View key={item.id} style={styles.reminderContainer}>
              <View>
                <Text style={styles.timeText}>
                  {hours}:{minutes} {period}
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  value={item.switchState}
                  onValueChange={() =>
                    handleSwitchToggleAndCheckReminder(item.id)
                  }
                  trackColor={{ true: "#EC6F56", false: "gray" }}
                  thumbColor={item.switchState ? "white" : "#8E8E8E"} // Use different colors based on switch state
                  style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                />
              </View>
            </View>
          );

          return null; // Handle cases where reminderTime is not available
        })}
      </View>
    );
  };
  //---------------------------END FOR DISPLAY

  //---------------------------FOR STOCK COUNT DISPLAY
  const remindersCountByMaintenance = diaryMaintenanceData.reduce(
    (countMap, item) => {
      const matchingReminders = diaryRemindersData.filter(
        (reminder) => reminder.diaryMaintenanceId === item.id
      );
      countMap[item.id] = matchingReminders.length;
      return countMap;
    },
    {}
  );
  //---------------------------END FOR STOCK COUNT DISPLAY

  return (
    <View style={styles.container}>
      {isDeleting && (
        <View style={styles.loadingContainer}>
          <LoadingComponent />
        </View>
      )}
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.screenTitle}>DIARY MAINTENANCE</Text>
        <View>
          <DiarySwitchTabs
            selectionMode={1}
            option1="Maintenance Tracker"
            option2="Stock Tracker"
            onSelectSwitch={onSelectSwitch}
          />
        </View>
        {trackerTab == 1 && (
          <View>
            {diaryMaintenanceData.length === 0 ? (
              <Text style={styles.emptyMessage}>Set diary maintenance</Text>
            ) : (
              diaryMaintenanceData.map((item) => (
                <TouchableHighlight
                  style={[
                    styles.trackerContainerMT,
                    item.id === selectedDiaryMaintenanceId,
                  ]}
                  onLongPress={() => handleLongPress(item.id)}
                  underlayColor="transparent"
                  key={item.id}
                >
                  <View style={styles.reminderNameContainer}>
                    <View style={styles.xButtonContainer}>
                      <Text style={styles.maintenanceName}>
                        {item.reminderName}
                      </Text>
                      {renderXButton(item.id)}
                    </View>
                    {renderReminderSchedule(item.reminderSched)}
                    {renderReminderTimes(item, diaryRemindersData)}
                  </View>
                </TouchableHighlight>
              ))
            )}
          </View>
        )}
        {trackerTab == 2 && (
          <View>
            {diaryMaintenanceData.length === 0 ? (
              <Text style={styles.emptyMessage}>Set diary maintenance</Text>
            ) : (
              diaryMaintenanceData.map((item) => (
                <View style={styles.trackerContainerST} key={item.id}>
                  <Text style={styles.maintenanceNameST}>
                    {item.reminderName}
                  </Text>
                  <View style={styles.rowContainer}>
                    <View style={styles.row}>
                      <Text>Stocks left :</Text>
                      <View style={styles.numberContainer}>
                        <Text style={styles.numberText}>
                          {item.medicineStock}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.row}>
                      <Text>Medicine to take :</Text>
                      <View style={styles.numberContainer}>
                        <Text>{remindersCountByMaintenance[item.id]}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleCreateDiaryMaintenance}
      >
        <Iconify icon="ic:outline-add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        isVisible={isDeleteModalVisible}
        onBackdropPress={closeDeleteModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete this diary maintenance?
          </Text>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={closeDeleteModal} color="#EC6F56" />
            <Button
              title="Delete"
              onPress={handleDeleteConfirm}
              color="#EC6F56"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DiaryMaintenanceScreen;
