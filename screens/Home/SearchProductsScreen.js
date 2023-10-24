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
import { getDocs, where, collection, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./searchedStyle";
import { Picker } from "@react-native-picker/picker";

const SearchProductsScreen = ({ navigation, route }) => {
  const { searchKeyword } = route.params;
  //console.log("keyword", searchKeyword);
  const [newSearchKeyword, setNewSearchKeyword] = useState(searchKeyword);
  const [sortingOption, setSortingOption] = useState(null);
  const [isLowToHighSelected, setIsLowToHighSelected] = useState(false);
  const [isHighToLowSelected, setIsHighToLowSelected] = useState(false);
  const [isLocationButtonClicked, setLocationButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayAllProducts, setDisplayAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  //console.log("PASSED DATA:", matchedProductIds);
  const handleFilterClick = () => {
    setShowModal(true);
  };
  // RESET SORTING
  const cancelSorting = () => {
    setLocationButtonClicked(false);
    setIsLowToHighSelected(false);
    setIsHighToLowSelected(false);
    setNewSearchKeyword("");
    setSelectedCategory("");
    setSortingOption(null);
    setShowModal(false);
  };
  //
  const sortProducts = () => {
    if (sortingOption === "lowToHigh") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "highToLow") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else {
      setSortingOption(null);
    }

    setShowModal(false);
  };

  //display based on the selected category
  //note: use includes when matching string to an array
  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredProducts(displayAllProducts);
    } else {
      const filteredByCategory = displayAllProducts.filter((product) => {
        if (Array.isArray(product.productCategory)) {
          return product.productCategory.includes(selectedCategory);
        } else {
          return product.productCategory === selectedCategory;
        }
      });
      setFilteredProducts(filteredByCategory);
    }
  }, [selectedCategory, displayAllProducts]);

  //fetched all products -- default display
  const fetchAllProducts = async () => {
    const productDataArray = [];
    try {
      const productsCollection = collection(db, "products");
      const productQuery = query(
        productsCollection,
        where("productStatus", "==", "Display")
      );
      const productDocs = await getDocs(productQuery);
      productDocs.forEach((doc) => {
        const data = doc.data();
        productDataArray.push({
          productName: data.productName,
          price: data.price,
          productImg: data.img,
          productCategory: data.category,
          id: doc.id,
        });
      });

      // Log the category values
      setDisplayAllProducts(productDataArray);
    } catch (error) {
      console.error("Error fetching all product data:", error);
    }
  };
  useEffect(() => {
    fetchAllProducts();
  }, []);

  //display products based on keyword or passed keyword
  useEffect(() => {
    const trimmedSearchKeyword = newSearchKeyword.trim().toLowerCase();
    const filteredProducts = displayAllProducts.filter((product) => {
      return product.productName.toLowerCase().includes(trimmedSearchKeyword);
    });
    setFilteredProducts(filteredProducts);
  }, [newSearchKeyword, displayAllProducts]);

  //fetch category-----------------------------
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
  }, []);

  //show search icon-----------------------
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
                    Rose Pharmacy (Basak San Nicolas Branch) Alumnos St., Basak
                    San Nicolas, Cebu City
                  </Text>
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
                  <Text style={styles.resetText}>CANCEL</Text>
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
