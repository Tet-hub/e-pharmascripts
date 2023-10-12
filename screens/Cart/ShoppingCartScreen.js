import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { Checkbox } from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { getAuthToken } from "../../src/authToken";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";
import { BASE_URL } from "../../src/api/apiURL";

const ShoppingCartScreen = () => {
  const navigation = useNavigation();

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId;
        if (!userId) {
          console.log("User ID is undefined or null.");
          return;
        }

        const cartConditions = [
          { fieldName: "userId", operator: "==", value: userId },
        ];
        const cartApiUrl = buildQueryUrl("cart", cartConditions);
        const cartResponse = await fetch(cartApiUrl, {
          method: "GET",
        });

        if (!cartResponse.ok) {
          console.log("API request failed with status:", cartResponse.status);
          return;
        }

        const cartItemsData = await cartResponse.json();

        const unsubscribe = listenForItem(
          "cart",
          cartConditions,
          (updatedCartItems) => {
            setCartItems(updatedCartItems);
          }
        );

        const productSellerPromises = cartItemsData.map(async (cartItem) => {
          const productDocumentId = cartItem.productId;
          const productApiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/products/${productDocumentId}`;
          const productResponse = await fetch(productApiUrl, {
            method: "GET",
          });

          if (!productResponse.ok) {
            console.log(
              "API request failed with status product:",
              productResponse.status
            );
            return null;
          }

          const productData = await productResponse.json();
          const sellerId = productData.createdBy;

          const sellerInfo = await fetchSellerData(sellerId);

          return { ...cartItem, productData, sellerInfo };
        });

        const cartItemsWithProductDetails = await Promise.all(
          productSellerPromises
        );
        setCartItems(cartItemsWithProductDetails);

        return () => unsubscribe();
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    const fetchSellerData = async (sellerId) => {
      try {
        const sellerApiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/sellers/${sellerId}`;
        const sellerResponse = await fetch(sellerApiUrl, {
          method: "GET",
        });

        if (!sellerResponse.ok) {
          console.log(
            "API request failed with status seller:",
            sellerResponse.status
          );
          return null;
        }

        const sellerInfo = await sellerResponse.json();

        return sellerInfo;
      } catch (error) {
        console.log("Error fetching seller data:", error);
        return null;
      }
    };

    fetchCartItems();
  }, []);

  const handleIncrement = (cartItemId) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === cartItemId) {
        if (cartItem.quantity < cartItem.productData.stock) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        }
      }
      return cartItem;
    });

    setCartItems(updatedCartItems);
  };

  const handleDecrement = (cartItemId) => {
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem.id === cartItemId) {
        if (cartItem.quantity > 1) {
          return {
            ...cartItem,
            quantity: cartItem.quantity - 1,
          };
        }
      }
      return cartItem;
    });

    setCartItems(updatedCartItems);
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [cartItemId]: !prevSelectedItems[cartItemId],
    }));
  };

  const handleToValidateScreen = () => {
    navigation.navigate("ToValidateScreen");
  };

  const groupCartItemsBySeller = (cartItems) => {
    const groupedItems = {};

    cartItems.forEach((item) => {
      if (item.sellerInfo && item.sellerInfo.sellerId) {
        const sellerId = item.sellerInfo.sellerId;
        if (!groupedItems[sellerId]) {
          groupedItems[sellerId] = [];
        }
        groupedItems[sellerId].push(item);
      }
    });

    return Object.values(groupedItems);
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((cartItem) => {
      if (
        selectedItems[cartItem.id] &&
        cartItem.productData &&
        cartItem.productData.price
      ) {
        totalPrice += cartItem.quantity * cartItem.productData.price;
      }
    });
    return totalPrice.toFixed(2);
  };

  const renderCartItem = ({ item }) => {
    if (!item || !item[0] || !item[0].sellerInfo) {
      return (
        <View>
          <Text>Item information is missing or unavailable.</Text>
        </View>
      );
    }
    return (
      <View style={styles.sellerContainer}>
        {item[0] && item[0].sellerInfo ? (
          <>
            <Text style={styles.sellerName}>{item[0].sellerInfo.branch}</Text>
            {item.map((cartItem) => (
              <View style={styles.productContainer} key={cartItem.id}>
                <Checkbox
                  color="#EC6F56"
                  value={selectedItems[cartItem.id] || false}
                  onValueChange={() => handleSelectItem(cartItem.id)}
                  style={styles.checkBoxIcon}
                />
                <View style={styles.imageContainer}>
                  {cartItem.productData.img ? (
                    <Image
                      source={{ uri: cartItem.productData.img }}
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
                    <Text style={styles.productName}>
                      {cartItem.productData.productName}
                    </Text>
                    {cartItem.productData.requiresPrescription === "Yes" ? (
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
                        onPress={() => handleDecrement(cartItem.id)}
                        style={styles.button}
                      >
                        <Iconify
                          icon="ph:minus-fill"
                          size={22}
                          color="#EC6F56"
                        />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {cartItem.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleIncrement(cartItem.id)}
                        style={styles.button}
                      >
                        <Iconify
                          icon="ph:plus-fill"
                          size={22}
                          color="#EC6F56"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.productPrice}>
                      {"\u20B1"}
                      {cartItem.productData.price}
                    </Text>
                  </View>
                </View>
                <View style={styles.xButtonWrapper}>
                  <TouchableOpacity>
                    <Iconify
                      icon="carbon:close-filled"
                      size={22}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text>Item is missing sellerInfo: {JSON.stringify(item)}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.screenTitle}>MY CART</Text>
      </View>
      <View style={styles.bodyWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.selectedProductContainer}>
            <View style={styles.cartContainer}>
              <FlatList
                data={groupCartItemsBySeller(cartItems)}
                scrollEnabled={false}
                keyExtractor={(item) =>
                  `${item[0].sellerInfo.sellerId}-${item[0].id}`
                }
                renderItem={renderCartItem}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View>
        <View style={styles.footer}>
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPmentText}>Total Payment</Text>
            <View style={styles.tpContainer}>
              <Text style={styles.pdTotalAmountText}>
                {"\u20B1"}
                {calculateTotalPrice()}
              </Text>
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
    </View>
  );
};

export default ShoppingCartScreen;
