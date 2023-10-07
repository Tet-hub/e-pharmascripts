import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { Iconify } from "react-native-iconify";
import firebase from "firebase/app";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { db } from "../../firebase/firebase";
import { fetchBranchesData } from "../../database/backend";
import styles from "./stylesheet";
import { EMU_URL } from "../../src/api/apiURL";
const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const BranchesScreen = ({ navigation, route }) => {
  const [branches, setBranches] = useState([]);
  const branchCompany = route.params?.name;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Make the API request to your Express backend
        const response = await fetch(
          `${EMU_URL}/api/mobile/get/api/fetchBranches?collectionName=sellers&fieldName=companyName&value=${branchCompany}`
        );

        if (response.ok) {
          const branchesData = await response.json();
          setBranches(branchesData);
        } else {
          console.error("API request failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [branchCompany]);
  const extractBranchName = (branch) => {
    const match = branch.match(/\(([^)]+)\)/);
    return match ? branch.replace(match[0], "").trim() : branch;
  };

  const renderBranchItem = ({ item }) => (
    <View style={[styles.pharmacyContainer, { width: cardWidth }]}>
      <View style={styles.pharmacyCard}>
        <Text style={styles.ratingText}>{item.rating}★</Text>
        <Image source={{ uri: item.img }} style={styles.image} />
        <Text style={styles.pharmacyName}>{item.companyName}</Text>
        <Text style={styles.branchName}>{`(${extractBranchName(
          item.branch
        )})`}</Text>
        <View style={styles.viewButtonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductScreen", {
                name: item.companyName,
                branch: extractBranchName(item.branch),
                sellerId: item.id,
              })
            }
          >
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Pharmacy</Text>
              <Iconify icon="ic:round-greater-than" size={15} color="#EC6F56" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{route.params?.name}</Text>
        </View>

        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <Iconify icon="circum:search" size={22} style={styles.iconSearch} />
            <TextInput placeholder="Search branch" style={styles.inputSearch} />
          </View>
        </View>

        <Text style={styles.branchSelectionText}>Branch Selection</Text>

        <FlatList
          data={branches}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderBranchItem}
          contentContainerStyle={styles.branchesContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BranchesScreen;
