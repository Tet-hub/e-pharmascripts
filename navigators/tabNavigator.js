import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Iconify } from "react-native-iconify";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

//screns
import HomeScreen from "../screens/Home/HomeScreen";
import MessageScreen from "../screens/Message/MessageScreen";
import DiaryMaintenanceScreen from "../screens/DiaryMaintenance/DiaryMaintenanceScreen";
import ShoppingCartScreen from "../screens/Cart/ShoppingCartScreen";
import { Colors } from "../components/styles"; //import colors

//statusbar state
import { useIsFocused } from "@react-navigation/native";

const { red, dark } = Colors;

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  notificationIconContainer: {
    position: "absolute",
    right: 15,
  },
});

const TestImage = require("../assets/img/cymer.jpg");

const CustomHeaderTitle = () => {
  const navigation = useNavigation();
  const handleNotificationPress = () => {
    // Navigate to notification screen when TouchableOpacity of notification icon is pressed
    navigation.navigate("NotificationScreen");
  };
  const handleProfilePress = () => {
    // Navigate to profile screen when TouchableOpacity of profile icon is pressed
    navigation.navigate("ProfileScreen");
  };
  const handleEditProfilePress = () => {
    // Navigate to edit profile screen when TouchableOpacity of edit profile button is pressed ion:notifications
    navigation.navigate("EditProfileScreen");
  };
  const handleMenuPress = () => {
    // Navigate to edit profile screen when TouchableOpacity of edit profile button is pressed
    navigation.navigate("MenuScreen");
  };

  return (
    <View className="flex flex-row flex-wrap">
      <View className="w-1/2 flex flex-row items-center">
        <TouchableOpacity onPress={handleMenuPress}>
          <View>
            <Iconify
              icon="heroicons-outline:menu-alt-2"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>

      <View className="w-1/2 mt-2 flex-row flex-wrap justify-end">
        <TouchableOpacity onPress={handleNotificationPress}>
          <Iconify icon="ion:notifications" size={24} color="#EC6F56" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress}>
          <View className="w-8 h-8 ml-5" style={{ marginTop: -4 }}>
            <View className="">
              <Image
                source={TestImage}
                className="w-full h-full rounded-full"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        keyboardHidesTabBar: true,
        tabBarStyle: {
          height: 58, // Increase the height of the tab bar
          borderRadius: 15,
          padding: 15,
          marginBottom: 15,
          marginLeft: 15,
          marginRight: 15,
          elevation: 1, // This property controls the shadow on Android
          shadowColor: "#000", // Set the shadow color
          shadowOpacity: 0.3, // Set the shadow opacity
          shadowRadius: 5, // Set the shadow radius
          shadowOffset: {
            width: 0,
            height: 2,
          },
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <CustomHeaderTitle />,
          headerStyle: {
            backgroundColor: "#F5F5F5",
          },
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Iconify
                icon="iconamoon:home-light"
                size={focused ? 30 : 27}
                color={focused ? "#EC6F56" : "#8E8E8E"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ShoppingCart"
        component={ShoppingCartScreen}
        options={{
          headerTitle: () => <CustomHeaderTitle />,
          headerStyle: {
            backgroundColor: "#F5F5F5",
          },
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Iconify
                icon="ion:cart-outline"
                size={focused ? 30 : 29}
                color={focused ? "#EC6F56" : "#8E8E8E"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DiaryMaintenance"
        component={DiaryMaintenanceScreen}
        options={{
          headerTitle: () => <CustomHeaderTitle />,
          headerStyle: {
            backgroundColor: "#F5F5F5",
          },
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Iconify
                icon="solar:notebook-outline"
                size={focused ? 30 : 27}
                color={focused ? "#EC6F56" : "#8E8E8E"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerTitle: () => (
            <View style={{ marginLeft: 9, marginBottom: 2 }}>
              <Text
                style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
              >
                Messages
              </Text>
            </View>
          ),
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Iconify
                icon="ant-design:message-outlined"
                size={focused ? 30 : 27}
                color={focused ? "#EC6F56" : "#8E8E8E"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
