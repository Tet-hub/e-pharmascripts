import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TailwindProvider } from "tailwindcss-react-native";
import RootStack from "./navigators/RootStack"; // Your main app stack
import AuthStack from "./navigators/AuthStack"; // Your authentication stack (Login and Signup)
import { AuthContext } from "./src/context";
import { getAuthToken } from "./src/authToken";
import CustomSplashScreen from "./screens/CustomSplashScreen";
import { ToastProvider } from "react-native-toast-notifications";
import "./console-log";
const Stack = createStackNavigator();
const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check if a token is stored in AsyncStorage
    const retrieveToken = async () => {
      try {
        const { token, userId } = await getAuthToken();

        if (token && userId) {
          setUserToken(token);
          setUserId(userId);
          // Set the user token in context first
          authContext.signIn(token);
          // Then set the user ID
          authContext.setUserId(userId);

          console.log("retrieved token and userid from app.js:", userId);
        }
      } catch (error) {
        console.log("Error retrieving data from AsyncStorage:", error);
      }
    };

    retrieveToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: (token) => {
        setUserToken(token);
        // Save token to AsyncStorage
        AsyncStorage.setItem("token", token);
      },
      signOut: async () => {
        try {
          await AsyncStorage.multiRemove(["token", "email", "userId"]);
          setUserToken(null);
          setUserId(null);
          setUserEmail(null);
          console.log("Token, Email, and UserId removed successfully");
        } catch (error) {
          console.log("Error removing data from AsyncStorage:", error);
        }
      },
      setUserId: (newUserId) => {
        setUserId(newUserId);
      },
    }),
    []
  );

  useEffect(() => {
    // Simulate any initialization tasks (e.g., loading data) here
    setTimeout(() => {
      setAppReady(true); // Signal that the app is ready to continue
    }, 2000); // Adjust the delay as needed
  }, []);
  return (
    <AuthContext.Provider value={authContext}>
      <TailwindProvider>
        <ToastProvider>
          <NavigationContainer>
            {appReady ? (
              userToken ? (
                <RootStack />
              ) : (
                <AuthStack />
              )
            ) : (
              <CustomSplashScreen />
            )}
          </NavigationContainer>
        </ToastProvider>
      </TailwindProvider>
    </AuthContext.Provider>
  );
};
// Register your custom splash screen as the entry point
export default App;
