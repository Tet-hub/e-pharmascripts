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
                source={require("../assets/img/amlodipine.png")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  delAddressContainer: {
    width: "80%",
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
  },
  delInfoContainer: {
    marginLeft: 15,
    width: "85%",
  },
  deliveryTitle: {
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 10,
  },
  customerName: {
    fontWeight: 300,
    fontSize: 13,
  },
  customerNumber: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
  },
  customerAddress: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  separator2: {
    marginTop: 60,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "80%",
    height: 120,
    alignSelf: "center",
  },
  imageContainer: {
    flex: 1,
    width: "40%",
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
  },
  productImage: {
    height: 120,
    width: "100%",
    marginLeft: -15,
    flex: 1,
    resizeMode: "contain",
  },
  productInfoContainer: {
    flex: 1,
  },
  priceRowContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: 600,
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 500,
  },
  productAmount: {
    fontSize: 14,
    fontWeight: 300,
  },
  pmentDetailsContainer: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  pmentDetailsText: {
    fontWeight: 500,
    fontSize: 14,
  },
  subtotalContainer: {
    width: "80%",
    marginLeft: 50,
    marginTop: 10,
  },
  psSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  pdTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  pdTotalText: {
    fontWeight: 600,
    fontSize: 15,
  },
  pdTotalAmountText: {
    fontWeight: 600,
    fontSize: 15,
  },
  psSubtotalText: {
    fontSize: 15,
    fontWeight: 300,
  },
  totalContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  totalPmentText: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 20,
  },
  totalAmountText: {
    fontWeight: 700,
    color: "#EC6F56",
    fontSize: 12,
    marginRight: 11,
  },
  delArrowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  ordernowText: {
    fontWeight: 600,
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  ordernowButton: {
    backgroundColor: "#DC3642",
    padding: 15,
    borderRadius: 30,
    width: "60%",
  },
  bottomContainer: {
    justifyContent: "flex-end",
    bottom: 15,
  },
  reminderText: {
    fontSize: 10,
    fontWeight: 200,
    fontStyle: "italic",
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 20,
    alignItems: "center",
    marginTop: 10,
  },
  paymentMethodContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 10,
  },
  pmText: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
  },
  methodSeparator: {
    marginTop: 8,
    height: 1,
    width: "90%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  methodsText: {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 20,
  },
});
