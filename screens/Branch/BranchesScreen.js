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
import { getAuthToken } from "../../src/authToken";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../../src/api/googleApiKey";
const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const BranchesScreen = ({ navigation, route }) => {
  const [branches, setBranches] = useState([]);
  const branchCompany = route.params?.name;

  const [showModal, setShowModal] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [branchesAddress, setBranchesAddress] = useState(null);
  const [distances, setDistances] = useState({});
  const [sortedBranches, setSortedBranches] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const isLocationFilterApplied =
    isLocationButtonClicked && Object.keys(distances).length > 0;
  const apiKey = GOOGLE_MAPS_API_KEY;
  //
  const handleFilterClick = () => {
    setShowModal(true);
  };
  handleCloseDrawer = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesAddressArray = [];
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
          branchesData.forEach((branch) => {
            branchesAddressArray.push({
              branchAddress: branch.address,
              branchesID: branch.sellerId,
            });
          });

          setBranchesAddress(branchesAddressArray);
        } else {
          console.log("API request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [branchCompany]);

  useEffect(() => {
    const fetchCustomerAddress = async () => {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;

        const customerDocRef = doc(db, "customers", customerId);
        const customerDocSnapshot = await getDoc(customerDocRef);

        if (customerDocSnapshot.exists()) {
          const customerData = customerDocSnapshot.data();
          const address = customerData.customerAddress;
          //console.log("Customer", address);
          setCustomerAddress(address);
        }
      } catch (error) {
        console.log("Error fetching customer address:", error);
      }
    };
    fetchCustomerAddress();
  }, []);

  //
  const fetchDistances = async () => {
    if (!branchesAddress || branchesAddress.length === 0) {
      return;
    }

    const distancePromises = branchesAddress.map((branch) =>
      fetchDistance(customerAddress, branch.branchAddress)
    );

    const distances = await Promise.all(distancePromises);

    const distancesObject = {};
    branchesAddress.forEach((branch, index) => {
      distancesObject[branch.branchAddress] = distances[index];
    });

    setDistances(distancesObject);
  };

  const fetchDistance = async (origin, destination) => {
    try {
      const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
        origin
      )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.status === "OK" && data.rows.length > 0) {
        const distanceText = data.rows[0].elements[0].distance.text;
        return distanceText;
      } else {
        console.error("Error fetching distance data for", origin, data.status);
        return null;
      }
    } catch (error) {
      console.error("Error fetching distance data for", origin, error);
      return null;
    }
  };

  useEffect(() => {
    fetchDistances();
  }, [customerAddress, branchesAddress]);

  //search
  useEffect(() => {
    if (searchKeyword !== "") {
      setLocationButtonClicked(false);
    }
    const trimmedSearchKeyword = searchKeyword.trim().toLowerCase();
    if (trimmedSearchKeyword === "") {
      setSortedBranches(branches);
    } else {
      // Filter branches based on the search keyword
      const filteredBranches = branches.filter((branch) => {
        const branchName = extractBranchName(branch.branch).toLowerCase();
        return branchName.includes(trimmedSearchKeyword);
      });
      setSortedBranches(filteredBranches);
    }
  }, [searchKeyword, branches]);

  const sortBranches = () => {
    // Create a copy of the branches array to avoid modifying the original data
    const branchesCopy = [...branches];

    if (isLocationButtonClicked) {
      branchesCopy.sort((branchA, branchB) => {
        const distanceA = distances[branchA.address];
        const distanceB = distances[branchB.address];

        if (distanceA && distanceB) {
          return parseFloat(distanceA) - parseFloat(distanceB);
        }

        return 0;
      });
    }

    setSortedBranches(branchesCopy);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const cancelSorting = async () => {
    setSearchKeyword("");
    setLocationButtonClicked(false);
    setSortedBranches(branches);
    setShowModal(false);
  };

  const extractBranchName = (branch) => {
    const match = branch.match(/\(([^)]+)\)/);
    return match ? branch.replace(match[0], "").trim() : branch;
  };
  //{averageRating.toFixed(1)}
  const renderBranchItem = ({ item }) => (
    <View style={[styles.pharmacyContainer, { width: cardWidth }]}>
      <View style={styles.pharmacyCard}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.ratingText}>{item.rating}★</Text>
          </View>
          <View>
            {isLocationFilterApplied && (
              <Text style={styles.distanceText}>
                {distances[item.address] ? distances[item.address] : ""}
              </Text>
            )}
          </View>
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  value={searchKeyword}
                  onChangeText={(text) => setSearchKeyword(text)}
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
        ) : branches.length != 0 ? (
          <View>
            <FlatList
              data={sortedBranches.length > 0 ? sortedBranches : branches}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={renderBranchItem}
              contentContainerStyle={styles.branchesContainer}
            />
          </View>
        ) : (
          <View style={styles.noOrdersCont}>
            <View style={styles.noOrders}>
              <Iconify
                icon="ph:git-branch-light"
                size={45}
                color="black"
                style={styles.noOrdersIcon}
              />
              <Text style={styles.noOrdersText}>No branches yet</Text>
            </View>
          </View>
        )}
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
                    onPress={cancelSorting}
                  >
                    <Text style={styles.resetText}>RESET</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.closeTO} onPress={closeModal}>
                    <Text style={styles.closeText}>CLOSE</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyTO}
                    activeOpacity={0.7}
                    onPress={sortBranches}
                  >
                    <Text style={styles.applyText}>APPLY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BranchesScreen;
