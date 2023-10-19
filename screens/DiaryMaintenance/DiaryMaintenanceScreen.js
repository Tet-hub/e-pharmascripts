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
import React, { useState, useEffect } from "react";
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
import { getAuthToken } from "../../src/authToken";
import Modal from "react-native-modal";
import styles from "./dms";
import { DateTime } from "luxon";

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
    openDeleteModal();
    setIsXButtonVisible(false); // Hide the X button when modal is opened
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
        checkReminder(reminderId, newSwitchState);
      } catch (error) {
        console.error("Error updating reminder switch state:", error);
      }
    }
  };

  const checkReminder = async (reminderId, initialSwitchState) => {
    let switchState = initialSwitchState;

    while (switchState) {
      const currentTimeInPH = DateTime.now().setZone("Asia/Manila");
      const reminder = diaryRemindersData.find(
        (item) => item.id === reminderId
      );

      if (!reminder) {
        // Reminder no longer exists, stop checking
        break;
      }

      if (reminder && switchState === true && reminder.reminderTime?.seconds) {
        const reminderTime = DateTime.fromSeconds(
          reminder.reminderTime.seconds
        ).setZone("Asia/Manila");
        const reminderHoursMinutes = reminderTime.toFormat("h:mm a");
        const currentTimeHoursMinutes = currentTimeInPH.toFormat("h:mm a");

        // Fetch the latest switchState from Firestore
        const reminderDocRef = doc(db, "diaryReminders", reminderId);
        const reminderDocSnap = await getDoc(reminderDocRef);
        if (!reminderDocSnap.exists()) {
          // Reminder document no longer exists, stop checking
          break;
        }
        const updatedSwitchState = reminderDocSnap.data().switchState;
        switchState = updatedSwitchState;

        // Fetch the reminderSched value associated with this reminder's diaryMaintenanceId
        const diaryMaintenanceId = reminder.diaryMaintenanceId;
        const diaryMaintenanceDocRef = doc(
          db,
          "diaryMaintenance",
          diaryMaintenanceId
        );
        const diaryMaintenanceDocSnap = await getDoc(diaryMaintenanceDocRef);
        if (!diaryMaintenanceDocSnap.exists()) {
          // DiaryMaintenance document no longer exists, stop checking
          break;
        }

        const reminderSched = diaryMaintenanceDocSnap.data().reminderSched;
        const currentDay = currentTimeInPH.weekday;

        //console.log("Reminder Day:", reminderSched);
        //console.log("Current D:", currentDay);

        // Check if the numeric value of the current day is in the reminderSched array
        const isCurrentDayInReminderchedule =
          reminderSched.includes(currentDay);

        if (
          reminderHoursMinutes === currentTimeHoursMinutes &&
          isCurrentDayInReminderchedule
        ) {
          alert("ORAS NA!");
        } else {
          // console.log("No reminders yet");
        }

        // Wait for a while before checking again (adjust the interval as needed)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        // Stop further execution when switchState is false or reminder data is missing
        break;
      }
    }
  };

  // Call the function to start checking for each reminder when the component mounts
  useEffect(() => {
    diaryRemindersData.forEach((reminder) => {
      if (reminder.switchState) {
        checkReminder(reminder.id);
      }
    });
  }, [diaryRemindersData]);

  //---------------------------FOR DISPLAYg
  const renderReminderTimes = (maintenanceItem, remindersData) => {
    // Filter reminders that match the current maintenance item's ID
    const matchingReminders = remindersData.filter(
      (item) => item.diaryMaintenanceId === maintenanceItem.id
    );

    return (
      <View style={styles.columnContainer}>
        {matchingReminders.map((item, index) => {
          const reminderTime = item.reminderTime?.seconds
            ? new Date(item.reminderTime.seconds * 1000)
            : null;

          const hours = reminderTime.getHours();
          const minutes = String(reminderTime.getMinutes()).padStart(2, "0");
          const period = hours >= 12 ? "PM" : "AM";

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
