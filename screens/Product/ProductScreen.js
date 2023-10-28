import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const cardWidth = (width - 30) / 2;

const ProductScreen = ({ navigation, route }) => {
  const sellerId = route.params?.sellerId;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [product, setProductData] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sortingOption, setSortingOption] = useState(null);
  const [isLowToHighSelected, setIsLowToHighSelected] = useState(false);
  const [isHighToLowSelected, setIsHighToLowSelected] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  //
  const handleFilterClick = () => {
    setShowModal(true);
  };

  // sorting and select category
  const applySorting = (data) => {
    const sortedProduct = [...data];

    if (sortingOption === "lowToHigh") {
      sortedProduct.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "highToLow") {
      sortedProduct.sort((a, b) => b.price - a.price);
    } else {
      setSortingOption(null);
    }

    return sortedProduct;
  };

  const applyFilters = (data) => {
    let filteredProducts = [...data];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((item) => {
        if (Array.isArray(item.category)) {
          return item.category.includes(selectedCategory);
        } else {
          return item.category === selectedCategory;
        }
      });
    }

    if (isLocationButtonClicked) {
      //
    }

    // Apply sorting
    return applySorting(filteredProducts);
  };
  //
  const applyFiltersAndSorting = () => {
    // First, apply sorting to the products
    const sortedData = applySorting(product);

    // Then, apply filters to the sorted data
    const filteredAndSortedData = applyFilters(sortedData);

    // Set the filtered and sorted data
    setFilteredProduct(filteredAndSortedData);
    setShowModal(false);
  };
  //
  const cancelSorting = () => {
    setSelectedCategory("");
    setLocationButtonClicked(false);
    setIsLowToHighSelected(false);
    setIsHighToLowSelected(false);
    setSortingOption(null);
    setSearchKeyword("");
    setFilteredProduct(product); // Show the default display of products
    setShowModal(false);
  };
  //
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const conditions = [
          { fieldName: "createdBy", operator: "==", value: sellerId },
          {
            fieldName: "productStatus",
            operator: "in",
            value: ["Display", "Test", "Xyxy"],
          },
        ];
        const apiUrl = buildQueryUrl("products", conditions);
        const response = await fetch(apiUrl, {
          method: "GET",
        });

        if (response.ok) {
          const branchesData = await response.json();
          setProductData(branchesData);
        } else {
          console.log("API request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    const setUpRealTimeListener = () => {
      const multipleConditions = [
        {
          fieldName: "createdBy",
          operator: "==",
          value: sellerId,
        },
        {
          fieldName: "productStatus",
          operator: "in",
          value: ["Display", "Test", "Xyxy"],
        },
      ];

      const unsubscribe = listenForItem(
        "products",
        multipleConditions,
        (products) => {
          setProductData(products);
        }
      );
      return () => unsubscribe();
    };

    fetchInitialData();
    setUpRealTimeListener();
  }, [sellerId]);

  //fetch category
  const fetchProductCategories = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productQuery = query(
        productsCollection,
        where("createdBy", "==", sellerId),
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

      // Convert the Set back to an array
      const uniqueCategories = [...categories];
      //unique categories
      //console.log("Product CAtegories:", uniqueCategories);
      setSelectedCategories(uniqueCategories);
    } catch (error) {
      console.log("Error fetching category products:", error);
    }
  };

  useEffect(() => {
    fetchProductCategories();
  }, [sellerId]);

  //
  useEffect(() => {
    const trimmedSearchKeyword = searchKeyword.trim().toLowerCase();
    const filtered = product.filter((item) =>
      item.productName.toLowerCase().includes(trimmedSearchKeyword)
    );
    setFilteredProduct(filtered);
  }, [searchKeyword, product]);

  const renderProducts = ({ item }) => {
    return (
      <View style={[styles.productContainer, { width: cardWidth }]}>
        <View style={styles.productCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.img }} style={styles.image} />
          </View>
          <Text style={styles.productName}>{item.productName}</Text>

          {item.requiresPrescription == "Yes" ? (
            <Text style={styles.productReq}> [ Requires Prescription ] </Text>
          ) : (
            <Text style={styles.productReq}> </Text>
          )}

          <Text style={styles.productPrice}>₱ {item.price}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductDetailScreen", {
                productId: item.id,
                name: route.params?.name,
              })
            }
          >
            <View style={styles.addtocartButton}>
              <Text style={styles.addtocartText}>View Product</Text>
              <Iconify icon="ic:round-greater-than" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //
  const renderSearchIcon = () => {
    return (
      <TouchableOpacity style={styles.searchButtonIcon}>
        <Iconify icon="iconoir:search" size={22} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View className="items-center flex-row mt-5 ml-3 mr-3 ">
        <Text style={styles.screenTitle}>
          {route.params?.name} ({route.params?.branch})
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <View style={styles.searchTexInputView}>
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search product"
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

      <Text style={styles.productSelectionText}>Product Selection</Text>

      <FlatList
        numColumns={2}
        scrollEnabled={false}
        data={filteredProduct}
        keyExtractor={(item) => item.id}
        renderItem={renderProducts}
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

              <View style={styles.priceView}>
                <Text style={styles.priceText}>By Price</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    ...styles.lowToHighTO,
                    borderColor: isLowToHighSelected ? "#EC6F56" : "#D9D9D9",
                  }}
                  onPress={() => {
                    if (isLowToHighSelected) {
                      // If it's already selected, deselect it
                      setIsLowToHighSelected(false);
                      setSortingOption(null);
                    } else {
                      // If it's not selected, select it
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
                    if (isHighToLowSelected) {
                      // If it's already selected, deselect it
                      setIsHighToLowSelected(false);
                      setSortingOption(null);
                    } else {
                      // If it's not selected, select it
                      setIsLowToHighSelected(false); // Deselect "Low to High" if selected
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
                  <Text style={styles.resetText}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyTO}
                  onPress={() => {
                    applyFiltersAndSorting();
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.applyText}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default ProductScreen;
