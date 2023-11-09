import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Iconify } from "react-native-iconify";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  getDoc,
  query,
  getDocs,
  doc,
  where,
  updateDoc,
  Timestamp,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { useNavigation, useRoute } from "@react-navigation/native";
import styles from "./udm";

const UpdateDiaryMaintenance = () => {
  const navigation = useNavigation();
  //
  const [reminderTimes, setReminderTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSelectedReminder, setShowSelectedReminder] = useState(false);

  const [selectedReminderTime, setSelectedReminderTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = ["S", "M", "T", "W", "TH", "F", "ST"];
  const [isDeleteIconDisabled, setIsDeleteIconDisabled] = useState(false);

  useEffect(() => {
    setIsDeleteIconDisabled(reminderTimes.length <= 1);
  }, [reminderTimes]);

  const handleSetReminderTime = () => {
    setShowDatePicker(true);
  };

  //
  const handleDateTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      // Handle the cancel action
      setShowDatePicker(false);
    } else {
      setShowDatePicker(Platform.OS === "ios");

      if (selectedDate) {
        setSelectedReminderTime(selectedDate);
        setReminderTimes((prevReminderTimes) => [
          ...prevReminderTimes,
          selectedDate,
        ]);
      }
    }
  };

  //const
  route = useRoute();
  const { diaryID, userID } = route.params;

  const [remindersData, setRemindersData] = useState([]);

  // State to hold fetched data
  const [diaryMaintenanceData, setDiaryMaintenanceData] = useState({
    reminderName: "",
    reminderDescription: "",
    reminderSched: [],
    reminderTime: [],
    medicineStock: "",
  });

  //schedule
  const dayNameMapping = {
    S: "Sun",
    M: "Mon",
    T: "Tue",
    W: "Wed",
    TH: "Thu",
    F: "Fri",
    ST: "Sat",
  };

  const getRepetitionText = () => {
    if (selectedDays.length === 0) {
      return "Select schedule";
    } else if (selectedDays.length === 7) {
      return "Everyday";
    } else {
      // Create an array to represent the normal week starting from Sunday
      const normalWeek = ["S", "M", "T", "W", "TH", "F", "ST"];

      // Sort the selected days based on their position in the normal week
      const sortedSelectedDays = selectedDays.sort(
        (a, b) => normalWeek.indexOf(a) - normalWeek.indexOf(b)
      );

      return sortedSelectedDays.map((day) => dayNameMapping[day]).join(", ");
    }
  };

  //
  const handleDaySelect = (day) => {
    const updatedDays = [...selectedDays];
    if (updatedDays.includes(day)) {
      updatedDays.splice(updatedDays.indexOf(day), 1);
    } else {
      updatedDays.push(day);
    }
    setSelectedDays(updatedDays);
  };

  // Function to add a fetched reminder time to the reminderTimes array
  const addFetchedReminderTime = (fetchedReminderTime) => {
    setReminderTimes((prevReminderTimes) => [
      ...prevReminderTimes,
      fetchedReminderTime,
    ]);
  };

  const deleteDiaryReminder = async (reminderTime) => {
    try {
      // Query the diaryReminders collection for the specific reminder time
      const diaryRemindersCollectionRef = collection(db, "diaryReminders");
      const querySnapshot = await getDocs(
        query(
          diaryRemindersCollectionRef,
          where("diaryMaintenanceId", "==", diaryID),
          where("reminderTime", "==", Timestamp.fromDate(reminderTime))
        )
      );

      // Delete the matching documents
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting diaryReminders document: ", error);
    }
  };

  const handleDeleteReminder = (index) => {
    const updatedReminderTimes = [...reminderTimes];
    const deletedReminderTime = updatedReminderTimes[index];
    updatedReminderTimes.splice(index, 1);
    setReminderTimes(updatedReminderTimes);

    if (index < remindersData.length) {
      deleteDiaryReminder(deletedReminderTime);
    } else if (updatedReminderTimes.length === 1) {
      // Show the toast message when there is one reminder left
      ToastAndroid.show("Reminders cannot be left empty", ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Reference to the Firestore document for diary maintenance
        const diaryDocRef = doc(db, "diaryMaintenance", diaryID);
        const docSnap = await getDoc(diaryDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Log the fetched data to the console for debugging
          // console.log("Fetched Data:", data);

          // Update the state with fetched data
          setDiaryMaintenanceData({
            reminderName: data.reminderName,
            reminderDescription: data.reminderDescription,
            reminderSched: data.reminderSched,
            medicineStock: data.medicineStock,
            // ... (other fields)
          });

          // Convert the numeric reminderSched values to day strings
          const selectedDaysFromReminderSched = data.reminderSched.map(
            (numericDay) => daysOfWeek[numericDay]
          );

          // Update the selectedDays state with the converted array
          setSelectedDays(selectedDaysFromReminderSched);

          // Fetch data from diaryReminders collection based on diaryMaintenanceId
          const diaryRemindersCollectionRef = collection(db, "diaryReminders");
          const querySnapshot = await getDocs(
            query(
              diaryRemindersCollectionRef,
              where("diaryMaintenanceId", "==", diaryID)
            )
          );

          const remindersData = [];
          querySnapshot.forEach((doc) => {
            const reminderData = doc.data();
            // Convert reminderTime to a JavaScript Date object
            const reminderTime = reminderData.reminderTime.toDate();
            // Format the reminderTime as HH:MM AM/PM
            const formattedReminderTime =
              `${reminderTime.getHours()}:${String(
                reminderTime.getMinutes()
              ).padStart(2, "0")}` +
              ` ${reminderTime.getHours() >= 12 ? "PM" : "AM"}`;
            reminderData.reminderTime = formattedReminderTime;
            remindersData.push(reminderData);

            // Add the fetched reminder time to the reminderTimes array
            addFetchedReminderTime(reminderTime);
          });

          // Set the remindersData state
          setRemindersData(remindersData);

          // Now, remindersData contains the reminders related to this diaryMaintenanceId
          // You can set it in your state or handle it as needed
          //console.log("Reminders Data:", remindersData);
        } else {
          console.error("Document does not exist");
          // Handle the case where the document does not exist
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle error (e.g., show a toast)
        ToastAndroid.show("Error fetching data", ToastAndroid.LONG);
      }
    };

    fetchData();
  }, [diaryID, userID]);

  // Function to map numeric values to day strings
  const mapNumericToDay = (numericDay) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek[numericDay];
  };

  //HANDLE TEXT INPUTS-----------------------
  const handleReminderNameChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 50);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      reminderName: formattedText,
    }));
  };

  const handleMedicineStockChange = (text) => {
    const numericInput = text.replace(/[^0-9]/g, "").slice(0, 5);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      medicineStock: numericInput,
    }));
  };

  handleReminderDescriptionChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 100);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      reminderDescription: formattedText,
    }));
  };

  const handleUpdateButtonPress = () => {
    if (
      !diaryMaintenanceData.reminderName ||
      !diaryMaintenanceData.reminderDescription ||
      reminderTimes.length === 0 ||
      selectedDays.length === 0 ||
      !diaryMaintenanceData.medicineStock
    ) {
      ToastAndroid.show("All fields are required.", ToastAndroid.LONG);
    } else {
      updateDiary();
    }
  };

  // Function to update the Firestore document and replace reminder times
  const updateDiary = async () => {
    try {
      // Reference to the Firestore document for diary maintenance
      const diaryDocRef = doc(db, "diaryMaintenance", diaryID);

      // Prepare the data to update the document
      const updatedData = {
        reminderName: diaryMaintenanceData.reminderName,
        reminderDescription: diaryMaintenanceData.reminderDescription,
        reminderSched: selectedDays.map((day) => daysOfWeek.indexOf(day)),
        medicineStock: diaryMaintenanceData.medicineStock,
        // ... (other fields)
      };

      // Delete all existing documents in the diaryReminders collection for this diaryID
      const diaryRemindersCollectionRef = collection(db, "diaryReminders");
      const querySnapshot = await getDocs(
        query(
          diaryRemindersCollectionRef,
          where("diaryMaintenanceId", "==", diaryID)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Insert reminder times into the diaryReminders collection
      for (const reminder of reminderTimes) {
        await addDoc(diaryRemindersCollectionRef, {
          diaryMaintenanceId: diaryID, // Reference to the diaryMaintenance document
          reminderTime: Timestamp.fromDate(reminder),
          switchState: true, // Default switch state to true
        });
      }

      // Update the document with the new data
      await updateDoc(diaryDocRef, updatedData);

      // Display success messages
      ToastAndroid.show("Data updated successfully", ToastAndroid.LONG);

      navigation.goBack();
    } catch (error) {
      console.error("Error updating data or replacing reminder times: ", error);
      // Handle error (e.g., show an error message)
      ToastAndroid.show(
        "Error updating data or replacing reminder times",
        ToastAndroid.LONG
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Edit maintenance & stock</Text>
      <View style={styles.diaryContainer}>
        <View style={styles.mainteNameView}>
          <Text style={styles.mainteNameText}>Maintenance name : </Text>
          <View style={styles.mainteInputView}>
            <TextInput
              style={styles.placeholderStyle}
              placeholder="Reminder name..."
              value={diaryMaintenanceData.reminderName}
              onChangeText={handleReminderNameChange}
            />
          </View>
        </View>

        <View style={styles.descriptionView}>
          <Text style={styles.descriptionText}>Description :</Text>
          <View style={styles.descriptionInputView}>
            <TextInput
              style={styles.placeholderStyle}
              placeholder="Reminder description..."
              value={diaryMaintenanceData.reminderDescription}
              onChangeText={handleReminderDescriptionChange}
            />
          </View>
        </View>

        <View style={styles.setReminderNoteView}>
          <View style={styles.setReminderView}>
            <Text
              style={styles.setReminderText}
              onPress={() => {
                handleSetReminderTime();
                setShowSelectedReminder(true);
              }}
            >
              Set reminder
            </Text>
          </View>
          <Text style={styles.reminderNoteText}>
            Press this set button to set reminders
          </Text>
        </View>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()} // Initialize with the current date
            mode="time" // Set the mode to "time"
            is24Hour={true}
            display="default"
            onChange={handleDateTimeChange}
          />
        )}

        <View style={styles.remindersView}>
          <Text style={styles.remindersText}>Reminders</Text>
          {reminderTimes.length > 0 ? (
            <View>
              {reminderTimes.map((reminder, index) => (
                <View key={index} style={styles.reminderContainer}>
                  <Text style={styles.reminderTimeText}>
                    {reminder.getHours()}:
                    {String(reminder.getMinutes()).padStart(2, "0")}{" "}
                    {reminder.getHours() >= 12 ? "PM" : "AM"}
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => handleDeleteReminder(index)}
                    disabled={reminderTimes.length <= 1}
                  >
                    <View style={styles.deleteIcon}>
                      <Iconify
                        icon="ic:outline-delete"
                        size={30}
                        color={reminderTimes.length <= 1 ? "#CCC" : "#DC3642"}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noRemindersText}>No reminders yet</Text>
          )}
        </View>

        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleText}>Schedules</Text>
          <Text style={styles.repetitionText}>{getRepetitionText()}</Text>
          <View style={styles.daysOfWeek}>
            {daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.selectedDay,
                ]}
                onPress={() => handleDaySelect(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day) && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.stockView}>
          <View style={styles.medStockView}>
            <Text style={styles.medStockText}>Medicine stock :</Text>
            <View style={styles.stockInputView}>
              <TextInput
                style={styles.stockPlaceholderStyle}
                placeholder="0"
                value={diaryMaintenanceData.medicineStock}
                onChangeText={handleMedicineStockChange}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.addButtonView}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleUpdateButtonPress}
          >
            <Text style={styles.addText}>Update diary</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UpdateDiaryMaintenance;
