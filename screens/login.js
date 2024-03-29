import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik"; // Import Formik
import { Octicons, Ionicons } from "@expo/vector-icons"; //Icons
import { ActivityIndicator, Alert } from "react-native";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  Subtitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
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
  GoogleButton,
  GoogleText,
  GoogleImage,
  Box,
} from "../components/styles";
import { View, Text } from "react-native";
import axios from "axios";

//colors
const { darkLight } = Colors;
const { orange } = Colors;

import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import emailValidator from "email-validator";
import { authentication } from "../firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
//firebase
import { AuthContext } from "../src/context";
import { saveAuthToken } from "../src/authToken";
import { BASE_URL, EMU_URL } from "../src/api/apiURL";
import { TouchableOpacity } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgot = async () => {
    try {
      if (!email) {
        console.log("Type your email first");
        Alert.alert("Blank Email", "Type your email first");
        return;
      }
      if (!emailValidator.validate(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }

      // Check if the email exists in the "customers" collection
      const customersCollectionRef = collection(db, "customers");
      const q = query(customersCollectionRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Email does not exist in the "customers" collection
        Alert.alert(
          "Invalid Email",
          "This email is not associated with a customers account."
        );
      } else {
        // Email exists in the "customers" collection, send password reset email
        await sendPasswordResetEmail(authentication, email);
        Alert.alert(
          "Password Reset Email Sent",
          "Check your email for further instructions."
        );
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      Alert.alert(
        "Error",
        "Failed to send password reset email. Please try again later."
      );
    }
  };

  const SignInUser = async () => {
    setIsLoading(true); // Start loading
    try {
      const auth = authentication;
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const userId = user.uid;
      const userDocRef = doc(db, "customers", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const customerData = userDocSnapshot.data();
        const { status } = customerData;

        if (status === "Disabled") {
          setError("Your account is disabled.");
        } else {
          const profileImageValue =
            customerData.profileImage ||
            "https://firebasestorage.googleapis.com/v0/b/e-pharmascripts.appspot.com/o/profile%2Fdefault-profiel-image.jpg?alt=media&token=778d7daf-739a-4aef-bef2-e4ee6907db3f";

          const asynch = await saveAuthToken(
            customerData.email,
            response.user.uid,
            userId,
            profileImageValue,
            `${customerData.firstName} ${customerData.lastName}`
          );
          signIn(response.user.uid); // Update the user's token in the context
        }
      } else {
        console.log("User document does not exist");
        setError("Only customers can log in.");
      }
      console.log("UserId fetched from login", userId);
    } catch (error) {
      console.log("Error signing in:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid credentials");
      } else {
        setError("Log In failed!");
      }
    } finally {
      setIsLoading(false); // Done loading
    }
  };

  // useEffect(() => {
  //   if (error) {
  //     Alert.alert("Error", error, [
  //       { text: "OK", onPress: () => setError(null) },
  //     ]);
  //   }
  // }, [error]);
  useEffect(() => {
    let timeoutId;
    if (error) {
      // Set a timeout to clear the error message after 3 seconds
      timeoutId = setTimeout(() => {
        setError(null);
      }, 6000);
    }
    // Clear the timeout when the component unmounts or the error state changes
    return () => clearTimeout(timeoutId);
  }, [error]);
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar backgroundColor="white" barStyle="light-content" />
        <InnerContainer>
          <PageLogo
            resizeMode="cover"
            source={require("../assets/img/ep-logo.png")}
          />
          <Subtitle>Welcome to E-Pharmascripts</Subtitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={() => SignInUser()}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                {/* Error message */}
                <View style={{ flex: 1, alignItems: "center", height: 36 }}>
                  {error && (
                    <MsgBox style="text-center text-sm">{error}</MsgBox>
                  )}
                </View>
                <MyTextInput
                  placeholder="Email"
                  autoCapitalize="none"
                  placeholderTextColor={darkLight}
                  // onChangeText={handleChange("email")}
                  onChangeText={(text) => setEmail(text)}
                  onBlurText={handleBlur("email")}
                  value={email}
                  keyboardType="email-address"
                  style={{ marginTop: -15 }}
                />
                <MyTextInput
                  placeholder="Password"
                  placeholderTextColor={darkLight}
                  autoCapitalize="none"
                  // onChangeText={handleChange("password")}
                  onChangeText={(text) => setPassword(text)}
                  onBlurText={handleBlur("password")}
                  value={password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                  style={{ marginTop: -15 }}
                />
                <View style={{ width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 15}}>
                  <TouchableOpacity onPress={handleForgot}>
                    <Text style={{ fontSize: 14, color: '#EB3F3F' }}>Forgot password?</Text>
                  </TouchableOpacity>
                </View>
                {}
                <StyledButton onPress={SignInUser} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                  ) : (
                    <ButtonText>Login</ButtonText>
                  )}
                </StyledButton>
                {/* <Text
                  className="text-center"
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  or
                </Text> */}

                {/* <GoogleButton onPress={() => navigation.navigate("HomeScreen")}>
                  <GoogleImage
                    resizeMode="cover"
                    source={require("../assets/img/g-logo.png")}
                  />
                  <GoogleText>Continue with Google</GoogleText>
                </GoogleButton> */}

                <ExtraView>
                  <Extratext>No account?</Extratext>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent> Sign up</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <StyledTextInput
        {...props}
        placeholderTextColor="black"
        selectionColor={orange} // Set the caret color to red
        style={{
          textAlign: "left",
        }}
      />
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

export default Login;
