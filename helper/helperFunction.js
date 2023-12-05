import { showMessage } from "react-native-flash-message";
import * as Location from "expo-location";

export const locationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.error("Location permission not granted");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude, heading } = location.coords;
    return { latitude, longitude, heading };
  } catch (error) {
    console.error("Error getting current location:", error);
    throw error;
  }
};

export const getLiveLocation = async () => {
  const isPermissionGranted = await locationPermission();

  if (!isPermissionGranted) {
    console.error("Location permission not granted");
    return null;
  }

  try {
    const { latitude, longitude, heading } = await getCurrentLocation();
    console.log("Current location:", latitude, longitude, "Heading:", heading);
    return { latitude, longitude, heading };
  } catch (error) {
    console.error("Error getting live location:", error);
    return null;
  }
};

const showError = (message) => {
  showMessage({
    message,
    type: "danger",
    icon: "danger",
  });
};

const showSuccess = (message) => {
  showMessage({
    message,
    type: "success",
    icon: "success",
  });
};

export { showError, showSuccess };
