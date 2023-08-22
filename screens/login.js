import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik"; // Import Formik
import { Octicons, Ionicons } from "@expo/vector-icons"; //Icons

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

//colors
const { darkLight } = Colors;
const { orange } = Colors;

//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";

//firebase
import { authentication } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  //text input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State variable for error message
  const [error, setError] = useState(null); 

  useEffect(() => {
    let timeoutId;
    if (error) {
      // Set a timeout to clear the error message after 3 seconds
      timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    // Clear the timeout when the component unmounts or the error state changes
    return () => clearTimeout(timeoutId);
  }, [error]);


  //authentication
  const SignInUser = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(() => {
        setIsSignedIn(true);
        navigation.navigate("HomeScreen");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setError("Invalid Credentials");
        } else {
          setError("Invalid Credentials");
          console.log(error);
        }
      });
  }
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
            onSubmit={(values) => {
              console.log(values);
              navigation.navigate("HomeScreen");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <StyledFormArea>
                  {/* Error message */}
                  <View style={{ flex: 1, alignItems: "center", height: 36 }}>
                    {error && <MsgBox style="text-center text-sm">{error}</MsgBox>}
                  </View>
                <MyTextInput
                  placeholder="Email"
                  placeholderTextColor={darkLight}
                  // onChangeText={handleChange("email")}
                  onChangeText={text=>setEmail(text)}
                  onBlurText={handleBlur("email")}
                  value={email}
                  keyboardType="email-address"
                  style={{ marginTop: -15 }}
                />
                <MyTextInput
                  placeholder="Password"
                  placeholderTextColor={darkLight}
                  // onChangeText={handleChange("password")}
                  onChangeText={text=>setPassword(text)}
                  onBlurText={handleBlur("password")}
                  value={password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                  style={{ marginTop: -15 }}
                />
                <MsgBox style={{ marginTop: 3, marginBottom: 10 }}>Forgot password?</MsgBox>
                {}
                <StyledButton onPress={SignInUser}>
                  <ButtonText>Login</ButtonText>
                </StyledButton>
                <Text className="text-center" style={{fontSize: 16, fontWeight: 400,  marginTop: 8, marginBottom: 8 }}>or</Text>

                <GoogleButton onPress={handleSubmit}>
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
          textAlign: 'left',
        }}
      />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={23}
            color={darkLight}
            style={{ marginTop: -17}}
          />
        </RightIcon>
      )}
    </View>
  );
};


export default Login;