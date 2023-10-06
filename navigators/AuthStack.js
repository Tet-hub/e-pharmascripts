import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import Signup from "../screens/Signup";
import TermsConditions from "../screens/TermsCondition/TermsConditions";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
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
      options={{ headerShown: true }}
    />
  </Stack.Navigator>
);

export default AuthStack;
