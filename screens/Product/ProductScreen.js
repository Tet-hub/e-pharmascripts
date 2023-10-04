import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";
import { fetchDocByCondition } from "../../database/fetchDocByCondition";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";

const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const ProductScreen = ({ navigation, route }) => {
  const [product, setProductData] = useState([]);
  const sellerId = route.params?.sellerId;

  useEffect(() => {
    // Function to fetch initial data
    const fetchInitialData = async () => {
      try {
        const initialData = await fetchDocByCondition("products", [
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
        ]);
        setProductData(initialData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    // Function to set up real-time listener
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
          <View style={styles.addtocartButton}>
            <Text style={styles.addtocartText}>Add to cart</Text>
            <Iconify icon="ion:cart-outline" size={18} color="white" />
          </View>
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
