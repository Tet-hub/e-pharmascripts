import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ToastAndroid,
  TextInput,
  Modal,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Iconify } from "react-native-iconify";
import {
  getDocs,
  where,
  collection,
  query,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./searchedStyle";
import { Picker } from "@react-native-picker/picker";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { BASE_URL } from "../../src/api/apiURL";
import axios from "axios";
import { getAuthToken } from "../../src/authToken";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const SearchProductsScreen = ({ navigation, route }) => {
  //const { searchKeyword } = route.params;
  //console.log("keyword", searchKeyword);
  const [newSearchKeyword, setNewSearchKeyword] = useState("");
  const [sortingOption, setSortingOption] = useState(null);
  const [isLowToHighSelected, setIsLowToHighSelected] = useState(false);
  const [isHighToLowSelected, setIsHighToLowSelected] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displaySellerData, setDisplaySellerData] = useState([]);
  const [displayAllProducts, setDisplayAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [distances, setDistances] = useState({});
  const isLocationFilterApplied =
    isLocationButtonClicked && Object.keys(distances).length > 0;
  const apiKey = "AIzaSyAErVuJDetH9oqE36Gx_sBDBv2JIUbXcJ4";

  //console.log("PASSED DATA:", matchedProductIds);
  const handleFilterClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  // RESET SORTING
  const cancelSorting = async () => {
    setLocationButtonClicked(false);
    setIsLowToHighSelected(false);
    setIsHighToLowSelected(false);
    setNewSearchKeyword("");
    setSelectedCategory("");
    setSortingOption(null);
    setFilteredProducts([...displayAllProducts]);

    setShowModal(false);
  };

  //
  const sortProducts = () => {
    // Sort based on the sorting option
    let productsToSort = displayAllProducts.slice();

    if (sortingOption === "lowToHigh") {
      productsToSort = productsToSort.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "highToLow") {
      productsToSort = productsToSort.sort((a, b) => b.price - a.price);
    }

    // Filter based on the selected category and the search keyword
    let filteredProducts = productsToSort;
    if (selectedCategory !== "") {
      filteredProducts = productsToSort.filter((product) => {
        if (Array.isArray(product.productCategory)) {
          return product.productCategory.includes(selectedCategory);
        } else {
          return product.productCategory === selectedCategory;
        }
      });
    }

    // Apply the search keyword filter
    const trimmedSearchKeyword = newSearchKeyword.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((product) => {
      return product.productName.toLowerCase().includes(trimmedSearchKeyword);
    });

    // Sort based on distance
    if (isLocationButtonClicked) {
      filteredProducts = filteredProducts.sort((a, b) => {
        const distanceA = distances[a.address];
        const distanceB = distances[b.address];

        if (distanceA && distanceB) {
          return parseFloat(distanceA) - parseFloat(distanceB);
        }

        return 0; // Handle cases where distance data is missing
      });
    }

    // Update the state with the sorted and filtered products
    setFilteredProducts(filteredProducts);
    setShowModal(false);
  };

  //display products based on keyword or passed keyword
  useEffect(() => {
    if (newSearchKeyword !== "") {
      setSelectedCategory("");
      setLocationButtonClicked(false);
    }
    const trimmedSearchKeyword = newSearchKeyword.trim().toLowerCase();
    const filteredProducts = displayAllProducts.filter((product) => {
      return product.productName.toLowerCase().includes(trimmedSearchKeyword);
    });
    setFilteredProducts(filteredProducts);
  }, [newSearchKeyword, displayAllProducts]);

  //
  useEffect(() => {
    const fetchCustomerAddress = async () => {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;
        setCustomerId(customerId);

        const customerDocRef = doc(db, "customers", customerId);
        const customerDocSnapshot = await getDoc(customerDocRef);

        if (customerDocSnapshot.exists()) {
          const customerData = customerDocSnapshot.data();
          const address = customerData.customerAddress;
          setCustomerAddress(address);
        }
      } catch (error) {
        console.log("Error fetching customer address:", error);
      }
    };
    fetchCustomerAddress();
  }, []);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productQuery = query(
          productsCollection,
          where("productStatus", "==", "Display")
        );
        const sellerCollection = collection(db, "sellers");
        const productDocs = await getDocs(productQuery);

        const sellerIds = productDocs.docs.map((doc) => doc.data().createdBy);
        //console.log("SELLERS", sellerIds);

        const sellerQuery = query(
          sellerCollection,
          where("sellerId", "in", sellerIds)
        );
        const sellerDocs = await getDocs(sellerQuery);

        const sellerDataArray = [];

        const foundSellerIds = new Set();

        sellerDocs.forEach((doc) => {
          const sellerData = doc.data();
          const sellerIdData = sellerData.address;
          //console.log(`Seller id from collection: ${sellerIdData}`);

          sellerDataArray.push({
            sellerId: sellerData.sellerId,
            address: sellerData.address,
            branch: sellerData.branch,
            company: sellerData.companyName,
          });

          foundSellerIds.add(sellerData.sellerId);
        });
        // Identify the missing sellerIds
        const missingSellerIds = sellerIds.filter(
          (sellerId) => !foundSellerIds.has(sellerId)
        );
        //console.log("Missing SellerIds:", missingSellerIds);

        //console.log("Seller Data Array:", sellerDataArray);
        //console.log("Seller Data Array:", sellerDataArray);

        setDisplaySellerData(sellerDataArray);

        const productDataArray = []; // Ensure productDataArray is initialized

        productDocs.forEach((doc) => {
          const data = doc.data();
          const sellerId = data.createdBy;
          // console.log("Seller ID:", sellerId);

          const sellerBranch = sellerDataArray.find(
            (sellerBranch) => sellerBranch.sellerId === String(data.createdBy)
          );

          productDataArray.push({
            productName: data.productName,
            price: data.price,
            productImg: data.img,
            productCategory: data.category,
            //productCompanyName: data.companyName,
            id: doc.id,
            address: sellerBranch ? sellerBranch.address : "No address",
            branch: sellerBranch
              ? sellerBranch.branch.replace(/ *\([^)]*\) */g, "").trim()
              : "No branch",
            company: sellerBranch ? sellerBranch.company : "No company",
            //distance: distances[sellerAddress.address],
          });
        });

        // Log the productDataArray
        //console.log("Product Data Array:", productDataArray);

        // Log the category values
        setDisplayAllProducts(productDataArray);
      } catch (error) {
        console.error("Error fetching all product data:", error);
      }
    };

    fetchAllProducts();
  }, []);

  //
  const fetchDistances = async () => {
    const distancePromises = displaySellerData.map((seller) =>
      fetchDistance(customerAddress, seller.address)
    );

    const distances = await Promise.all(distancePromises);

    const distancesObject = {};
    displaySellerData.forEach((seller, index) => {
      distancesObject[seller.address] = distances[index];
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
  }, [customerAddress, displaySellerData]);

  //fetch category
  const fetchProductCategories = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productQuery = query(
        productsCollection,
        where("productStatus", "==", "Display")
      );
      const productDocs = await getDocs(productQuery);
      const categories = new Set(); //ensure uniqueness
      productDocs.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          if (Array.isArray(data.category)) {
            // If it's an array, extend the Set
            data.category.forEach((cat) => categories.add(cat));
          } else {
            // If it's a single category, add it to the Set
            categories.add(data.category);
          }
        }
      });
      const uniqueCategories = [...categories];
      //console.log("Product CAtegories:", uniqueCategories);
      setSelectedCategories(uniqueCategories);
    } catch (error) {
      console.log("Error fetching category products:", error);
    }
  };
  useEffect(() => {
    fetchProductCategories();
  }, []);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current && newSearchKeyword === "") {
      inputRef.current.focus();
    }
  }, [newSearchKeyword]);

  //show search icon
  const renderSearchIcon = () => {
    return (
      <Text style={styles.searchButtonIcon}>
        <Iconify icon="iconoir:search" size={22} color="black" />
      </Text>
    );
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.ePharmaScriptsView}>
        <Text style={styles.eText}>
          E-
          <Text style={styles.PharmaScriptsText}> PharmaScripts</Text>
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <View style={styles.searchTexInputView}>
              <TextInput
                ref={inputRef}
                style={styles.searchTextInput}
                placeholder="Search product"
                value={newSearchKeyword}
                onChangeText={(text) => setNewSearchKeyword(text)}
              />
            </View>
            {renderSearchIcon()}
          </View>
          <TouchableOpacity onPress={handleFilterClick}>
            <View style={styles.iconFilterCont}>
              <Iconify icon="mi:filter" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.productSelectionText}>Product Selection</Text>
      {filteredProducts.length === 0 ? ( // Check if productData is empty
        <Text style={styles.noResultsText}>No results matched</Text>
      ) : (
        <ScrollView style={{ marginBottom: 20 }}>
          {filteredProducts.map((product, index) => (
            <TouchableOpacity
              style={styles.productBorder}
              activeOpacity={0.7}
              key={index}
              onPress={() =>
                navigation.navigate("ProductDetailScreen", {
                  productId: product.id,
                })
              }
            >
              <View style={styles.insideBorder}>
                <View
                  style={{
                    width: "22%",
                    marginLeft: 5,
                  }}
                >
                  {product.productImg ? (
                    <Image
                      source={{ uri: product.productImg }}
                      style={{ width: 60, height: 60, marginLeft: 5 }}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/img/default-image.jpg")}
                      style={{ width: 60, height: 60, marginLeft: 5 }}
                    />
                  )}
                </View>
                <View style={{ width: "52%" }}>
                  <Text style={styles.productNameText}>
                    {product.productName}
                  </Text>
                  <Text style={styles.locationTextDisplay}>
                    {product.company}
                    {product.branch ? ` (${product.branch} Branch)` : ""}
                  </Text>
                  {isLocationFilterApplied && (
                    <Text style={styles.distanceDisplayText}>
                      {distances[product.address] &&
                        `${distances[product.address]}`}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: "23%",
                    marginLeft: 10,
                  }}
                >
                  <Text style={styles.priceText}>₱ {product.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
              <View style={styles.categoryView}>
                <Text style={styles.categoryText}>By Category</Text>
                <View style={styles.categoryTO}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedCategory(itemValue);
                    }}
                  >
                    <Picker.Item label="Select a category" value="" />
                    {selectedCategories.map((category) => (
                      <Picker.Item
                        label={category}
                        value={category}
                        key={category}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.separator} />

              <View style={styles.locationView}>
                <Text style={styles.locationText}>By Location</Text>

                <TouchableOpacity
                  style={{
                    ...styles.locationTO,
                    borderColor: isLocationButtonClicked
                      ? "#EC6F56"
                      : "#D9D9D9",
                  }}
                  onPress={() => {
                    if (isLowToHighSelected || isHighToLowSelected) {
                      ToastAndroid.show(
                        "Select either location or price",
                        ToastAndroid.SHORT
                      );
                      return;
                    }

                    setLocationButtonClicked(!isLocationButtonClicked);
                  }}
                >
                  <Text style={styles.searchlocationText}>
                    Search by location
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />

              <View style={styles.priceView}>
                <Text style={styles.priceText}>By Price</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.lowToHighTO,
                    borderColor: isLowToHighSelected ? "#EC6F56" : "#D9D9D9",
                  }}
                  onPress={() => {
                    if (isLocationButtonClicked) {
                      ToastAndroid.show(
                        "Select either location or price",
                        ToastAndroid.SHORT
                      );
                      return;
                    }

                    if (isLowToHighSelected) {
                      setIsLowToHighSelected(false);
                      setSortingOption(null);
                    } else {
                      setIsLowToHighSelected(true);
                      setIsHighToLowSelected(false);
                      setSortingOption("lowToHigh");
                    }
                  }}
                >
                  <Text style={styles.lowToHighTOText}>Low to High</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.highToLowTO,
                    borderColor: isHighToLowSelected ? "#EC6F56" : "#D9D9D9",
                  }}
                  onPress={() => {
                    if (isLocationButtonClicked) {
                      ToastAndroid.show(
                        "Select either location or price",
                        ToastAndroid.SHORT
                      );
                      return;
                    }

                    if (isHighToLowSelected) {
                      setIsHighToLowSelected(false);
                      setSortingOption(null);
                    } else {
                      setIsLowToHighSelected(false);
                      setIsHighToLowSelected(true);
                      setSortingOption("highToLow");
                    }
                  }}
                >
                  <Text style={styles.highToLowTOText}>High to Low </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.separator} />

              <View style={styles.resetApplyView}>
                <TouchableOpacity
                  style={styles.resetTO}
                  onPress={cancelSorting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resetText}>RESET</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeTO} onPress={closeModal}>
                  <Text style={styles.closeText}>CLOSE</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.applyTO} onPress={sortProducts}>
                  <Text style={styles.applyText}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SearchProductsScreen;
