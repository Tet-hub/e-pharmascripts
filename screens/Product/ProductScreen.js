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
  ActivityIndicator,
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
  const [loading, setLoading] = useState(true);
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

  const closeModal = () => {
    setShowModal(false);
  };

  const sortProducts = () => {
    let productsToSort = product.slice();

    if (sortingOption === "lowToHigh") {
      productsToSort = productsToSort.sort((a, b) => a.price - b.price);
    } else if (sortingOption === "highToLow") {
      productsToSort = productsToSort.sort((a, b) => b.price - a.price);
    }

    let filteredProducts = productsToSort;
    // Filter based on the selected category
    if (selectedCategory !== "") {
      filteredProducts = filteredProducts.filter((product) => {
        if (Array.isArray(product.category)) {
          return product.category.includes(selectedCategory);
        } else {
          return product.category === selectedCategory;
        }
      });
    }

    // Apply the search keyword filter
    const trimmedSearchKeyword = searchKeyword.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.productName.toLowerCase().includes(trimmedSearchKeyword)
    );

    // Update the state with the sorted and filtered products
    setFilteredProduct(filteredProducts);
    setShowModal(false);
  };

  //
  useEffect(() => {
    if (searchKeyword !== "") {
      setSelectedCategory("");
    }
    const trimmedSearchKeyword = searchKeyword.trim().toLowerCase();
    const filtered = product.filter((item) =>
      item.productName.toLowerCase().includes(trimmedSearchKeyword)
    );
    setFilteredProduct(filtered);
  }, [searchKeyword, product]);

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
          { fieldName: "sellerId", operator: "==", value: sellerId },
          // { fieldName: "stock", operator: "!=", value: 0 },
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
      } finally {
        setLoading(false);
      }
    };

    const setUpRealTimeListener = () => {
      const multipleConditions = [
        {
          fieldName: "sellerId",
          operator: "==",
          value: sellerId,
        },
        // { fieldName: "stock", operator: "!=", value: 0 },
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
          setLoading(false);
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
      const categories = new Set();
      product.forEach((prod) => {
        if (prod.category) {
          if (Array.isArray(prod.category)) {
            prod.category.forEach((cat) => categories.add(cat));
          } else {
            categories.add(prod.category);
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
  }, [product]);

  /*
  const fetchProductCategories = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productQuery = query(
        productsCollection,
        where("sellerId", "==", sellerId),
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
  }, [sellerId]); */

  const renderProducts = ({ item }) => {
    return (
      <View style={[styles.productContainer, { width: cardWidth }]}>
        <View style={styles.productCard}>
          <View style={styles.imageContainer}>
            {item.img ? (
              <Image source={{ uri: item.img }} style={styles.image} />
            ) : (
              <Image
                source={require("../../assets/img/def-image.jpg")}
                style={styles.image}
              />
            )}
          </View>
          <Text style={styles.productName}>
            {item.productName.length > 20
              ? `${item.productName.substring(0, 16)}...`
              : item.productName}
          </Text>

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
                branch: route.params?.branch,
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : filteredProduct.length !== 0 ? (
        <View style={{ justifyContent: "center" }}>
          <FlatList
            numColumns={2}
            scrollEnabled={false}
            data={filteredProduct}
            keyExtractor={(item) => item.id}
            renderItem={renderProducts}
          />
        </View>
      ) : (
        <View style={styles.noOrdersCont}>
          <View style={styles.noOrders}>
            <Iconify
              icon="icons8:document"
              size={45}
              color="black"
              style={styles.noOrdersIcon}
            />
            <Text style={styles.noOrdersText}>No products yet</Text>
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
                  <Text style={styles.resetText}>RESET</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeTO} onPress={closeModal}>
                  <Text style={styles.closeText}>CLOSE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyTO}
                  onPress={() => {
                    sortProducts();
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
