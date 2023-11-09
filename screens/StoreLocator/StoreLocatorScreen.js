import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";
import styles from "./stylesheet";

const StoreLocatorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Pharmacy Store Locator</Text>
      <View style={styles.upperContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search store location"
            style={styles.placeholderSearch}
          />
          <Iconify icon="circum:search" size={22} style={styles.iconSearch} />
        </View>
      </View>

      <View>
        <Text style={styles.locationText}>Pharmacy Locations:</Text>
      </View>
    </View>
  );
};

export default StoreLocatorScreen;
