import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";

const ViewCompletedOrderScreen = () => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  //{ height: deviceHeight-55}
  return (
    <View style={[styles.container]}>
      <View style={styles.delAddressContainer}>
        <View>
          <Iconify icon="system-uicons:location" size={35} color="black" />
        </View>
        <View style={styles.delInfoContainer}>
          <Text style={styles.deliveryTitle}>Delivery Address</Text>
          <Text style={styles.customerName}>Xymer Serna</Text>
          <Text style={styles.customerNumber}>(+63) 9565784915</Text>
          <Text style={styles.customerAddress}>
            252- I Ascencion St., Sambag I Cebu City, Cebu, Visayas, 6000
          </Text>
        </View>
      </View>
      <View style={styles.separator} />

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
            <Text style={styles.productPrice}>{"\u20B1"}102.75</Text>
            <Text style={styles.productAmount}>x1</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator2} />

      <View style={styles.pmentContainer}>
        <Text style={styles.methodText}>Payment Method :</Text>
        <View style={styles.choseMethodTextContainer}>
          <Text style={styles.choseMethodText}>Cash on Delivery</Text>
        </View>
      </View>
      <View style={styles.separator2} />

      <View style={styles.pmentDetailsContainer}>
        <Text style={styles.pmentDetailsText}>Payment Details :</Text>
        <View style={styles.subtotalContainer}>
          <View style={styles.psSubtotalContainer}>
            <Text style={styles.psSubtotalText}>Product Subtotal</Text>
            <Text style={styles.psSubtotalText}>₱102.75</Text>
          </View>
          <View style={styles.psSubtotalContainer}>
            <Text style={styles.psSubtotalText}>Shipping Subtotal</Text>
            <Text style={styles.psSubtotalText}>₱50.00</Text>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.totalContainer}>
        <Text style={styles.totalPmentText}>Total Payment</Text>
        <Text style={styles.totalAmountText}>₱152.75</Text>
      </View>
    </View>
  );
};

export default ViewCompletedOrderScreen;
