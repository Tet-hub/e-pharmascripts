import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";
import { getCurrentUserId, saveAuthToken } from "../../src/authToken";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getDoc,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "../../firebase/firebase";
import {
  getDownloadURL,
  uploadBytes,
  ref,
  deleteObject,
} from "@firebase/storage";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { BASE_URL2 } from "../../utilities/backendURL";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileImage, setSelectedFileImage] = useState(null);
  const [fetchedStatus, setFetchedStatus] = useState("Unverified");
  const [rejectedReason, setRejectedReason] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditingEnabled =
    fetchedStatus === "Verified" ||
    fetchedStatus === "Unverified" ||
    fetchedStatus === "Rejected";
  const [updateUserData, setUpdateUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  //
  route = useRoute();
  const { userID } = route.params;
  const DefaultImage = require("../../assets/img/default-image.jpg");

  //date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const formatFetchDate = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    }

    return "";
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    }

    return "";
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // Close the picker on iOS
    if (selectedDate) {
      setSelectedDate(selectedDate); // Step 2
      const formattedDate = formatDate(selectedDate);
      setUpdateUserData({ ...updateUserData, dateOfBirth: formattedDate });
    }
  };

  //fetching data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "customers", userID);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();

          setUpdateUserData({
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender || "",
          });

          if (data.profileImage) {
            setSelectedImage(data.profileImage);
          }
          if (data.status) {
            setFetchedStatus(data.status);
          }
          if (data.status === "Rejected") {
            setRejectedReason(data.reason);
          }
          if (data.validId) {
            setSelectedFileImage(
              data.status === "Rejected" ? "" : data.validId
            );
          }
        } else {
          console.error("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchUserData();
  }, [userID]);

  //VALIDATE EDITS
  const validate = async () => {
    if (!updateUserData.firstName) {
      ToastAndroid.show("First name is required", ToastAndroid.LONG);
      return false;
    }
    if (!updateUserData.lastName) {
      ToastAndroid.show("Last name is required", ToastAndroid.LONG);
      return false;
    }
    if (updateUserData.phone.length !== 11) {
      ToastAndroid.show("Fill the phone number correctly", ToastAndroid.LONG);
      return false;
    }
    if (!updateUserData.gender) {
      ToastAndroid.show("Select a gender", ToastAndroid.LONG);
      return false;
    }
    /**if (!selectedFileImage) {
      ToastAndroid.show("Provide valid ID", ToastAndroid.LONG);
      return false;
    }**/
    if (!selectedImage) {
      ToastAndroid.show("Provide profile picture", ToastAndroid.LONG);
      return false;
    }

    return true; // Validation passed
  };

  //updating data firestore
  const updateProfile = async () => {
    const isValid = await validate();

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "customers", userID);
      let imageUrl = null;
      let fileImageUrl = null;

      if (selectedImage) {
        imageUrl = await uploadImageAsync(selectedImage);
      }

      if (selectedFileImage) {
        fileImageUrl = await uploadChooseID(selectedFileImage);
      }

      const userData = {
        firstName: updateUserData.firstName,
        lastName: updateUserData.lastName,
        phone: updateUserData.phone,
        dateOfBirth: selectedDate || updateUserData.dateOfBirth,
        gender: updateUserData.gender,
      };

      if (imageUrl) {
        userData.profileImage = imageUrl;
        await AsyncStorage.setItem("profileImage", imageUrl);
      }

      if (fetchedStatus === "Verified") {
        userData.status = "Verified";
      } else {
        userData.status = fileImageUrl ? "Pending" : "Unverified";
      }

      if (fetchedStatus === "Verified") {
        userData.validId = fileImageUrl;
      } else {
        userData.validId = fileImageUrl || "";
      }

      console.log("userData.validId:", userData.validId);

      await updateDoc(userRef, userData);
      const customerName = `${updateUserData.firstName} ${updateUserData.lastName}`;
      await AsyncStorage.setItem("customerName", customerName);
      ToastAndroid.show("Profile updated", ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {
      // Handle any errors that occur during the update.
      console.error("Error updating user data in Firestore: ", error);
    } finally {
      setLoading(false); // Step 3: Hide activity indicator after submission
    }
  };

  //image picker for profile picture
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
    }
  };
  const getFileNameFromURL = (url) => {
    if (url) {
      const parts = url.split("/");
      return parts[parts.length - 1];
    }
    return "";
  };
  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Image/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);

      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  //image picker for valid ID
  const handleChooseID = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setSelectedFileImage(selectedAsset.uri);
    }
  };
  const uploadChooseID = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Image/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);

      const userToken = await getCurrentUserId();

      try {
        const response = await axios.post(`${BASE_URL2}/post/admin/sendToFCM`, {
          title: "New Account Verification",
          body: `Please review and verify this account ${userToken}.`,
        });

        console.log("Notification sent to Admin FCM:", response.data);
      } catch (error) {
        console.error("Error sending notification:", error);
      }

      await addDoc(collection(db, "notifications"), {
        title: "New Account Verification",
        body: `Please review and verify this account ${userToken}.`,
        receiverId: "adminId",
        senderId: userToken,
        read: false,
        createdAt: serverTimestamp(),
      });

      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  //HANDLE INPUTS
  const handleFirstNameChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 30);

    setUpdateUserData((prevData) => ({
      ...prevData,
      firstName: formattedText,
    }));
  };
  const handleLastNameChange = (text) => {
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1, 30);

    setUpdateUserData((prevData) => ({
      ...prevData,
      lastName: formattedText,
    }));
  };

  const handlePhone = (text) => {
    const cleanedText = text.replace(/\D/g, "");

    // Ensure it starts with "09" and doesn't exceed a specific length
    const formattedPhone = cleanedText.startsWith("09")
      ? cleanedText.substring(0, 11) // Already starts with "09"
      : `09${cleanedText}`.substring(0, 11); // Add "09" if not present

    // Update the state with the formatted phone number
    setUpdateUserData((prevData) => ({
      ...prevData,
      phone: formattedPhone,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.wholeContainer}>
        <View style={styles.upperContainer}>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.pic_cont}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.pic_cont}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Image
                source={DefaultImage}
                style={styles.pic_cont}
                className="w-full h-full rounded-full"
              />
            )}
          </View>

          <TouchableOpacity onPress={isEditingEnabled ? pickImageAsync : null}>
            {isEditingEnabled && (
              <IconSimple
                style={styles.camera}
                name="camera"
                size={16}
                color="white"
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.lowerContainer}>
          <View style={styles.labelInfoCont}>
            <Text style={styles.label}>First name</Text>
            <View style={styles.infoContView}>
              <TextInput
                style={[
                  styles.info,
                  (!isEditingEnabled || fetchedStatus === "Verified") &&
                    styles.disabledInput,
                ]}
                placeholder="First name"
                value={updateUserData.firstName}
                onChangeText={handleFirstNameChange}
                editable={isEditingEnabled && fetchedStatus !== "Verified"}
              />
            </View>
          </View>

          <View style={styles.labelInfoCont}>
            <Text style={styles.label}>Last name</Text>
            <View style={styles.infoContView}>
              <TextInput
                style={[
                  styles.info,
                  (!isEditingEnabled || fetchedStatus === "Verified") &&
                    styles.disabledInput,
                ]}
                value={updateUserData.lastName}
                onChangeText={handleLastNameChange}
                editable={isEditingEnabled && fetchedStatus !== "Verified"}
              />
            </View>
          </View>

          <View style={styles.labelInfoCont}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.infoContView}>
              <TextInput
                style={[styles.info, !isEditingEnabled && styles.disabledInput]}
                value={updateUserData.phone}
                onChangeText={handlePhone}
                keyboardType="numeric"
                editable={isEditingEnabled}
              />
            </View>
          </View>

          <View style={styles.labelInfoCont}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.infoContView}>
              <Picker
                selectedValue={updateUserData.gender}
                style={styles.infoGender}
                onValueChange={(itemValue) =>
                  setUpdateUserData({ ...updateUserData, gender: itemValue })
                }
                enabled={isEditingEnabled && fetchedStatus !== "Verified"}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>

          <View style={styles.labelInfoCont}>
            <Text style={styles.label}>Birthdate</Text>
            <View style={styles.infoContViewBirthdate}>
              <Text style={styles.info}>
                {selectedDate
                  ? formatDate(selectedDate)
                  : updateUserData.dateOfBirth
                  ? formatFetchDate(updateUserData.dateOfBirth)
                  : "Select birthdate"}
              </Text>

              {isEditingEnabled && fetchedStatus !== "Verified" && (
                <Iconify
                  size={22}
                  icon="mi:calendar"
                  color="#4E4E4E"
                  style={{ marginRight: 15 }}
                  onPress={() => setShowDatePicker(true)}
                />
              )}
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.labelInfoContValidId}>
            <View style={styles.statusView}>
              <Text style={styles.label}>Valid ID</Text>
              <Text
                style={[
                  styles.statusText,
                  {
                    color: fetchedStatus === "Verified" ? "#0CB669" : "#DC3642",
                  },
                ]}
              >
                [ {fetchedStatus ? fetchedStatus : "Unverified"} ]
              </Text>
            </View>
            {fetchedStatus === "Rejected" && rejectedReason !== null ? (
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.rejectedReasonText}>{rejectedReason}</Text>
              </View>
            ) : null}
            <View style={styles.chooseFileTouchable}>
              {isEditingEnabled && fetchedStatus !== "Verified" ? (
                <TouchableOpacity onPress={handleChooseID}>
                  <View style={styles.chooseFileTextView}>
                    <Text style={styles.chooseFileText}>Choose File</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.accountVerificationText}>
                  {fetchedStatus === "Pending" ? (
                    <View style={styles.verifyStatusCont}>
                      <Iconify
                        size={22}
                        icon="ic:round-pending-actions"
                        color="#ec6f56"
                        style={{ marginLeft: 10 }}
                      />
                    </View>
                  ) : fetchedStatus === "Verified" ? (
                    <View style={styles.verifyStatusCont}>
                      <Iconify
                        size={22}
                        icon="material-symbols:verified"
                        color="#0CB669"
                        style={{ marginLeft: 10 }}
                      />
                    </View>
                  ) : null}
                </View>
              )}

              <Text style={styles.fileDisplayText} numberOfLines={1}>
                {fetchedStatus === "Rejected" ? (
                  getFileNameFromURL(selectedFileImage) ? (
                    getFileNameFromURL(selectedFileImage)
                  ) : (
                    "Select a Valid ID"
                  )
                ) : fetchedStatus === "Pending" ? (
                  <View style={styles.verifyStatusCont}>
                    <Text style={styles.accountVerificationText}>
                      Verifying ID
                    </Text>
                  </View>
                ) : fetchedStatus === "Verified" ? (
                  <View style={styles.verifyStatusCont}>
                    <Text style={styles.accountVerificationText}>
                      Account Verified
                    </Text>
                  </View>
                ) : getFileNameFromURL(selectedFileImage) ? (
                  getFileNameFromURL(selectedFileImage)
                ) : (
                  "No file Chosen"
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.addButtonView}>
          {fetchedStatus === "Verified" ||
          fetchedStatus === "Unverified" ||
          fetchedStatus === "Rejected" ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={updateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.addText}>SAVE</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.disabledEditButton}>SAVE</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
