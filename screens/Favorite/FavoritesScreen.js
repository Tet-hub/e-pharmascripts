import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";

const { width, height } = Dimensions.get("window");
const cardWidth = (width - 30) / 2;
const TestImage = require("../../assets/img/amlodipine.png");

const ProductCard = ({
  productName,
  productImageSource,
  productReq,
  productPrice,
}) => {
  return (
    <View style={[styles.productContainer, { width: cardWidth }]}>
      <View style={styles.productCard}>
        <Iconify icon="bi:x" size={22} color="black" style={styles.xButton} />
        <Image source={productImageSource} style={styles.productImage} />
        <Text style={styles.productName}>{productName}</Text>
        <Text style={styles.productReq}>{productReq}</Text>
        <Text style={styles.productPrice}>{productPrice}</Text>
        <TouchableOpacity>
          <View style={styles.addButton}>
            <Text style={styles.addText}>Add to cart </Text>
            <Iconify
              icon="ic:outline-shopping-cart"
              size={17}
              color="white"
              style={styles.cartIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FavoritesScreen = () => {
  // Sample data, replace this with your actual data from the database
  const products = [
    {
      productName: "Zynapse 1G Tablet",
      productImageSource: TestImage,
      productReq: "[ Requires Prescription ]",
      productPrice: "\u20B1" + "102.75", // PESO SIGN
    },
    // Add more product objects as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Favorites</Text>
      <View style={styles.line} />

      <View style={styles.row}>
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </View>
    </View>
  );
};

export default FavoritesScreen;
