import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./bs";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const BranchesScreen = ({ navigation, route }) => {
  const [branches, setBranches] = useState([]);
  const branchCompany = route.params?.name;
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  //
  const handleFilterClick = () => {
    setShowModal(true);
  };
  handleCloseDrawer = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        // Define the conditions array
        const conditions = [
          { fieldName: "companyName", operator: "==", value: branchCompany },
        ];

        // Generate the API URL with conditions
        const apiUrl = buildQueryUrl("sellers", conditions);

        // GET request to the apiUrl
        const response = await fetch(apiUrl, {
          method: "GET", // Set the request method to GET
        });

        if (response.ok) {
          const branchesData = await response.json();
          setBranches(branchesData);
        } else {
          console.log("API request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Error fetching branches:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [branchCompany]);

  const extractBranchName = (branch) => {
    const match = branch.match(/\(([^)]+)\)/);
    return match ? branch.replace(match[0], "").trim() : branch;
  };
  //{averageRating.toFixed(1)}
  const renderBranchItem = ({ item }) => (
    <View style={[styles.pharmacyContainer, { width: cardWidth }]}>
      <View style={styles.pharmacyCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.ratingText}>{item.rating}★</Text>
          <Text style={styles.averageStar}></Text>
        </View>
        <Image source={{ uri: item.img }} style={styles.image} />
        <Text style={styles.pharmacyName}>{item.companyName}</Text>
        <Text style={styles.branchName}>{`(${extractBranchName(
          item.branch
        )})`}</Text>

        <View style={styles.viewButtonContainer}>
          <TouchableOpacity
            style={styles.pharmacyDetailsView}
            onPress={() =>
              navigation.navigate("BranchDetailsScreen", {
                sellerId: item.id,
              })
            }
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate("ProductScreen", {
                name: item.companyName,
                branch: extractBranchName(item.branch),
                sellerId: item.id,
              })
            }
          >
            <Text style={styles.viewButtonText}>Products</Text>
            <Iconify
              icon="ic:round-greater-than"
              size={18}
              color="white"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  //
  const renderSearchIcon = () => {
    return (
      <TouchableOpacity style={styles.searchButtonIcon}>
        <Iconify icon="iconoir:search" size={22} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{route.params?.name}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <View style={styles.searchTexInputView}>
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search branch"
              />
            </View>
            {renderSearchIcon()}
          </View>
          <TouchableOpacity
            style={styles.iconFilterCont}
            onPress={handleFilterClick}
          >
            <Iconify icon="mi:filter" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.branchSelectionText}>Branch Selection</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.noOrdersCont}>
          <View style={styles.noOrders}>
            <Iconify
              icon="tabler:git-branch-deleted"
              size={50}
              color="black"
              style={styles.noOrdersIcon}
            />
            <Text>No Branches Yet</Text>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={branches}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderBranchItem}
            contentContainerStyle={styles.branchesContainer}
          />
          <Modal
            visible={showModal}
            animationType="fade"
            transparent={true}
            onRequestClose={() => {
              setShowModal(false);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <View style={styles.drawerContainer}>
                  <Text style={styles.drawerTitle}>Search Filter</Text>

                  <View style={styles.locationView}>
                    <Text style={styles.locationText}>By Location</Text>

                    <TouchableOpacity
                      style={{
                        ...styles.locationTO,
                        borderColor: isLocationButtonClicked
                          ? "#EC6F56"
                          : "#D9D9D9",
                      }}
                      onPress={() =>
                        setLocationButtonClicked(!isLocationButtonClicked)
                      }
                    >
                      <Text style={styles.searchlocationText}>
                        Search by location
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.resetApplyView}>
                    <TouchableOpacity
                      style={styles.resetTO}
                      activeOpacity={0.7}
                      onPress={handleCloseDrawer}
                    >
                      <Text style={styles.resetText}>CANCEL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.applyTO}>
                      <Text style={styles.applyText}>APPLY</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
};

export default BranchesScreen;
