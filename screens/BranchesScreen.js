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
import { db } from "../firebase/firebase";
import { fetchBranchesData } from "../database/backend";
const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const BranchesScreen = ({ navigation, route }) => {
  const [branches, setBranches] = useState([]);
  const companyName = route.params?.name;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchesData = await fetchBranchesData(
          companyName,
          "sellers",
          "companyName"
        );

        setBranches(branchesData);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, [companyName]);

  // const handleProductScreen = () => {
  //   navigation.navigate("ProductScreen", {
  //     name: item.companyName,
  //     branch: item.branch,
  //   });
  // };
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A3A3A",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchCont: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1.5,
    marginVertical: 10,
  },
  iconSearch: {
    marginRight: 10,
    color: "black",
  },
  inputSearch: {
    flex: 1,
  },
  branchSelectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },

  pharmacyContainer: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  pharmacyCard: {
    borderRadius: 15,
    backgroundColor: "white",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 16,
  },
  image: {
    width: "80%",
    height: 90,
    borderRadius: 15,
    marginTop: 2,
    marginBottom: 4,
    alignSelf: "center",
  },
  ratingText: {
    textAlign: "left",
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  pharmacyName: {
    textAlign: "center",
    color: "#3C3C3C",
    fontWeight: "600",
    fontSize: 14,
    paddingTop: 5,
  },
  branchName: {
    textAlign: "center",
    color: "#3C3C3C",
    fontWeight: "600",
    fontSize: 14,
    paddingTop: 2,
  },
  viewButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EC6F56",
    borderRadius: 15,
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 10,
  },
  viewButtonText: {
    color: "#EC6F56",
    fontWeight: "500",
    fontSize: 13,
  },
});

export default BranchesScreen;
