import React, { Component, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useNavigation } from "@react-navigation/native";
import AddressPickup from "../../components/map/AddressPickup";
import CustomBtn from "../../components/map/CustomBtn";
import { showError } from "../../helper/helperFunction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

// Ignore specific logs
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const ChooseLocation = ({ route }) => {
  const navigation = useNavigation();

  const [state, setState] = useState({
    destinationCords: {},
  });
  const { destinationCords } = state;
  const [fullAddress, setFullAddress] = useState("");

  const checkValid = () => {
    if (Object.keys(destinationCords).length === 0) {
      showError("Please enter your destination location");
      return false;
    }
    return true;
  };

  const onDone = async () => {
    const isValid = checkValid();
    if (isValid) {
      try {
        // Save destinationCords and fullAddress to AsyncStorage
        const dataToSave = {
          destinationCords,
          fullAddress: fullAddress, // Use an empty string if placeholderText is undefined
        };

        await AsyncStorage.setItem(
          "destinationData",
          JSON.stringify(dataToSave)
        );

        route.params.getCordinates(dataToSave);

        // Go back to the previous screen
        navigation.goBack();
      } catch (error) {
        console.error("Error saving destinationCords:", error);
      }
    }
  };

  const fetchDestinationCords = (lat, lng, zipCode, cityText, fullAddress) => {
    console.log("zip code==>>>", zipCode);
    console.log("city texts", cityText);
    console.log(fullAddress);
    setState((prev) => ({
      ...prev,
      destinationCords: {
        latitude: lat,
        longitude: lng,
      },
      fullAddress: fullAddress,
    }));
    setFullAddress(fullAddress);

    route.params.getCordinates({
      destinationCords: {
        latitude: lat,
        longitude: lng,
      },
      fullAddress: fullAddress || "",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: "white", flex: 1, padding: 24 }}
      >
        <View style={{ marginBottom: 16 }} />
        <AddressPickup
          placeholderText="Enter Destination Location"
          fetchAddress={fetchDestinationCords}
        />
        <CustomBtn
          btnText="Done"
          onPress={onDone}
          btnStyle={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ChooseLocation;
