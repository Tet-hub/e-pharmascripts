import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TabNavigator from "./tabNavigator";
import NotificationScreen from "../screens/Notification/NotificationScreen";
import OrderScreen from "../screens/Order/OrderScreen";
import InstallmentScreen from "../screens/InstallmentScreen/InstallmentScreen";
import FavoritesScreen from "../screens/Favorite/FavoritesScreen";
import StoreLocatorScreen from "../screens/StoreLocator/StoreLocatorScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import BranchesScreen from "../screens/Branch/BranchesScreen";
import ProductScreen from "../screens/Product/ProductScreen";
import EditProfileScreen from "../screens/EditProfile/EditProfileScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import MenuScreen from "../screens/Menu/MenuScreen";
import RateScreen from "../screens/Rate/RateScreen";
import ViewCompletedOrderScreen from "../screens/ViewOrder/ViewCompletedOrderScreen";
import ToValidateScreen from "../screens/ToValidate/ToValidateScreen";
import PlaceOrderScreen from "../screens/PlaceOrder/PlaceOrderScreen";
import ProductDetailScreen from "../screens/ProductDetails/ProductDetailScreen";
import ApprovedProductDetailScreen from "../screens/ProductDetails/ApprovedProductDetailScreen";
import CartNavigatorHeader from "./CartNavigatorHeader";
import ChatScreen from "../screens/Chat/ChatScreen";
import MessageScreen from "../screens/Message/MessageScreen";
import { Colors } from "../components/styles";
import { TailwindProvider } from "tailwindcss-react-native";
import { Iconify } from "react-native-iconify";

const { tertiary, white, red, bodyGray } = Colors;
const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: "black",
    color: "white",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 14,
    marginRight: 20,
  },
  headerTITLE: {
    marginLeft: -18,
    marginBottom: 2,
  },
  headBG: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
});
const Stack = createStackNavigator();

const RootStack = () => {
  // const [initialRouteName, setInitialRouteName] = useState("HomeScreen");

  // useEffect(() => {
  //   // Check if the user has a token in AsyncStorage
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       console.log("Token found in AsyncStorage:", token);

  //       if (!token) {
  //         // No token, navigate to Login
  //         console.log("No token, navigating to Login Screen");
  //         setInitialRouteName("Login");
  //       }
  //     } catch (error) {
  //       console.error("Error checking token:", error);
  //     }
  //   };

  //   checkToken();
  // }, []);

  return (
    <TailwindProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#F5F5F5",
          },
        }}
        // initialRouteName={initialRouteName}
      >
        <Stack.Screen
          name="HomeScreen"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MenuScreen"
          component={MenuScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
     

        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="OrderScreen"
          component={OrderScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="InstallmentScreen"
          component={InstallmentScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="FavoritesScreen"
          component={FavoritesScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="StoreLocatorScreen"
          component={StoreLocatorScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="BranchesScreen"
          component={BranchesScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={({ navigation }) => ({
            headerTitle: () => <View style={styles.headerTITLE}></View>,
            headerBackground: () => <View style={styles.headBG}></View>,
            headerTintColor: "black",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  // Handle the save action here
                }}
              >
                <Text style={styles.saveButton}>SAVE</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="RateScreen"
          component={RateScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="ViewCompletedOrderScreen"
          component={ViewCompletedOrderScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="ToValidateScreen"
          component={ToValidateScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="PlaceOrderScreen"
          component={PlaceOrderScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />
        <Stack.Screen
          name="ApprovedProductDetailScreen"
          component={ApprovedProductDetailScreen}
          options={{
            headerTitle: () => <View></View>,
            headerTintColor: "black",
            headerRight: () => <CartNavigatorHeader />,
          }}
        />

        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: {
              backgroundColor: "#EC6F56", // Set the background color to orange
            },
            headerTitleStyle: {
              color: "white", // Set the text color to white
              fontWeight: "bold", // Make the text bold
              fontSize: 24,
            },
            headerTintColor: "white", // Set the back button color to white

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Display the recipient's avatar */}
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20, // Make it circular
                    marginRight: 10,
                  }}
                />
                {/* You can add other header elements here if needed */}
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </TailwindProvider>
  );
};

export default RootStack;
