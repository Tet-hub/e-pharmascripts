import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { Iconify } from "react-native-iconify";
import { Checkbox } from "expo-checkbox";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import styles from "./stylesheet";

const ShoppingCartScreen = () => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  // State for the checkbox
  const [isChecked, setIsChecked] = useState(false);
  // State for the quantity button
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const navigation = useNavigation();

  const handleToValidateScreen = () => {
    // Navigate to my order screen
    navigation.navigate("ToValidateScreen");
  };

  return (
    <View style={[styles.container, { height: deviceHeight - 125 }]}>
      <Text style={styles.screenTitle}>MY CART</Text>
      <View style={styles.selectedProductContainer}>
        <View style={styles.productContainer}>
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
              <View style={styles.quantityButton}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={styles.button}
                >
                  <Iconify icon="ph:minus-fill" size={22} color="#EC6F56" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.button}
                >
                  <Iconify icon="ph:plus-fill" size={22} color="#EC6F56" />
                </TouchableOpacity>
              </View>

              <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
            </View>
          </View>

          <View style={styles.xButtonWrapper}>
            <TouchableOpacity>
              <Iconify icon="carbon:close-filled" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.checkoutContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Price</Text>
            <Text style={styles.amountText}>₱ 102.75</Text>
          </View>
          <View style={styles.delFeeContainer}>
            <Text style={styles.delFeeText}>Delivery Fee</Text>
            <Text style={styles.amountText}>₱ 102.75</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmountText}>₱ 152.75</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutWrapper}
            onPress={handleToValidateScreen}
          >
            <Text style={styles.checkoutText}>CHECKOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ShoppingCartScreen;
