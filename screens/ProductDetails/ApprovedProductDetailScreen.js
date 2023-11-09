import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./approvedDetailsStylesheet";

//import test image
const TestImage = require("../../assets/img/amlodipine.png");

const ApprovedProductDetailScreen = ({ navigation, route }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

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
  //{ height: deviceHeight}
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.container, { height: deviceHeight }]}>
          <View style={styles.imageContainer}>
            <Image source={TestImage} style={styles.image} />
          </View>
          <View
            style={[styles.productContentContainer, { height: deviceHeight }]}
          >
            <View style={styles.insideContentContainer}>
              <View style={styles.productNameView}>
                <Text style={styles.productNameText}>Zynapse 1G Tablet</Text>
              </View>
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
              <Text style={styles.productPrice}>₱ 102.75</Text>
              <Text style={styles.categoriesText}>
                Categories: Prescription, pwd, senior citizen{" "}
              </Text>
              <View style={styles.productInformationView}>
                <Text style={styles.productInformationText}>
                  Product Information
                </Text>
              </View>
              <View style={styles.informationView}>
                <Text style={styles.informationContent}>
                  {"          "}Zynapse 1G Tablet is a medication that contains
                  pyritinol, which is a nootropic agent. It is commonly used to
                  improve cognitive function, memory, and concentration in
                  people with various neurological conditions, such as
                  Alzheimer's disease, Parkinson's disease, and stroke.
                </Text>
              </View>

              <Text style={styles.quantityText}>x1</Text>

              <TouchableOpacity style={styles.removerOrderButton}>
                <Text style={styles.removerOrderText}>Remove Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ApprovedProductDetailScreen;
