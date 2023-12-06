import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import Signup from "../screens/Signup";
import TermsConditions from "../screens/TermsCondition/TermsConditions";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: {
        backgroundColor: "#F5F5F5",
      },
    }}
  >
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Signup"
      component={Signup}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TermsConditions"
      component={TermsConditions}
      options={{
        headerTitle: () => <View></View>,
        headerTintColor: "black",
      }}
    />
  </Stack.Navigator>
);

export default AuthStack;
