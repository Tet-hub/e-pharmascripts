import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";

const InstallmentScreen = () => {
  return (
    <View>
      <View style={styles.upperContainer}>
        <Text style={styles.screenTitle}>Installment</Text>
        <Text style={styles.uptoText}>You can get up to</Text>
        <Text style={styles.amountText}>{"\u20B1"}10,000</Text>
      </View>

      <View style={styles.lowerContainer}>
        <TouchableOpacity>
          <View style={styles.activateButton}>
            <Text style={styles.activateText}>ACTIVATE NOW</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.benefitsText}>Benefits</Text>
        <View style={styles.benefitsInfoContainer}>
          <Text style={styles.boldTitle}>Buy Now Pay Later</Text>
          <Text style={styles.lightInfo}>
            Buy now and pay for the 5th of the next month
          </Text>

          <Text style={styles.boldTitle}>Installment Plan</Text>
          <Text style={styles.lightInfo}>
            Multiple installment options available with low interest rate
          </Text>

          <Text style={styles.boldTitle}>Easy Application, Fast Approval</Text>
          <Text style={styles.lightInfo}>
            Get a credit limit of up to ₱ 10,000 within 24 hours
          </Text>
        </View>

        <View style={styles.line} />
        <Text style={styles.howText}>How Installment Works</Text>
        <View style={styles.calendarBillingContainer}>
          <Iconify icon="solar:calendar-outline" size={35} color="black" />
          <Text style={styles.billingText}>Billing Date</Text>
        </View>
        <View style={styles.calendarBillingContainer}>
          <View style={styles.verticalLine} />
          <Text style={styles.monthText}>
            Bill will be out by the 25th of the month
          </Text>
        </View>
      </View>
    </View>
  );
};

export default InstallmentScreen;
