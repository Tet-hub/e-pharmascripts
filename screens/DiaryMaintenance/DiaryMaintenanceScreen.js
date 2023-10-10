import { View, Text, StyleSheet, Switch, Dimensions } from "react-native";
import React, { useState } from "react";
import { Iconify } from "react-native-iconify";
import DiarySwitchTabs from "../../components/DiarySwitchTabs";
import styles from "./stylesheet";
import { getAuthToken } from "../../src/authToken";

const DiaryMaintenanceScreen = () => {
  const [trackerTab, setTrackerTab] = useState(1);
  const onSelectSwitch = (value) => {
    setTrackerTab(value);
  };
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsEnabled((prevState) => !prevState);
  };
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
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
          <Text style={styles.takeText}>Time to take your medicines!</Text>
          <View style={styles.trackerContainerMT}>
            <Text style={styles.maintenanceName}>High blood maintenance</Text>
            <View style={styles.switchButtonContainer}>
              <Text style={styles.timeText}>8:00 AM</Text>
              <Switch
                value={isNotificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ true: "#EC6F56", false: "gray" }}
                thumbColor={isNotificationsEnabled ? "white" : "white"}
                style={{ marginRight: 10 }}
              />
            </View>
            <Text style={styles.whenText}>Daily</Text>
          </View>
        </View>
      )}
      {trackerTab == 2 && (
        <View>
          <Text style={styles.takeText}>
            Your medicine is running out of stock!
          </Text>
          <View style={styles.trackerContainerST}>
            <Text style={styles.maintenanceName}>High blood maintenance</Text>
            <View style={styles.rowContainer}>
              <View style={styles.row}>
                <Text>Stocks left :</Text>
                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>4</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text>Medicine to take for today :</Text>
                <View style={styles.numberContainer}>
                  <Text>3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      <View style={styles.addButton}>
        <Iconify icon="ic:outline-add" size={30} color="white" />
      </View>
    </View>
  );
};

export default DiaryMaintenanceScreen;
