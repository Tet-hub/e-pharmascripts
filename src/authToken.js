import AsyncStorage from "@react-native-async-storage/async-storage";

// Get the current userId from AsyncStorage
export const getCurrentUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    return userId;
  } catch (error) {
    console.log("Error retrieving userId:", error);
    return null;
  }
};
// Get the current userId from AsyncStorage
export const getCurrentEmail = async () => {
  try {
    const email = await AsyncStorage.getItem("email");
    return email;
  } catch (error) {
    console.log("Error retrieving email:", error);
    return null;
  }
};

export const getCurrentCustomerName = async () => {
  try {
    const customerName = await AsyncStorage.getItem("customerName");
    return customerName;
  } catch (error) {
    console.log("Error retrieving name:", error);
    return null;
  }
};

// Save the user's email and authentication token to AsyncStorage
export const saveAuthToken = async (
  email,
  token,
  userId,
  profileImage,
  customerName
) => {
  try {
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("userId", userId);
    await AsyncStorage.setItem("profileImage", profileImage);
    await AsyncStorage.setItem("customerName", customerName);

    console.log(
      "Authentication token saved successfully in saveAuthToken:",
      email,
      // token,
      userId,
      profileImage,
      customerName
    );
  } catch (error) {
    console.log("Error saving authentication token:", error);
  }
};

// Retrieve the user's email and authentication token from AsyncStorage
export const getAuthToken = async () => {
  try {
    const email = await AsyncStorage.getItem("email");
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    const profileImage = await AsyncStorage.getItem("profileImage");
    const customerName = await AsyncStorage.getItem("customerName");
    console.log(
      "Retrieved from AsyncStorage/getAuthToken:",
      email,
      token,
      userId,
      profileImage,
      customerName
    );
    return { email, token, userId };
  } catch (error) {
    console.log("Error retrieving authentication token:", error);
    return null;
  }
};

export const deleteAuthToken = async () => {
  try {
    const email = await AsyncStorage.deleteItem("email");
    const token = await AsyncStorage.deleteItem("token");
    const userId = await AsyncStorage.deleteItem("userId");
    const profileImage = await AsyncStorage.deleteItem("profileImage");
    const customerName = await AsyncStorage.deleteItem("customerName");
    console.log(
      "Deleted email, token and uid from AsyncStorage/getAuthToken:",
      email,
      token,
      userId
    );
    return { email, token, userId };
  } catch (error) {
    console.error("Error retrieving authentication token:", error);
    return null;
  }
};
