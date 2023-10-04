import {
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { Iconify } from "react-native-iconify";
import OrderSwitchTabs from "../../components/OrderSwitchTabs";
import { Checkbox } from "expo-checkbox";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import styles from "./stylesheet";

const OrderScreen = () => {
  const navigation = useNavigation();

  const [trackerTab, setTrackerTab] = useState(1);
  const onSelectSwitch = (value) => {
    setTrackerTab(value);
  };
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const toggleNotifications = () => {
    setIsNotificationsEnabled((prevState) => !prevState);
  };
  const { width, height } = Dimensions.get("window");

  // State for the checkbox
  const [isChecked, setIsChecked] = useState(false);

  const handleRateScreen = () => {
    // Navigate to my order screen
    navigation.navigate("RateScreen");
  };

  const handleViewOrderScreen = () => {
    // Navigate to my order screen
    navigation.navigate("ViewCompletedOrderScreen");
  };

  const handleApprovedProductDetailScreen = () => {
    // Navigate to my order screen
    navigation.navigate("ApprovedProductDetailScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>MY ORDERS</Text>

      <View>
        <OrderSwitchTabs
          selectionMode={1}
          option1="PENDING"
          option2="APPROVED"
          option3="TO RECEIVE"
          option4="CANCELLED"
          option5="COMPLETED"
          onSelectSwitch={onSelectSwitch}
        />
      </View>
      {trackerTab == 1 && (
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/img/amlodipine.png")}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfoContainer}>
            <View>
              <Text style={styles.productName}>Zynapse 1G Tablet</Text>
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            </View>
            <View style={styles.priceRowContainer}>
              <Text style={styles.productAmount}>x1</Text>
              <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
            </View>
          </View>
        </View>
      )}
      {trackerTab == 2 && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.productContainer}
            onPress={handleApprovedProductDetailScreen}
          >
            <View>
              <Checkbox
                color="#EC6F56"
                value={isChecked}
                onValueChange={setIsChecked}
                style={styles.checkBoxIcon}
              />
            </View>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/img/amlodipine.png")}
                style={styles.productImage}
              />
            </View>
            <View style={styles.productInfoContainer}>
              <View>
                <Text style={styles.productName}>Zynapse 1G Tablet</Text>
                <Text style={styles.productReq}>[ Requires Prescription ]</Text>
              </View>
              <View style={styles.priceRowContainer}>
                <Text style={styles.productAmount}>x1</Text>
                <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
              </View>
            </View>

            <View style={styles.xButtonWrapper}>
              <TouchableOpacity style={styles.xButton}>
                <Iconify icon="carbon:close-filled" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <View style={styles.proceedButtonContainer}>
            <TouchableOpacity style={styles.proceedButton}>
              <Text style={styles.proceedText}>Proceed to payment</Text>
              <Iconify icon="iconoir:nav-arrow-right" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {trackerTab == 3 && (
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/img/amlodipine.png")}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfoContainer}>
            <View>
              <Text style={styles.productName}>Zynapse 1G Tablet</Text>
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            </View>
            <View style={styles.priceRowContainer}>
              <Text style={styles.productAmount}>x1</Text>
              <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
            </View>
          </View>
        </View>
      )}
      {trackerTab == 4 && (
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/img/amlodipine.png")}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfoContainer}>
            <View>
              <Text style={styles.productName}>Zynapse 1G Tablet</Text>
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            </View>
            <View style={styles.priceRowContainer}>
              <Text style={styles.productAmount}>x1</Text>
              <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
            </View>
          </View>
        </View>
      )}
      {trackerTab == 5 && (
        <View>
          <View style={styles.completedOrderContainer}>
            <View style={styles.completedProductContainer}>
              <View style={styles.imageContainerCompletedScreen}>
                <Image
                  source={require("../../assets/img/amlodipine.png")}
                  style={styles.productImageCompletedScreen}
                />
              </View>
              <View style={styles.productInfoContainer}>
                <View>
                  <Text style={styles.productName}>Zynapse 1G Tablet</Text>
                  <Text style={styles.productReq}>
                    [ Requires Prescription ]
                  </Text>
                </View>
                <View style={styles.priceRowContainer}>
                  <Text style={styles.productAmount}>x1</Text>
                  <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
                </View>
              </View>
            </View>
            <View>
              <View style={styles.viewRateContainer}>
                <TouchableOpacity onPress={handleViewOrderScreen}>
                  <View style={styles.viewButton}>
                    <Text style={styles.viewText}>VIEW</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRateScreen}>
                  <View style={styles.rateButton}>
                    <Text style={styles.rateText}>RATE</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;
