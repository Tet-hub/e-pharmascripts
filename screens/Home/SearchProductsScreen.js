import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ToastAndroid,
  TextInput,
  Modal,
  ActivityIndicator,
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
import { getAuthToken } from "../../src/authToken";
import { GOOGLE_MAPS_API_KEY } from "../../src/api/googleApiKey";
const SearchProductsScreen = ({ navigation }) => {
  const [newSearchKeyword, setNewSearchKeyword] = useState("");
  const [sortingOption, setSortingOption] = useState(null);
  const [isLowToHighSelected, setIsLowToHighSelected] = useState(false);
  const [isHighToLowSelected, setIsHighToLowSelected] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayAllProducts, setDisplayAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const apiKey = GOOGLE_MAPS_API_KEY;

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

    // Apply distance sorting if location button is clicked
    if (isLocationButtonClicked) {
      filteredProducts = filteredProducts.sort((a, b) => {
        return a.distance - b.distance;
      });

      // Update filtered products to display distance only when location button is clicked
      filteredProducts = filteredProducts.map((product) => ({
        ...product,
        shouldDisplayDistance: true,
      }));
    } else {
      // Update filtered products to not display distance when location button is not clicked
      filteredProducts = filteredProducts.map((product) => ({
        ...product,
        shouldDisplayDistance: false,
      }));
    }

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

  //customerAddress
  useEffect(() => {
    const fetchCustomerAddress = async () => {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;
        const customerDocRef = doc(db, "customers", customerId);
        const customerDocSnapshot = await getDoc(customerDocRef);

        if (customerDocSnapshot.exists()) {
          const customerData = customerDocSnapshot.data();
          const address = customerData.address;
          setCustomerAddress(address);
        }
      } catch (error) {
        console.log("Error fetching customer address:", error);
      }
    };
    fetchCustomerAddress();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const dbSeller = collection(db, "sellers");
        const activeSellersSnapshot = await getDocs(
          query(dbSeller, where("status", "==", "Active"))
        );

        const Sellers6KM = [];

        for (const sellerDoc of activeSellersSnapshot.docs) {
          const seller = sellerDoc.data();
          const sellerAddress = seller.formattedAddress;
          const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
            customerAddress
          )}&destinations=${encodeURIComponent(sellerAddress)}&key=${apiKey}`;

          try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (
              data.rows &&
              data.rows.length > 0 &&
              data.rows[0].elements &&
              data.rows[0].elements.length > 0
            ) {
              const distance = data.rows[0].elements[0].distance
                ? data.rows[0].elements[0].distance.value
                : undefined;
              if (distance !== undefined && distance < 6000) {
                Sellers6KM.push({
                  sellerId: seller.sellerId,
                  distance: distance,
                  branch: seller.branch,
                  companyName: seller.companyName,
                  formattedAddress: seller.formattedAddress,
                });
              }
            } else {
              console.error("Invalid distance data received:", data);
            }
          } catch (error) {
            console.error("Error fetching distance:", error);
          }
        }
        //console.log("Sellers within 6KM:", Sellers6KM);

        // Check if Sellers6KM has data
        if (Sellers6KM.length > 0) {
          const dbProduct = collection(db, "products");
          const productSnapshot = await getDocs(
            query(dbProduct, where("productStatus", "==", "Display"))
          );

          const productDataArray = [];

          productSnapshot.forEach((doc) => {
            const data = doc.data();
            const matchedSeller = Sellers6KM.find(
              (seller) => seller.sellerId === data.sellerId
            );

            if (matchedSeller) {
              const productDetails = {
                productName: data.productName,
                price: data.price,
                productImg: data.img,
                productCategory: data.category,
                id: doc.id,
                distance: matchedSeller.distance,
                address: matchedSeller.formattedAddress,
                branch: matchedSeller.branch
                  .replace(/ *\([^)]*\) */g, "")
                  .trim(),
                company: matchedSeller.companyName,
              };
              productDataArray.push(productDetails);
            }
          });
          //console.log("Product Data Array:", productDataArray);
          setDisplayAllProducts(productDataArray);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [customerAddress]);

  //fetch category
  const fetchProductCategories = async () => {
    try {
      const categories = new Set();
      displayAllProducts.forEach((product) => {
        if (product.productCategory) {
          if (Array.isArray(product.productCategory)) {
            product.productCategory.forEach((cat) => categories.add(cat));
          } else {
            categories.add(product.productCategory);
          }
        }
      });
      const uniqueCategories = [...categories];
      setSelectedCategories(uniqueCategories);
    } catch (error) {
      console.log("Error fetching category products:", error);
    }
  };
  useEffect(() => {
    fetchProductCategories();
  }, [displayAllProducts]);

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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EC6F56" />
        </View>
      ) : (
        <>
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
          {filteredProducts.length === 0 ? (
            <Text style={styles.noResultsText}>No results matched</Text>
          ) : (
            <ScrollView
              style={{ marginBottom: 20 }}
              showsVerticalScrollIndicator={false}
              persistentScrollbar={false}
            >
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

                      {product.shouldDisplayDistance && product.distance && (
                        <Text style={styles.distanceDisplayText}>
                          {`${(product.distance / 1000).toFixed(2)} km`}
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
                        borderColor: isLowToHighSelected
                          ? "#EC6F56"
                          : "#D9D9D9",
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
                        borderColor: isHighToLowSelected
                          ? "#EC6F56"
                          : "#D9D9D9",
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

                    <TouchableOpacity
                      style={styles.closeTO}
                      onPress={closeModal}
                    >
                      <Text style={styles.closeText}>CLOSE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.applyTO}
                      onPress={sortProducts}
                    >
                      <Text style={styles.applyText}>APPLY</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default SearchProductsScreen;
