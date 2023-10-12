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
  const [alarmTimes, setAlarmTimes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSelectedAlarm, setShowSelectedAlarm] = useState(false);

  const [selectedAlarmTime, setSelectedAlarmTime] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const daysOfWeek = ["S", "M", "T", "W", "TH", "F", "ST"];
  const [isDeleteIconDisabled, setIsDeleteIconDisabled] = useState(false);

  useEffect(() => {
    setIsDeleteIconDisabled(alarmTimes.length <= 1);
  }, [alarmTimes]);

  const handleSetAlarmTime = () => {
    setShowDatePicker(true);
  };

  const handleDateTimeChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS

    if (selectedDate) {
      setSelectedAlarmTime(selectedDate); // Store the selected alarm time
      setAlarmTimes((prevAlarmTimes) => [...prevAlarmTimes, selectedDate]);
    }
  };

  //const
  route = useRoute();
  const { diaryID, userID } = route.params;

  const [alarmsData, setAlarmsData] = useState([]);

  // State to hold fetched data
  const [diaryMaintenanceData, setDiaryMaintenanceData] = useState({
    alarmName: "",
    alarmDescription: "",
    alarmSched: [],
    alarmTime: [],
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

  // Function to add a fetched alarm time to the alarmTimes array
  const addFetchedAlarmTime = (fetchedAlarmTime) => {
    setAlarmTimes((prevAlarmTimes) => [...prevAlarmTimes, fetchedAlarmTime]);
  };

  const deleteDiaryAlarm = async (alarmTime) => {
    try {
      // Query the diaryAlarms collection for the specific alarm time
      const diaryAlarmsCollectionRef = collection(db, "diaryAlarms");
      const querySnapshot = await getDocs(
        query(
          diaryAlarmsCollectionRef,
          where("diaryMaintenanceId", "==", diaryID),
          where("alarmTime", "==", Timestamp.fromDate(alarmTime))
        )
      );

      // Delete the matching documents
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting diaryAlarms document: ", error);
    }
  };

  const handleDeleteAlarm = (index) => {
    const updatedAlarmTimes = [...alarmTimes];
    const deletedAlarmTime = updatedAlarmTimes[index];
    updatedAlarmTimes.splice(index, 1);
    setAlarmTimes(updatedAlarmTimes);

    if (index < alarmsData.length) {
      deleteDiaryAlarm(deletedAlarmTime);
    } else if (updatedAlarmTimes.length === 1) {
      // Show the toast message when there is one alarm left
      ToastAndroid.show("Alarms cannot be left empty", ToastAndroid.LONG);
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
            alarmName: data.alarmName,
            alarmDescription: data.alarmDescription,
            alarmSched: data.alarmSched,
            medicineStock: data.medicineStock,
            // ... (other fields)
          });

          // Convert the numeric alarmSched values to day strings
          const selectedDaysFromAlarmSched = data.alarmSched.map(
            (numericDay) => daysOfWeek[numericDay]
          );

          // Update the selectedDays state with the converted array
          setSelectedDays(selectedDaysFromAlarmSched);

          // Fetch data from diaryAlarms collection based on diaryMaintenanceId
          const diaryAlarmsCollectionRef = collection(db, "diaryAlarms");
          const querySnapshot = await getDocs(
            query(
              diaryAlarmsCollectionRef,
              where("diaryMaintenanceId", "==", diaryID)
            )
          );

          const alarmsData = [];
          querySnapshot.forEach((doc) => {
            const alarmData = doc.data();
            // Convert alarmTime to a JavaScript Date object
            const alarmTime = alarmData.alarmTime.toDate();
            // Format the alarmTime as HH:MM AM/PM
            const formattedAlarmTime =
              `${alarmTime.getHours()}:${String(
                alarmTime.getMinutes()
              ).padStart(2, "0")}` +
              ` ${alarmTime.getHours() >= 12 ? "PM" : "AM"}`;
            alarmData.alarmTime = formattedAlarmTime;
            alarmsData.push(alarmData);

            // Add the fetched alarm time to the alarmTimes array
            addFetchedAlarmTime(alarmTime);
          });

          // Set the alarmsData state
          setAlarmsData(alarmsData);

          // Now, alarmsData contains the alarms related to this diaryMaintenanceId
          // You can set it in your state or handle it as needed
          //console.log("Alarms Data:", alarmsData);
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
  const handleAlarmNameChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 50);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      alarmName: formattedText,
    }));
  };

  const handleMedicineStockChange = (text) => {
    const numericInput = text.replace(/[^0-9]/g, "").slice(0, 5);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      medicineStock: numericInput,
    }));
  };

  handleAlarmDescriptionChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 100);

    setDiaryMaintenanceData((prevData) => ({
      ...prevData,
      alarmDescription: formattedText,
    }));
  };

  const handleUpdateButtonPress = () => {
    if (
      !diaryMaintenanceData.alarmName ||
      !diaryMaintenanceData.alarmDescription ||
      alarmTimes.length === 0 ||
      selectedDays.length === 0 ||
      !diaryMaintenanceData.medicineStock
    ) {
      ToastAndroid.show("All fields are required.", ToastAndroid.LONG);
    } else {
      updateDiary();
    }
  };

  // Function to update the Firestore document and replace alarm times
  const updateDiary = async () => {
    try {
      // Reference to the Firestore document for diary maintenance
      const diaryDocRef = doc(db, "diaryMaintenance", diaryID);

      // Prepare the data to update the document
      const updatedData = {
        alarmName: diaryMaintenanceData.alarmName,
        alarmDescription: diaryMaintenanceData.alarmDescription,
        alarmSched: selectedDays.map((day) => daysOfWeek.indexOf(day)),
        medicineStock: diaryMaintenanceData.medicineStock,
        // ... (other fields)
      };

      // Delete all existing documents in the diaryAlarms collection for this diaryID
      const diaryAlarmsCollectionRef = collection(db, "diaryAlarms");
      const querySnapshot = await getDocs(
        query(
          diaryAlarmsCollectionRef,
          where("diaryMaintenanceId", "==", diaryID)
        )
      );

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Insert alarm times into the diaryAlarms collection
      for (const alarm of alarmTimes) {
        await addDoc(diaryAlarmsCollectionRef, {
          diaryMaintenanceId: diaryID, // Reference to the diaryMaintenance document
          alarmTime: Timestamp.fromDate(alarm),
          switchState: true, // Default switch state to true
        });
      }

      // Update the document with the new data
      await updateDoc(diaryDocRef, updatedData);

      // Display success messages
      ToastAndroid.show("Data updated successfully", ToastAndroid.LONG);

      navigation.goBack();
    } catch (error) {
      console.error("Error updating data or replacing alarm times: ", error);
      // Handle error (e.g., show an error message)
      ToastAndroid.show(
        "Error updating data or replacing alarm times",
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
              placeholder="Alarm name..."
              value={diaryMaintenanceData.alarmName}
              onChangeText={handleAlarmNameChange}
            />
          </View>
        </View>

        <View style={styles.descriptionView}>
          <Text style={styles.descriptionText}>Description :</Text>
          <View style={styles.descriptionInputView}>
            <TextInput
              style={styles.placeholderStyle}
              placeholder="Alarm description..."
              value={diaryMaintenanceData.alarmDescription}
              onChangeText={handleAlarmDescriptionChange}
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
          {alarmTimes.length > 0 ? (
            <View>
              {alarmTimes.map((alarm, index) => (
                <View key={index} style={styles.alarmContainer}>
                  <Text style={styles.alarmTimeText}>
                    {alarm.getHours()}:
                    {String(alarm.getMinutes()).padStart(2, "0")}{" "}
                    {alarm.getHours() >= 12 ? "PM" : "AM"}
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => handleDeleteAlarm(index)}
                    disabled={alarmTimes.length <= 1}
                  >
                    <View style={styles.deleteIcon}>
                      <Iconify
                        icon="ic:outline-delete"
                        size={30}
                        color={alarmTimes.length <= 1 ? "#CCC" : "#DC3642"}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noAlarmsText}>No alarms yet</Text>
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
