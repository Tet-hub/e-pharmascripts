import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../console-log";
import TabNavigator from "./tabNavigator";
import NotificationScreen, {
  registerForPushNotificationsAsync,
} from "../screens/Notification/NotificationScreen";
import OrderScreen from "../screens/Order/OrderScreen";
// import OrderSwitchTab1 from "../screens/Order/PendingOrders";
import InstallmentScreen from "../screens/InstallmentScreen/InstallmentScreen";
import FavoritesScreen from "../screens/Favorite/FavoritesScreen";
import StoreLocatorScreen from "../screens/StoreLocator/StoreLocatorScreen";
import ChooseLocation from "../screens/StoreLocator/ChooseLocation";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import BranchesScreen from "../screens/Branch/BranchesScreen";
import ProductScreen from "../screens/Product/ProductScreen";
import EditProfileScreen from "../screens/EditProfile/EditProfileScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import MenuScreen from "../screens/Menu/MenuScreen";
import RateScreen from "../screens/Rate/RateScreen";
import ViewCompletedOrderScreen from "../screens/ViewOrder/ViewCompletedOrderScreen";
import ViewOrderScreen from "../screens/ViewOrder/ViewOrderScreen";
import ViewCancelledOrderScreen from "../screens/ViewOrder/ViewCancelledOrderScreen";
import ToValidateScreen from "../screens/ToValidate/ToValidateScreen";
import PlaceOrderScreen from "../screens/PlaceOrder/PlaceOrderScreen";
import ProductDetailScreen from "../screens/ProductDetails/ProductDetailScreen";
import ApprovedProductDetailScreen from "../screens/ProductDetails/ApprovedProductDetailScreen";
import CartNavigatorHeader from "./CartNavigatorHeader";
import ChatScreen from "../screens/Chat/ChatScreen";
import MessageScreen from "../screens/Message/MessageScreen";
import CreateDiaryMaintenance from "../screens/DiaryMaintenance/CreateDiaryMaintenance";
import UpdateDiaryMaintenance from "../screens/DiaryMaintenance/UpdateDiaryMaintenance";
import { MessageProvider } from "../screens/Message/messageContext";
import { Colors } from "../components/styles";
import { TailwindProvider } from "tailwindcss-react-native";
import { Iconify } from "react-native-iconify";
import BranchDetailsScreen from "../screens/Branch/BranchDetailsScreen";
import SearchProductsScreen from "../screens/Home/SearchProductsScreen";
import AddressScreen from "../screens/Address/AddressScreen";
import EmailScreen from "../screens/Account/EmailScreen";
import SecurityScreen from "../screens/Account/SecurityScreen";
import ChangePasswordScreen from "../screens/Account/ChangePasswordScreen";
import ChangeEmailScreen from "../screens/Account/ChangeEmailScreen";
import VerifyEmailScreen from "../screens/Account/VerifyEmailScreen";
import ReportIssueScreen from "../screens/Settings/ReportIssueScreen";
import CommunityRulesScreen from "../screens/Settings/CommunityRulesScreen";
import AboutScreen from "../screens/Settings/AboutScreen";
import TermsAndConditionsScreen from "../screens/Settings/TermsAndConditionsScreen";
import PoliciesScreen from "../screens/Settings/PoliciesScreen";
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
  const DefaultImage = require("../assets/img/default-image.jpg");
  const navigation = useNavigation();
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleNavigateToHome = () => {
    navigation.navigate("HomeScreen");
  };
  return (
    <TailwindProvider>
      <MessageProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
          }}
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
          {/* <Stack.Screen
            name="OrderSwitchTab1"
            component={OrderSwitchTab1}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
              headerRight: () => <CartNavigatorHeader />,
            }}
          /> */}
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChooseLocation"
            component={ChooseLocation}
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
              headerTitle: () => <View></View>,
              headerTintColor: "black",
              headerRight: () => <View></View>,
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
            name="ViewOrderScreen"
            component={ViewOrderScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
              headerRight: () => <CartNavigatorHeader />,
            }}
          />
          <Stack.Screen
            name="ViewCancelledOrderScreen"
            component={ViewCancelledOrderScreen}
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
            name="CreateDiaryMaintenance"
            component={CreateDiaryMaintenance}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />

          <Stack.Screen
            name="UpdateDiaryMaintenance"
            component={UpdateDiaryMaintenance}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />

          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={({ route }) => ({
              headerStyle: {
                backgroundColor: "#EC6F56",
              },
              headerTitleStyle: {
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
              },
              headerTintColor: "white",
              headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {route.params.img ? (
                    <>
                      <Image
                        source={{ uri: route.params.img }}
                        style={{
                          width: 40,
                          height: 40,
                          marginRight: 13,
                          marginLeft: -10,
                        }}
                      />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {route.params.sellerBranch}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Image
                        source={DefaultImage}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          marginRight: 13,
                          marginLeft: -10,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      />
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        {route.params.sellerBranch}
                      </Text>
                    </>
                  )}
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="BranchDetailsScreen"
            component={BranchDetailsScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="SearchProductsScreen"
            component={SearchProductsScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
              headerRight: () => <CartNavigatorHeader />,
            }}
          />
          <Stack.Screen
            name="AddressScreen"
            component={AddressScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="EmailScreen"
            component={EmailScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="SecurityScreen"
            component={SecurityScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="ChangePasswordScreen"
            component={ChangePasswordScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="ChangeEmailScreen"
            component={ChangeEmailScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="VerifyEmailScreen"
            component={VerifyEmailScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="ReportIssueScreen"
            component={ReportIssueScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="CommunityRulesScreen"
            component={CommunityRulesScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="AboutScreen"
            component={AboutScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="TermsAndConditionsScreen"
            component={TermsAndConditionsScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
          <Stack.Screen
            name="PoliciesScreen"
            component={PoliciesScreen}
            options={{
              headerTitle: () => <View></View>,
              headerTintColor: "black",
            }}
          />
        </Stack.Navigator>
      </MessageProvider>
    </TailwindProvider>
  );
};

export default RootStack;
