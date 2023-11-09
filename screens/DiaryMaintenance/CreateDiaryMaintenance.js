import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ScrollView,
} from "react-native";
import { Iconify } from "react-native-iconify";
import DateTimePicker from "@react-native-community/datetimepicker";
import { collection, addDoc, Timestamp, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { useNavigation } from "@react-navigation/native";
import styles from "./cdm";

const CreateDiaryMaintenance = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState(null);

  const [reminderTimes, setReminderTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSelectedReminder, setShowSelectedReminder] = useState(false);

  const [selectedReminderTime, setSelectedReminderTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = ["S", "M", "T", "W", "TH", "F", "ST"];

  useEffect(() => {
    async function fetchUserId() {
      try {
        const authToken = await getAuthToken();
        setUserId(authToken.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    }

    fetchUserId();
  }, []);

  const handleSetReminderTime = () => {
    setShowDatePicker(true);
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

  //
  const handleDateTimeChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      // Handle the cancel action
      setShowDatePicker(false); // Close the date picker
    } else {
      setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS

      if (selectedDate) {
        setSelectedReminderTime(selectedDate); // Store the selected alarm time
        setReminderTimes((prevReminderTimes) => [
          ...prevReminderTimes,
          selectedDate,
        ]);
      }
    }
  };

  // Function to handle the delete action
  const handleDeleteReminder = (index) => {
    const updatedReminderTimes = [...reminderTimes];
    updatedReminderTimes.splice(index, 1);
    setReminderTimes(updatedReminderTimes);
  };

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

  //store data to the variable from TextInputs
  const [reminderName, setReminderName] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [medicineStock, setMedicineStock] = useState("");

  //HANDLE TEXTINPUTS-------------------------------------
  const handleMedicineStockChange = (inputText) => {
    const numericInput = inputText.replace(/[^0-9]/g, "");
    if (numericInput.length <= 5) {
      setMedicineStock(numericInput);
    }
  };

  const handleReminderNameChange = (inputText) => {
    if (inputText.length <= 50) {
      const capitalizedInput =
        inputText.charAt(0).toUpperCase() + inputText.slice(1);
      setReminderName(capitalizedInput);
    }
  };

  const handleReminderDescriptionChange = (inputText) => {
    if (inputText.length <= 100) {
      const capitalizedInput =
        inputText.charAt(0).toUpperCase() + inputText.slice(1);
      setReminderDescription(capitalizedInput);
    }
  };

  const handleAddButtonPress = () => {
    if (
      !reminderName ||
      !reminderDescription ||
      !medicineStock ||
      !selectedReminderTime ||
      selectedDays.length === 0
    ) {
      ToastAndroid.show("All fields are required.", ToastAndroid.LONG);
    } else {
      create();
    }
  };

  //clear input fields
  const clearInputFields = () => {
    setReminderName("");
    setReminderDescription("");
    setMedicineStock("");
    setSelectedReminderTime(null);
    setReminderTimes([]);
  };

  //insert data to firestore
  const create = async () => {
    try {
      // Check if the user ID is available
      if (!userId) {
        console.error("User ID not available.");
        return;
      }

      // Create a Firestore Timestamp object from selectedAlarmTime
      const reminderTime = selectedReminderTime
        ? Timestamp.fromDate(selectedReminderTime)
        : null;

      // Create an array to store the selected days as numbers
      const selectedDaysNumbers = selectedDays.map((day) =>
        daysOfWeek.indexOf(day)
      );

      // Create a new diaryMaintenance document
      const docRef = await addDoc(collection(db, "diaryMaintenance"), {
        userId: userId,
        reminderName: reminderName,
        reminderDescription: reminderDescription,
        medicineStock: medicineStock,
        reminderSched: selectedDaysNumbers,
      });

      for (const reminder of reminderTimes) {
        await addDoc(collection(db, "diaryReminders"), {
          reminderTime: Timestamp.fromDate(reminder),
          diaryMaintenanceId: docRef.id,
          switchState: false,
        });
      }

      clearInputFields();

      // Show a "Saved!" message
      ToastAndroid.show("Diary saved!", ToastAndroid.SHORT);
      console.log("Data submitted to Firestore");

      navigation.goBack();
    } catch (error) {
      // Show error message
      ToastAndroid.show("Diary creation failed!", ToastAndroid.LONG);
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.diaryContainer}>
          <Text style={styles.screenTitle}>New maintenance & stock</Text>
          <View style={styles.mainteNameView}>
            <Text style={styles.mainteNameText}>Maintenance name : </Text>
            <View style={styles.mainteInputView}>
              <TextInput
                style={styles.placeholderStyle}
                placeholder="Reminder name..."
                value={reminderName}
                onChangeText={handleReminderNameChange}
                maxLength={50}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          <View style={styles.descriptionView}>
            <Text style={styles.descriptionText}>Description :</Text>
            <View style={styles.descriptionInputView}>
              <TextInput
                style={styles.placeholderStyle}
                placeholder="Reminder description..."
                value={reminderDescription}
                onChangeText={handleReminderDescriptionChange}
                maxLength={100}
                autoCapitalize="sentences"
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
            {reminderTimes.length === 0 ? (
              <Text style={styles.noRemindersText}>No reminders yet</Text>
            ) : (
              <View>
                {reminderTimes.map((reminder, index) => (
                  <View key={index} style={styles.reminderContainer}>
                    <Text style={styles.reminderTimeText}>
                      {reminder.getHours()}:
                      {String(reminder.getMinutes()).padStart(2, "0")}{" "}
                      {reminder.getHours() >= 12 ? "PM" : "AM"}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => handleDeleteReminder(index)}
                    >
                      <Iconify
                        icon="ic:outline-delete"
                        size={30}
                        color="#DC3642"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
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
                  value={medicineStock}
                  onChangeText={handleMedicineStockChange}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.addButtonView}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddButtonPress}
            >
              <Text style={styles.addText}>Add diary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDiaryMaintenance;
