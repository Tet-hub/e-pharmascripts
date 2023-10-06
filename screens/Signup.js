import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Checkbox } from "expo-checkbox";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import {
  StyledContainer,
  InnerContainer,
  Subtitle,
  StyledFormArea,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MsgBox,
  ExtraView,
  Extratext,
  TextLink,
  TextLinkContent,
} from "../components/styles";
import axios from "axios"; // Import Axios for making API requests
//colors
const { darkLight } = Colors;
const { orange } = Colors;

//date-time picker
import DateTimePicker from "@react-native-community/datetimepicker";

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";
import { BASE_URL } from "../src/api/apiURL";

// const API_URL = "http://127.0.0.1:5001/e-pharmascripts/us-central1/userApp/api/mobile/post"";
// const API_URL =
// "http://10.0.2.2:5001/e-pharmascripts/us-central1/userApp/api/mobile/post"; //for android emulator

const API_URL =
  "https://us-central1-e-pharmascripts.cloudfunctions.net/userApp";

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [isChecked, setIsChecked] = useState(false);
  const [dob, setDob] = useState("");
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleInputChange = (field, text) => {
    switch (field) {
      case "firstName":
        setFName(text);
        break;
      case "lastName":
        setLName(text);
        break;
      case "email":
        setEmail(text);
        break;
      case "phone":
        setPhone(text);
        break;
      case "password":
        setPassword(text);
        break;
      case "confirmPassword":
        setConfirmPassword(text);
        break;
      default:
        break;
    }

    checkAllFieldsFilled();
  };

  const checkAllFieldsFilled = () => {
    if (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      dob
    ) {
      setAllFieldsFilled(true);
    } else {
      setAllFieldsFilled(false);
    }
  };
  const setErrorWithTimeout = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => setError(null), timeout);
  };
  const RegisterUser = async () => {
    if (!isChecked) {
      setErrorWithTimeout("Please agree to the Terms & Conditions.");
      return;
    }
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth: dob,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/mobile/post/${"users"}`,
        userData
      );
      if (response.status === 200) {
        // console.log("User added successfully");
        console.log("User added successfully", response.data.msg);
        setErrorWithTimeout("User added successfully");
        navigation.navigate("Login");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        console.log("Error afte from if:", error);
        setErrorWithTimeout(error.response.data.msg); // Set the error message from the response
      } else {
        console.error("An error occurred during registration.", error);
        setErrorWithTimeout("An error occurred during registration."); // Set a generic error message
      }
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <ScrollView>
        <StyledContainer>
          <StatusBar style="dark" />
          <InnerContainer>
            <Subtitle style={{ marginTop: 20, marginBottom: 5 }}>
              Welcome to E-PharmaScripts
            </Subtitle>
            <View style={{ flex: 1, alignItems: "center" }}>
              {error && <MsgBox style={{ marginBottom: -15 }}>{error}</MsgBox>}
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}

            <Formik
              initialValues={{
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={(values) => {
                console.log(values);
                RegisterUser();
                navigation.navigate("Login");
              }}
            >
              {({ handleChange, handleBlur, values }) => (
                <StyledFormArea style={{ marginTop: 15 }}>
                  <MyTextInput
                    icon="person"
                    placeholder="First Name"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) =>
                      handleInputChange("firstName", text)
                    }
                    onBlur={handleBlur("firstname")}
                    value={firstName}
                  />
                  <MyTextInput
                    icon="person-fill"
                    placeholder="Last Name"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) => handleInputChange("lastName", text)}
                    onBlur={handleBlur("lastname")}
                    value={lastName}
                  />
                  <MyTextInput
                    icon="mail"
                    placeholder="Email"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) => handleInputChange("email", text)}
                    onBlur={handleBlur("email")}
                    value={email}
                    keyboardType="email-address"
                  />
                  <MyTextInput
                    icon="device-mobile"
                    placeholder="Phone Number"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) => handleInputChange("phone", text)}
                    onBlur={handleBlur("phone")}
                    value={phone}
                  />
                  <MyTextInput
                    icon="calendar"
                    placeholder="YYYY - MM - DD"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) =>
                      handleInputChange("dateOfBirth", text)
                    }
                    onBlur={handleBlur("dateOfBirth")}
                    value={dob ? dob.toDateString() : ""}
                    isDate={true}
                    editable={false}
                    showDatePicker={showDatePicker}
                    selectionColor="black"
                  />
                  <MyTextInput
                    icon="lock"
                    placeholder="Enter Password"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) => handleInputChange("password", text)}
                    onBlur={handleBlur("password")}
                    value={password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MyTextInput
                    icon="lock"
                    placeholder="Confirm Password"
                    placeholderTextColor={darkLight}
                    onChangeText={(text) =>
                      handleInputChange("confirmPassword", text)
                    }
                    onBlur={handleBlur("confirmPassword")}
                    value={confirmPassword}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Checkbox
                      color={orange}
                      value={isChecked}
                      onValueChange={setIsChecked}
                    />
                    <Text style={{ marginLeft: 5, fontSize: 14 }}>
                      I agree to the{" "}
                    </Text>
                    <TextLink
                      onPress={() => navigation.navigate("TermsConditions")}
                    >
                      <TextLinkContent
                        style={{
                          fontSize: 14,
                          textDecorationLine: "underline",
                        }}
                      >
                        Terms & Conditions
                      </TextLinkContent>
                    </TextLink>
                  </View>

                  <StyledButton
                    onPress={RegisterUser}
                    style={{
                      marginTop: 20,
                      opacity: allFieldsFilled ? 1 : 0.7, // Set opacity based on allFieldsFilled
                      backgroundColor: allFieldsFilled ? orange : "#ccc", // Set background color
                    }}
                    disabled={!allFieldsFilled} // Disable the button if not all fields are filled
                  >
                    <ButtonText>Register</ButtonText>
                  </StyledButton>

                  <ExtraView>
                    <Extratext>Already have an account? </Extratext>
                    <TextLink onPress={() => navigation.navigate("Login")}>
                      <TextLinkContent>Login</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </StyledContainer>
      </ScrollView>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  isDate,
  showDatePicker,
  ...props
}) => {
  return (
    <View>
      {!isDate && (
        <StyledTextInput
          {...props}
          placeholderTextColor="black"
          selectionColor={orange}
        />
      )}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput
            {...props}
            placeholderTextColor="black"
            selectionColor="black"
          />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={23}
            color={darkLight}
            style={{ marginTop: -17 }}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
