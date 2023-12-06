import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Checkbox } from "expo-checkbox";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios"; // Import Axios for making API requests
import styles from "./signupStyle";
import {
  collection,
  doc,
  addDoc,
  Timestamp,
  getDocs,
  where,
  query,
  setDoc,
} from "firebase/firestore";
import { authentication, db } from "../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { BASE_URL } from "../src/api/apiURL";

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  //HANDLE INPUTS
  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
  const isValidText = (text) => {
    return /^[A-Za-z]+$/.test(text);
  };
  const handleFirstName = (text) => {
    if (isValidText(text) || text === "") {
      setFName(text);
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLastName = (text) => {
    setLName(text);
  };
  const handleEmail = (text) => {
    setEmail(text);
  };
  const handlePhone = (text) => {
    // Allow only numeric input and limit to 11 digits
    const formattedPhoneNumber = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    const limitedPhoneNumber = formattedPhoneNumber.slice(0, 11); // Limit to 11 digits

    setPhone(limitedPhoneNumber);
  };

  const handlePassword = (text) => {
    setPassword(text);
  };

  const handleConfirmPassword = (text) => {
    setConfirmPassword(text);
  };
  const handleRegister = async () => {
    setBtnLoading(true);
    if (firstName.trim() === "") {
      setErrorText("Please fill in first name");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (lastName.trim() === "") {
      setErrorText("Please fill in last name");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setErrorText("Please input valid email");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (email.trim() === "") {
      setErrorText("Please fill in email");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (phone.trim() === "") {
      setErrorText("Please fill in phone number");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      return;
      setBtnLoading(false);
    }
    if (password.trim() === "") {
      setErrorText("Please fill in password");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (!selectedAddress || selectedAddress.description.trim() === "") {
      setErrorText("Please select an address");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setErrorText("Confirm Password doesn't match");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      return;
    }
    if (!isChecked) {
      setErrorText("Please read Terms and Conditions");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    if (!isChecked) {
      setErrorText("Please read Terms and Conditions");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }
    const querySnapshot = await getDocs(
      query(collection(db, "customers"), where("email", "==", email))
    );

    if (!querySnapshot.empty) {
      setErrorText("Email already exists");
      setTimeout(() => {
        setErrorText("");
      }, 5000);
      setBtnLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        authentication,
        email,
        password
      );

      const user = userCredential.user;

      const userData = {
        email: email,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: selectedAddress.description,
        dateOfBirth: null,
        profileImage: null,
        createdAt: Timestamp.fromDate(new Date()),
        status: "Unverified",
      };

      // Use 'doc' to specify a document ID (user's UID)
      const userDocRef = doc(db, "customers", user.uid);

      // Attempt to set the document
      await setDoc(userDocRef, userData);
      setBtnLoading(false);
      showToast("Registration successful");
      navigation.navigate("Login");
    } catch (error) {
      //console.error("Error creating user:", error);
      setBtnLoading(false);
      if (error.code === "auth/weak-password") {
        setErrorText("Password should be at least 6 characters");
        setBtnLoading(false);
      } else if (error.code === "auth/email-already-in-use") {
        setErrorText("Email already exists");
        setBtnLoading(false);
      } else {
        setErrorText("Registration failed. Please try again later.");
        setBtnLoading(false);
      }

      setTimeout(() => {
        setErrorText("");
      }, 5000);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.centerContainer}>
        <Text style={styles.screenTitle}>Welcome to E-PharmaScripts</Text>
        {errorText !== "" && <Text style={styles.errorText}>{errorText}</Text>}

        <TextInput
          style={styles.inputStyle1}
          placeholder="First Name"
          onChangeText={handleFirstName}
          maxLength={50}
        />

        <TextInput
          style={styles.inputStyle}
          placeholder="Last Name"
          onChangeText={handleLastName}
          maxLength={50}
        />

        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          onChangeText={handleEmail}
          maxLength={50}
        />

        <TextInput
          style={styles.inputStyle}
          placeholder="Phone Number"
          onChangeText={handlePhone}
          keyboardType="numeric"
          maxLength={11}
        />

        <View style={{ position: "relative", zIndex: 1000 }}>
          <GooglePlacesAutocomplete
            placeholder="Address"
            onPress={(data, details = null) => {
              setSelectedAddress(data);
            }}
            query={{
              key: "AIzaSyAErVuJDetH9oqE36Gx_sBDBv2JIUbXcJ4",
              language: "en",
              components: "country:ph",
            }}
            e
            styles={{
              container: {
                flex: 0,
              },
              textInputContainer: {
                width: "100%",
                alignSelf: "center",
                marginBottom: 8,
              },
              textInput: {
                height: 50,
                fontSize: 15,
                backgroundColor: "white",
                borderRadius: 15,
                borderColor: "rgba(0, 0, 0, 0.5)",
                borderWidth: 1.5,
                paddingLeft: 20,
                paddingRight: 20,
              },
              listView: {
                alignSelf: "center",
                width: "100%",
                fontSize: 13,
                position: "absolute",
                top: 50,
                left: 0.1,
                right: 10,
                zIndex: 1000,
                elevation: 3,
                borderRadius: 15,
                borderColor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          />
        </View>

        <View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Enter Password"
            secureTextEntry={hidePassword}
            onChangeText={handlePassword}
            maxLength={50}
          />
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ position: "absolute", right: 10, top: 15 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <View>
          <TextInput
            style={styles.inputStyle}
            placeholder="Confirm Password"
            secureTextEntry={hidePassword}
            onChangeText={handleConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{ position: "absolute", right: 10, top: 15 }}
          >
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.termsView}>
          <Checkbox
            color="#EC6F56"
            style={styles.checkBox}
            value={isChecked}
            onValueChange={setIsChecked}
          />
          <Text>I agree to the </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("TermsConditions")}
          >
            <Text style={styles.termsText}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.registerTO}
          onPress={handleRegister}
          disabled={btnLoading}
        >
          {btnLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.registerText}>Register</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginView}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
