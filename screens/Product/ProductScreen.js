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
} from "react-native";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";

import { getFirestore, addDoc, collection } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size

const cardWidth = (width - 30) / 2;
const ProductScreen = ({ navigation, route }) => {
  const [product, setProductData] = useState([]);
  const sellerId = route.params?.sellerId;

  useEffect(() => {
    // Function to fetch initial data
    const fetchInitialData = async () => {
      try {
        // Define the conditions array as an array of objects
        const conditions = [
          { fieldName: "createdBy", operator: "==", value: sellerId },
          {
            fieldName: "productStatus",
            operator: "in",
            value: ["Display", "Test", "Xyxy"],
          },
        ];

        // Generate the API URL with conditions
        const apiUrl = buildQueryUrl("products", conditions);

        // Make a GET request to the apiUrl
        const response = await fetch(apiUrl, {
          method: "GET", // Set the request method to GET
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

    // // Function to set up real-time listener
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

      // Cleanup the listener when the component unmounts
      return () => unsubscribe();
    };

    // Fetch initial data and set up real-time listener
    fetchInitialData();
    setUpRealTimeListener();
  }, [sellerId]);

  const addToCart = async (productId, productName, price) => {
    try {
      const authToken = await getAuthToken();
      const userId = authToken.userId; // Get userId from AsyncStorage
      console.log("userId", userId);
      // Define the quantity (you can set it as needed)
      const quantity = 1;

      // Reference to the user's cart
      const cartRef = db.ref(`carts/${userId}/${productId}`);

      // Check if the product is already in the cart
      const snapshot = await cartRef.once("value");
      const existingProduct = snapshot.val();

      if (existingProduct) {
        // Product exists in the cart, update the quantity
        const newQuantity = existingProduct.quantity + quantity;
        await cartRef.update({ quantity: newQuantity });
      } else {
        // Product doesn't exist in the cart, add it
        await cartRef.set({ productName, price, quantity });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const renderProducts = ({ item }) => {
    return (
      <View style={[styles.productContainer, { width: cardWidth }]}>
        <TouchableOpacity
          style={styles.productCard}
          onPress={() =>
            navigation.navigate("ProductDetailScreen", { productId: item.id })
          }
        >
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
            onPress={() => addToCart(item.id, item.productName, item.price)}
          >
            <View style={styles.addtocartButton}>
              <Text style={styles.addtocartText}>Add to cart</Text>
              <Iconify icon="ion:cart-outline" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View className="items-center flex-row mt-5 ml-3 mr-3 ">
          <Text style={styles.screenTitle}>
            {route.params?.name} ({route.params?.branch})
          </Text>
        </View>

        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <Iconify icon="circum:search" size={22} style={styles.iconSearch} />
            <TextInput placeholder="Search product" />
          </View>

          <TouchableOpacity>
            <View style={styles.iconFilterCont}>
              <Iconify icon="mi:filter" size={25} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.productSelectionText}>Product Selection</Text>

        <FlatList
          numColumns={2} // Display two items per row
          scrollEnabled={false}
          data={product}
          keyExtractor={(item) => item.id}
          renderItem={renderProducts}
          // columnWrapperStyle={styles.columnWrapper}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProductScreen;
