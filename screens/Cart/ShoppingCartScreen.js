import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Iconify } from "react-native-iconify";
import { Checkbox } from "expo-checkbox";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { getAuthToken } from "../../src/authToken";
import buildQueryUrl from "../../src/api/components/conditionalQuery";

import styles from "./stylesheet";

const ShoppingCartScreen = () => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    // Function to fetch initial data
    const fetchCartItems = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId;
        if (!userId) {
          console.log("User ID is undefined or null.");
          return;
        }
        // Define the conditions array as an array of objects
        const conditions = [
          { fieldName: "userId", operator: "==", value: userId },
        ];

        // Generate the API URL with conditions
        const apiUrl = buildQueryUrl("cart", conditions);

        // Make a GET request to the apiUrl
        const response = await fetch(apiUrl, {
          method: "GET", // Set the request method to GET
        });

        if (response.ok) {
          const cartItemsData = await response.json();
          setCartItems(cartItemsData);
        } else {
          console.log("API request failed with status:", response.status);
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleIncrement = (productId) => {
    // Find the cart item with the matching productId
    const updatedProductData = item.map((cartItem) => {
      if (cartItem.id === productId) {
        // Check if quantity is less than available stock
        if (cartItem.quantity < cartItem.stock) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            // Update other properties if needed
          };
        }
      }
      return cartItem;
    });

    // Update the product data state with the updated quantity
    setProductData(updatedProductData);

    // Update selected quantity (optional)
    const updatedSelectedQuantity = selectedQuantity + 1;
    setSelectedQuantity(updatedSelectedQuantity);
  };

  const handleDecrement = (productId) => {
    // Find the cart item with the matching productId
    const updatedProductData = item.map((cartItem) => {
      if (cartItem.id === productId) {
        // Check if quantity is less than available stock
        if (cartItem.quantity > cartItem.stock) {
          return {
            ...cartItem,
            quantity: cartItem.quantity - 1,
            // Update other properties if needed
          };
        }
      }
      return cartItem;
    });

    // Update the product data state with the updated quantity
    setProductData(updatedProductData);

    // Update selected quantity (optional)
    const updatedSelectedQuantity = selectedQuantity + 1;
    setSelectedQuantity(updatedSelectedQuantity);
  };

  const navigation = useNavigation();

  const handleToValidateScreen = () => {
    // Navigate to my order screen
    navigation.navigate("ToValidateScreen");
  };

  const groupCartItemsBySeller = (cartItems) => {
    const groupedItems = {};

    cartItems.forEach((item) => {
      const sellerId = item.sellerId;
      console.log("group", sellerId); // Replace with the actual key for seller ID in your cart item data
      if (!groupedItems[sellerId]) {
        groupedItems[sellerId] = [];
      }
      groupedItems[sellerId].push(item);
    });
    console.log("cartItems", cartItems);

    return Object.values(groupedItems);
  };
  const renderCartItem = ({ item }) => (
    <View style={styles.sellerContainer}>
      {item[0] && (
        <>
          <Text style={styles.sellerName}>{item[0].sellerName}</Text>
          {item.map((item) => (
            <View style={styles.productContainer} key={item.id}>
              <View>
                <Checkbox
                  color="#EC6F56"
                  value={isChecked}
                  onValueChange={setIsChecked}
                  style={styles.checkBoxIcon}
                />
              </View>
              <View style={styles.imageContainer}>
                {item.img ? (
                  <Image
                    source={{ uri: item.img }}
                    style={styles.productImage}
                  />
                ) : (
                  <Image
                    source={require("../../assets/img/default-image.jpg")}
                    style={styles.productImage}
                  />
                )}
              </View>
              <View style={styles.productInfoContainer}>
                <View>
                  <Text style={styles.productName}>{item.productName}</Text>
                  {item.requiresPrescription === "Yes" ? (
                    <Text style={styles.productReq}>
                      {" "}
                      [ Requires Prescription ]{" "}
                    </Text>
                  ) : (
                    <Text style={styles.productReq}> </Text>
                  )}
                </View>
                <View style={styles.priceRowContainer}>
                  <View style={styles.quantityButton}>
                    <TouchableOpacity
                      onPress={handleDecrement}
                      style={styles.button}
                    >
                      <Iconify icon="ph:minus-fill" size={22} color="#EC6F56" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={handleIncrement}
                      style={styles.button}
                    >
                      <Iconify icon="ph:plus-fill" size={22} color="#EC6F56" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.productPrice}>
                    {"\u20B1"}
                    {item.price}
                  </Text>
                </View>
              </View>

              <View style={styles.xButtonWrapper}>
                <TouchableOpacity>
                  <Iconify icon="carbon:close-filled" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>MY CART</Text>
        <View style={styles.selectedProductContainer}>
          <View style={styles.itemsContainer}>
            <FlatList
              data={groupCartItemsBySeller(cartItems)}
              scrollEnabled={false}
              keyExtractor={(item) => item[0].sellerId} // Use the seller ID as the key
              renderItem={renderCartItem}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalPmentText}>Total Payment</Text>
          <View style={styles.tpContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pdTotalAmountText}>
                {"\u20B1"}
                12345
                {/* {totalPrice.toFixed(2)}  */}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.ordernowButton}
              onPress={handleToValidateScreen}
            >
              <Text style={styles.ordernowText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShoppingCartScreen;
