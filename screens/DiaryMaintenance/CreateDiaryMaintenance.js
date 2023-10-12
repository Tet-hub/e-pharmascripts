import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
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

  const [userId, setUserId] = useState(null); // State to store the user ID

  const [alarmTimes, setAlarmTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSelectedAlarm, setShowSelectedAlarm] = useState(false);

  const [selectedAlarmTime, setSelectedAlarmTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = ["S", "M", "T", "W", "TH", "F", "ST"];

  useEffect(() => {
    // Fetch the user ID when the component mounts
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

  const handleSetAlarmTime = () => {
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
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS

    if (selectedDate) {
      setSelectedAlarmTime(selectedDate); // Store the selected alarm time
      setAlarmTimes((prevAlarmTimes) => [...prevAlarmTimes, selectedDate]);
    }
  };

  // Function to handle the delete action
  const handleDeleteAlarm = (index) => {
    // Create a copy of the alarmTimes array
    const updatedAlarmTimes = [...alarmTimes];

    // Remove the alarm at the specified index
    updatedAlarmTimes.splice(index, 1);

    // Update the alarmTimes state with the modified array
    setAlarmTimes(updatedAlarmTimes);
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
  const [alarmName, setAlarmName] = useState("");
  const [alarmDescription, setAlarmDescription] = useState("");
  const [medicineStock, setMedicineStock] = useState("");

  //HANDLE TEXTINPUTS-------------------------------------
  const handleMedicineStockChange = (inputText) => {
    const numericInput = inputText.replace(/[^0-9]/g, "");
    if (numericInput.length <= 5) {
      setMedicineStock(numericInput);
    }
  };

  const handleAlarmNameChange = (inputText) => {
    if (inputText.length <= 50) {
      const capitalizedInput =
        inputText.charAt(0).toUpperCase() + inputText.slice(1);
      setAlarmName(capitalizedInput);
    }
  };

  const handleAlarmDescriptionChange = (inputText) => {
    if (inputText.length <= 100) {
      const capitalizedInput =
        inputText.charAt(0).toUpperCase() + inputText.slice(1);
      setAlarmDescription(capitalizedInput);
    }
  };

  const handleAddButtonPress = () => {
    if (
      !alarmName ||
      !alarmDescription ||
      !medicineStock ||
      !selectedAlarmTime ||
      selectedDays.length === 0
    ) {
      ToastAndroid.show("All fields are required.", ToastAndroid.LONG);
    } else {
      create();
    }
  };

  //clear input fields
  const clearInputFields = () => {
    setAlarmName("");
    setAlarmDescription("");
    setMedicineStock("");
    setSelectedAlarmTime(null);
    setAlarmTimes([]); // Clear the alarmTimes array
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
      const alarmTime = selectedAlarmTime
        ? Timestamp.fromDate(selectedAlarmTime)
        : null;

      // Create an array to store the selected days as numbers
      const selectedDaysNumbers = selectedDays.map((day) =>
        daysOfWeek.indexOf(day)
      );

      // Create a new diaryMaintenance document
      const docRef = await addDoc(collection(db, "diaryMaintenance"), {
        userId: userId, // Insert the user ID into the Firestore document
        alarmName: alarmName,
        alarmDescription: alarmDescription,
        medicineStock: medicineStock,
        alarmSched: selectedDaysNumbers, // Store the selected days as an array of numbers
      });

      // Add alarms to the "diaryAlarms" collection
      for (const alarm of alarmTimes) {
        await addDoc(collection(db, "diaryAlarms"), {
          alarmTime: Timestamp.fromDate(alarm),
          diaryMaintenanceId: docRef.id, // Reference to the diaryMaintenance document
          switchState: false, // Default switch state to true
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
                placeholder="Alarm name..."
                value={alarmName}
                onChangeText={handleAlarmNameChange}
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
                placeholder="Alarm description..."
                value={alarmDescription}
                onChangeText={handleAlarmDescriptionChange}
                maxLength={100}
                autoCapitalize="sentences"
              />
            </View>
          </View>

          <View style={styles.setAlarmNoteView}>
            <View style={styles.setAlarmView}>
              <Text
                style={styles.setAlarmText}
                onPress={() => {
                  handleSetAlarmTime();
                  setShowSelectedAlarm(true);
                }}
              >
                Set alarm
              </Text>
            </View>
            <Text style={styles.alarmNoteText}>
              Press this set button to set alarms
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

          <View style={styles.alarmsView}>
            <Text style={styles.alarmsText}>Alarms</Text>
            {alarmTimes.length === 0 ? (
              <Text style={styles.noAlarmsText}>No alarms yet</Text>
            ) : (
              <View>
                {alarmTimes.map((alarm, index) => (
                  <View key={index} style={styles.alarmContainer}>
                    <Text style={styles.alarmTimeText}>
                      {alarm.getHours()}:
                      {String(alarm.getMinutes()).padStart(2, "0")}{" "}
                      {alarm.getHours() >= 12 ? "PM" : "AM"}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => handleDeleteAlarm(index)}
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
