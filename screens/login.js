import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik"; // Import Formik
import { Octicons, Ionicons } from "@expo/vector-icons"; //Icons
import { Alert } from "react-native";
//import styles components
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

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";

//firebase
import { AuthContext } from "../src/context";
import { saveAuthToken } from "../src/authToken";
import { BASE_URL, EMU_URL } from "../src/api/apiURL";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);

  const SignInUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/mobile/post/customer/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        // Login successful
        const userId = response.data.userId;
        const user = response.data.user;
        const userToken = response.data.token;

        await saveAuthToken(user.email, userToken, userId); // Save user's email, token, and userId to AsyncStorage
        signIn(userToken); // Update the user's token in the context
        console.log("UserId fetched from login", userId);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid credentials");
      } else {
        console.log("Error signing in:", error);
        setError("LogIn failed!");
      }
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
      }, 4000);
    }
    // Clear the timeout when the component unmounts or the error state changes
    return () => clearTimeout(timeoutId);
  }, [error]);
  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
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
                <MsgBox style={{ marginTop: 3, marginBottom: 10 }}>
                  Forgot password?
                </MsgBox>
                {}
                <StyledButton onPress={SignInUser}>
                  <ButtonText>Login</ButtonText>
                </StyledButton>
                <Text
                  className="text-center"
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  or
                </Text>

                <GoogleButton onPress={() => navigation.navigate("HomeScreen")}>
                  <GoogleImage
                    resizeMode="cover"
                    source={require("../assets/img/g-logo.png")}
                  />
                  <GoogleText>Continue with Google</GoogleText>
                </GoogleButton>

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
