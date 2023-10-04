import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Iconify } from "react-native-iconify";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./stylesheet";

const PlaceOrderScreen = () => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  //{ height: deviceHeight-55}
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.container]}>
          <View style={styles.delAddressContainer}>
            <View>
              <Iconify icon="system-uicons:location" size={35} color="black" />
            </View>
            <View style={styles.delInfoContainer}>
              <View style={styles.delArrowContainer}>
                <Text style={styles.deliveryTitle}>Delivery Address</Text>
                <TouchableOpacity>
                  <Iconify
                    icon="iconoir:nav-arrow-right"
                    size={25}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
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
          <View style={styles.separator} />
          <View style={styles.paymentMethodContainer}>
            <Text style={styles.pmText}>Payment Method :</Text>
            <View style={styles.methodContainer}>
              <Iconify
                icon="healthicons:vespa-motorcycle-outline"
                size={25}
                color="black"
              />
              <Text style={styles.methodsText}>Cash on Delivery</Text>
            </View>
            <View style={styles.methodSeparator} />
            <View style={styles.methodContainer}>
              <Iconify icon="ph:wallet-light" size={25} color="black" />
              <Text style={styles.methodsText}>Gcash</Text>
            </View>
            <View style={styles.methodSeparator} />
            <View style={styles.methodContainer}>
              <Iconify icon="formkit:time" size={25} color="black" />
              <Text style={styles.methodsText}>Installment</Text>
            </View>
            <View style={styles.methodSeparator} />
          </View>
          <View style={styles.bottomContainer}>
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
                <View style={styles.pdTotalContainer}>
                  <Text style={styles.pdTotalText}>Total</Text>
                  <Text style={styles.pdTotalAmountText}>₱152.75</Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.totalContainer}>
              <Text style={styles.totalPmentText}>Total Payment</Text>
              <View style={styles.tpContainer}>
                <Text style={styles.totalAmountText}>₱152.75</Text>
                <TouchableOpacity style={styles.ordernowButton}>
                  <Text style={styles.ordernowText}>PLACE ORDER</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaceOrderScreen;
