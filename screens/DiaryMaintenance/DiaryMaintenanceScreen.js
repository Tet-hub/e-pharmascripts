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
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Iconify } from 'react-native-iconify';
import DiarySwitchTabs from '../../components/DiarySwitchTabs';
import { LoadingComponent, useIsDeleting } from '../../components/DiaryLoadingDelete';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/firebase';
import { collection, deleteDoc, query, where, onSnapshot, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { getAuthToken } from '../../src/authToken';
import Modal from 'react-native-modal';
import styles from './dms';
import { DateTime } from 'luxon';

const DiaryMaintenanceScreen = () => {
	const navigation = useNavigation();
	const [trackerTab, setTrackerTab] = useState(1);
	const [userId, setUserId] = useState(null);
	const [diaryMaintenanceData, setDiaryMaintenanceData] = useState([]); // State to store fetched diary data
	const [diaryAlarmsData, setDiaryAlarmsData] = useState([]); // State to store diaryAlarms data
	const [selectedDiaryMaintenanceId, setSelectedDiaryMaintenanceId] = useState(null);
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
	const [isXButtonVisible, setIsXButtonVisible] = useState(true); // State to track whether X button should be visible
	const { isDeleting, startDeleting, stopDeleting } = useIsDeleting();
	const [checkAlarmInterval, setCheckAlarmInterval] = useState(null);

	const handleCreateDiaryMaintenance = () => {
		navigation.navigate('CreateDiaryMaintenance');
	};

	const handleUpdateDiaryMaintenance = (diaryMaintenanceId) => {
		navigation.navigate('UpdateDiaryMaintenance', {
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
				<TouchableOpacity style={styles.xButton} onPress={() => handleXButtonPress(diaryMaintenanceId)}>
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

			// Reference to the document to delete
			const diaryMaintenanceDocRef = doc(db, 'diaryMaintenance', selectedDiaryMaintenanceId);

			// Get the associated diaryAlarms documents
			const diaryAlarmsQuery = query(
				collection(db, 'diaryAlarms'),
				where('diaryMaintenanceId', '==', selectedDiaryMaintenanceId)
			);
			const diaryAlarmsSnapshot = await getDocs(diaryAlarmsQuery);

			// Delete the associated diaryAlarms documents
			const deletePromises = diaryAlarmsSnapshot.docs.map(async (diaryAlarmDoc) => {
				await deleteDoc(diaryAlarmDoc.ref);
			});

			// Wait for all diaryAlarms documents to be deleted
			await Promise.all(deletePromises);
			await deleteDoc(diaryMaintenanceDocRef);

			setSelectedDiaryMaintenanceId(null);
			closeDeleteModal();
			stopDeleting();
		} catch (error) {
			stopDeleting();
			console.error('Error deleting document:', error);
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
					collection(db, 'diaryMaintenance'),
					where('userId', '==', authToken.userId)
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
							setDiaryAlarmsData([]); // Clear diaryAlarmsData
						} else {
							// Query the 'diaryAlarms' collection to match diaryMaintenanceId with diaryMaintenance document IDs
							const diaryAlarmsQuery = query(
								collection(db, 'diaryAlarms'),
								where(
									'diaryMaintenanceId',
									'in',
									diaryMaintenanceData.map((item) => item.id)
								)
							);

							// Use onSnapshot to listen for changes in the 'diaryAlarms' collection
							const unsubscribeDiaryAlarms = onSnapshot(diaryAlarmsQuery, (querySnapshot) => {
								const initialDiaryAlarmsData = querySnapshot.docs.map((doc) => ({
									id: doc.id,
									...doc.data(),
								}));
								setDiaryAlarmsData(initialDiaryAlarmsData);

								// Log successful update
								//console.log("Diary Alarms Data Updated:", initialDiaryAlarmsData);
							});

							// Remember to unsubscribe when the component unmounts to prevent memory leaks
							return () => {
								unsubscribeDiaryMaintenance();
								unsubscribeDiaryAlarms();
							};
						}
					},
					(error) => {
						// Log error if there's an issue with onSnapshot
						console.error('Error in onSnapshot for diaryMaintenance:', error);
					}
				);
			} catch (error) {
				// Log error if there's an issue with fetching data
				console.error('Error fetching data:', error);
			}
		}

		fetchDiaryData();
	}, []);

	//---------------------------END OF FETCH

	//---------------------------TO DISPLAY THE SCHEDULE OF ALARMS
	const mapNumberToDay = (number) => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		return days[number];
	};

	const renderAlarmSchedule = (alarmSched) => {
		const allDays = [0, 1, 2, 3, 4, 5, 6];

		const isEveryday = allDays.every((day) => alarmSched.includes(day));

		if (isEveryday) {
			return <Text style={styles.whenText}>Everyday</Text>;
		} else {
			const normalWeek = [0, 1, 2, 3, 4, 5, 6];

			const sortedAlarmSched = alarmSched.sort((a, b) => normalWeek.indexOf(a) - normalWeek.indexOf(b));

			const dayNames = sortedAlarmSched.map((dayNumber) => mapNumberToDay(dayNumber));
			const scheduleText = dayNames.join(', ');

			return <Text style={styles.whenText}>{scheduleText}</Text>;
		}
	};

	//---------------------------END OF TO SCHEDULE ALARMS

	//---------------------------

	//Change the switchState field status based on the on/off button
	const handleSwitchToggleAndCheckAlarm = async (alarmId) => {
		// Find the alarm object that matches the alarmId
		const alarmToUpdate = diaryAlarmsData.find((item) => item.id === alarmId);

		if (alarmToUpdate) {
			try {
				const newSwitchState = !alarmToUpdate.switchState;

				// Update the switchState in the local state
				const updatedDiaryAlarmsData = diaryAlarmsData.map((item) => {
					if (item.id === alarmId) {
						return {
							...item,
							switchState: newSwitchState,
						};
					}
					return item;
				});

				setDiaryAlarmsData(updatedDiaryAlarmsData);

				// Update the switchState in Firestore
				const alarmDocRef = doc(db, 'diaryAlarms', alarmId);
				await updateDoc(alarmDocRef, {
					switchState: newSwitchState,
				});
				console.log('set new switchState', newSwitchState);
				// Check the alarm immediately after toggling the switch
				checkAlarm(alarmId, newSwitchState);
			} catch (error) {
				console.error('Error updating alarm switch state:', error);
			}
		}
	};

	const checkAlarm = async (alarmId, initialSwitchState) => {
		let switchState = initialSwitchState;

		while (switchState) {
			const currentTimeInPH = DateTime.now().setZone('Asia/Manila');
			const alarm = diaryAlarmsData.find((item) => item.id === alarmId);

			if (!alarm) {
				// Alarm no longer exists, stop checking
				break;
			}

			if (alarm && switchState === true && alarm.alarmTime?.seconds) {
				const alarmTime = DateTime.fromSeconds(alarm.alarmTime.seconds).setZone('Asia/Manila');
				const alarmHoursMinutes = alarmTime.toFormat('h:mm a');
				const currentTimeHoursMinutes = currentTimeInPH.toFormat('h:mm a');

				// Fetch the latest switchState from Firestore
				const alarmDocRef = doc(db, 'diaryAlarms', alarmId);
				const alarmDocSnap = await getDoc(alarmDocRef);
				if (!alarmDocSnap.exists()) {
					// Alarm document no longer exists, stop checking
					break;
				}
				const updatedSwitchState = alarmDocSnap.data().switchState;
				switchState = updatedSwitchState;

				// Fetch the alarmSched value associated with this alarm's diaryMaintenanceId
				const diaryMaintenanceId = alarm.diaryMaintenanceId;
				const diaryMaintenanceDocRef = doc(db, 'diaryMaintenance', diaryMaintenanceId);
				const diaryMaintenanceDocSnap = await getDoc(diaryMaintenanceDocRef);
				if (!diaryMaintenanceDocSnap.exists()) {
					// DiaryMaintenance document no longer exists, stop checking
					break;
				}

				const alarmSched = diaryMaintenanceDocSnap.data().alarmSched;
				const currentDay = currentTimeInPH.weekday;

				//console.log("Alarm Day:", alarmSched);
				//console.log("Current D:", currentDay);

				// Check if the numeric value of the current day is in the alarmSched array
				const isCurrentDayInAlarmSchedule = alarmSched.includes(currentDay);

				if (alarmHoursMinutes === currentTimeHoursMinutes && isCurrentDayInAlarmSchedule) {
					alert('ORAS NA!');
				} else {
					// console.log("No alarms yet");
				}

				// Wait for a while before checking again (adjust the interval as needed)
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} else {
				// Stop further execution when switchState is false or alarm data is missing
				break;
			}
		}
	};

	// Usage:
	// Call handleSwitchToggleAndCheckAlarm to start the process
	// Example: handleSwitchToggleAndCheckAlarm(alarmId);

	// Initialize an object to store interval IDs for each alarm
	const alarmIntervals = {};

	// Call the function to start checking for each alarm when the component mounts
	useEffect(() => {
		diaryAlarmsData.forEach((alarm) => {
			if (alarm.switchState) {
				checkAlarm(alarm.id);
			}
		});
	}, [diaryAlarmsData]);

	//---------------------------FOR DISPLAYg
	const renderAlarmTimes = (maintenanceItem, alarmsData) => {
		// Filter alarms that match the current maintenance item's ID
		const matchingAlarms = alarmsData.filter((item) => item.diaryMaintenanceId === maintenanceItem.id);

		return (
			<View style={styles.columnContainer}>
				{matchingAlarms.map((item, index) => {
					const alarmTime = item.alarmTime?.seconds ? new Date(item.alarmTime.seconds * 1000) : null;

					const hours = alarmTime.getHours();
					const minutes = String(alarmTime.getMinutes()).padStart(2, '0');
					const period = hours >= 12 ? 'PM' : 'AM';

					// Log the switch state for the current alarm
					if (index === 0) {
						//console.log("Switch State:", item.switchState);
					}

					return (
						<View key={item.id} style={styles.alarmContainer}>
							<View>
								<Text style={styles.timeText}>
									{hours}:{minutes} {period}
								</Text>
							</View>
							<View style={styles.switchContainer}>
								<Switch
									value={item.switchState}
									onValueChange={() => handleSwitchToggleAndCheckAlarm(item.id)}
									trackColor={{ true: '#EC6F56', false: 'gray' }}
									thumbColor={item.switchState ? 'white' : '#8E8E8E'} // Use different colors based on switch state
									style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
								/>
							</View>
						</View>
					);

					return null; // Handle cases where alarmTime is not available
				})}
			</View>
		);
	};
	//---------------------------END FOR DISPLAY

	//---------------------------FOR STOCK COUNT DISPLAY
	const alarmsCountByMaintenance = diaryMaintenanceData.reduce((countMap, item) => {
		const matchingAlarms = diaryAlarmsData.filter((alarm) => alarm.diaryMaintenanceId === item.id);
		countMap[item.id] = matchingAlarms.length;
		return countMap;
	}, {});
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
									style={[styles.trackerContainerMT, item.id === selectedDiaryMaintenanceId]}
									onLongPress={() => handleLongPress(item.id)}
									underlayColor="transparent"
									key={item.id}
								>
									<View style={styles.alarmNameContainer}>
										<View style={styles.xButtonContainer}>
											<Text style={styles.maintenanceName}>{item.alarmName}</Text>
											{renderXButton(item.id)}
										</View>
										{renderAlarmSchedule(item.alarmSched)}
										{renderAlarmTimes(item, diaryAlarmsData)}
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
									<Text style={styles.maintenanceNameST}>{item.alarmName}</Text>
									<View style={styles.rowContainer}>
										<View style={styles.row}>
											<Text>Stocks left :</Text>
											<View style={styles.numberContainer}>
												<Text style={styles.numberText}>{item.medicineStock}</Text>
											</View>
										</View>

										<View style={styles.row}>
											<Text>Medicine to take :</Text>
											<View style={styles.numberContainer}>
												<Text>{alarmsCountByMaintenance[item.id]}</Text>
											</View>
										</View>
									</View>
								</View>
							))
						)}
					</View>
				)}
			</ScrollView>

			<TouchableOpacity style={styles.addButton} onPress={handleCreateDiaryMaintenance}>
				<Iconify icon="ic:outline-add" size={30} color="white" />
			</TouchableOpacity>

			<Modal isVisible={isDeleteModalVisible} onBackdropPress={closeDeleteModal}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitle}>Confirm Deletion</Text>
					<Text style={styles.modalText}>Are you sure you want to delete this diary maintenance?</Text>
					<View style={styles.modalButtons}>
						<Button title="Cancel" onPress={closeDeleteModal} color="#EC6F56" />
						<Button title="Delete" onPress={handleDeleteConfirm} color="#EC6F56" />
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default DiaryMaintenanceScreen;
