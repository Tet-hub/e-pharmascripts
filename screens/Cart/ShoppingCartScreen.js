import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { Iconify } from "react-native-iconify";
import { Checkbox } from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { getAuthToken } from "../../src/authToken";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import axios from "axios";
import { BASE_URL } from "../../src/api/apiURL";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const ShoppingCartScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;
        if (!customerId) {
          console.log("User ID is undefined or null.");
          return;
        }

        const cartConditions = [
          { fieldName: "customerId", operator: "==", value: customerId },
        ];
        listenForItem("cart", cartConditions, (updatedCartItems) => {
          const promises = updatedCartItems.map(async (cartItem) => {
            const productDocumentId = cartItem.productId;
            const productDocumentRef = doc(db, "products", productDocumentId);
            const productSnapshot = await getDoc(productDocumentRef);
            if (productSnapshot.exists()) {
              const productData = productSnapshot.data();
              const sellerId = productData.createdBy;
              const sellerDocumentRef = doc(db, "sellers", sellerId);
              const sellerSnapshot = await getDoc(sellerDocumentRef);
              if (sellerSnapshot.exists()) {
                const sellerInfo = sellerSnapshot.data();
                return { ...cartItem, productData, sellerInfo };
              }
            }
            return null;
          });

          Promise.all(promises).then((cartItemsWithProductDetails) => {
            const filteredCartItems = cartItemsWithProductDetails.filter(
              (item) => item !== null
            );
            setCartItems(filteredCartItems);
          });
        });
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleIncrement = async (cartItemId) => {
    const updatedCartItems = cartItems.map(async (cartItem) => {
      if (cartItem.id === cartItemId) {
        if (cartItem.quantity < cartItem.productData.stock) {
          const newQuantity = cartItem.quantity + 1;
          // Update the quantity field in the cart collection
          await updateDoc(doc(db, "cart", cartItem.id), {
            quantity: newQuantity,
          });
          return {
            ...cartItem,
            quantity: newQuantity,
          };
        }
      }
      return cartItem;
    });

    Promise.all(updatedCartItems).then((updatedItems) => {
      setCartItems(updatedItems);
    });
  };

  const handleDecrement = async (cartItemId) => {
    const updatedCartItems = cartItems.map(async (cartItem) => {
      if (cartItem.id === cartItemId) {
        if (cartItem.quantity > 1) {
          const newQuantity = cartItem.quantity - 1;
          // Update the quantity field in the cart collection
          await updateDoc(doc(db, "cart", cartItem.id), {
            quantity: newQuantity,
          });
          return {
            ...cartItem,
            quantity: newQuantity,
          };
        }
      }
      return cartItem;
    });

    Promise.all(updatedCartItems).then((updatedItems) => {
      setCartItems(updatedItems);
    });
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [cartItemId]: !prevSelectedItems[cartItemId],
    }));
  };
  const removeCartItem = async (cartItemId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/mobile/delete/remove/doc/by/cart/${cartItemId}`
      );
      console.log(response.data); // Log the response data

      // Remove the item from the local cartItems state to reflect the change in the UI
      const updatedCartItems = cartItems.filter(
        (item) => item.id !== cartItemId
      );
      setCartItems(updatedCartItems);
      toast.show("Item removed successfully!", {
        type: "normal ",
        placement: "bottom",
        duration: 3000,
        offset: 10,
        animationType: "slide-in",
      });
    } catch (error) {
      console.error("Error removing item from the database:", error);
    }
  };
  const handleToValidateScreen = () => {
    const selectedSellerId = new Set();
    let selectedCartIds = [];
    for (const cartItemId in selectedItems) {
      if (selectedItems[cartItemId]) {
        const cartItem = cartItems.find((item) => item.id === cartItemId);
        if (cartItem) {
          selectedSellerId.add(cartItem.sellerInfo.sellerId);
          selectedCartIds.push(cartItem.id);
        }
      }
    }
    console.log("cart id:", selectedCartIds);
    if (selectedSellerId.size === 1 && selectedCartIds.length > 0) {
      // Proceed to the checkout screen
      navigation.navigate("ToValidateScreen", { cartId: selectedCartIds });
    } else {
      toast.show("Please select items from the same seller to proceed!", {
        type: "normal",
        placement: "bottom",
        duration: 3000,
        offset: 10,
        animationType: "slide-in",
      });
    }
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
                  <TouchableOpacity onPress={() => removeCartItem(cartItem.id)}>
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : cartItems.length === 0 ? (
          <View style={styles.noOrdersCont}>
            <View style={styles.noOrders}>
              <Iconify
                icon="tabler:shopping-cart-x"
                size={50}
                color="black"
                style={styles.noOrdersIcon}
              />
              <Text>No Cart Items Yet</Text>
            </View>
          </View>
        ) : (
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
        )}
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
