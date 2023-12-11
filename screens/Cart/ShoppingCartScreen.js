import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  Alert,
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
  const [customer, setCustomer] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchCartItems(); // Fetch cart items when the component mounts
  }, []);
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const authToken = await getAuthToken();
      const customerId = authToken.userId;
      if (customerId) {
        const customerDocRef = doc(db, "customers", customerId);
        const customerDocSnap = await getDoc(customerDocRef);

        if (customerDocSnap.exists()) {
          const customerData = customerDocSnap.data();
          setCustomer(customerData);
          console.log("Customer document found for customerId:", customerData);
        } else {
          console.log(
            "Customer document not found for customerId:",
            customerId
          );
        }
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
            const sellerId = productData.sellerId;
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
          setLoading(false);
        });
      });
    } catch (error) {
      console.log("Error fetching products:", error);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchCartItems();
    } catch (error) {
      console.log("Error while refreshing:", error);
    } finally {
      setRefreshing(false);
    }
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
  const handleSelectItem = (cartItemId, isSellerCheckbox) => {
    if (isSellerCheckbox) {
      const selectedSellerId = cartItems.find((item) => item.id === cartItemId)
        .sellerInfo.sellerId;
      const updatedSelectedItems = { ...selectedItems };
      cartItems.forEach((item) => {
        if (item.sellerInfo.sellerId === selectedSellerId) {
          updatedSelectedItems[item.id] = !selectedItems[cartItemId];
        }
      });
      setSelectedItems(updatedSelectedItems);
    } else {
      setSelectedItems((prevSelectedItems) => ({
        ...prevSelectedItems,
        [cartItemId]: !prevSelectedItems[cartItemId],
      }));
    }
  };

  // const handleSelectItem = (cartItemId) => {
  //   setSelectedItems((prevSelectedItems) => ({
  //     ...prevSelectedItems,
  //     [cartItemId]: !prevSelectedItems[cartItemId],
  //   }));
  // };
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
      ToastAndroid.show("Item removed successfully!", ToastAndroid.SHORT);
      // toast.show("Item removed successfully!", {
      //   type: "normal ",
      //   placement: "bottom",
      //   duration: 3000,
      //   offset: 10,
      //   animationType: "slide-in",
      // });
    } catch (error) {
      console.log("Error removing item from the database:", error);
    }
  };
  const handleToValidateCartScreen = () => {
    const selectedCartIds = [];
    for (const cartItemId in selectedItems) {
      if (selectedItems[cartItemId]) {
        selectedCartIds.push(cartItemId);
      }
    }

    if (selectedCartIds.length === 0) {
      ToastAndroid.show(
        "Please select items to check out!",
        ToastAndroid.SHORT
      );
    } else {
      navigation.navigate("ToValidateCartScreen", { cartId: selectedCartIds });
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
            <View style={styles.sellerNameContainer}>
              <Checkbox
                color="#EC6F56"
                value={selectedItems[item[0].id] || false}
                onValueChange={() => handleSelectItem(item[0].id, true)}
                style={styles.checkBoxIcon}
              />
              <View style={styles.verticalSeparator} />
              <Text style={styles.sellerName}>{item[0].sellerInfo.branch}</Text>
            </View>
            <View style={styles.separator} />

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
                      source={require("../../assets/img/def-image.jpg")}
                      style={styles.productImage}
                    />
                  )}
                </View>
                <View style={styles.productInfoContainer}>
                  <View>
                    <Text
                      style={styles.productName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
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
                      size={23}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bodyWrapper}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EC6F56" />
            </View>
          ) : cartItems.length !== 0 ? (
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
          ) : (
            <View style={styles.noOrdersCont}>
              <View style={styles.noOrders}>
                <Iconify
                  icon="tabler:shopping-cart-x"
                  size={45}
                  color="black"
                  style={styles.noOrdersIcon}
                />
                <Text style={styles.noOrdersText}>No cart items yet</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View>
        <View style={styles.footer}>
          <View style={styles.checkoutContainer}>
            <Text style={styles.totalPmentText}>Total Payment</Text>
            <View style={styles.tpContainer}>
              <Text style={styles.pdTotalAmountText}>
                {"\u20B1"}
                {calculateTotalPrice()}
              </Text>
              {customer.status !== "Verified" ? (
                <>
                  <TouchableOpacity
                    style={styles.disabledbuynowView}
                    onPress={() => {
                      Alert.alert(
                        "Verify Account",
                        "Please verify your account first.",
                        [
                          {
                            text: "OK",
                            onPress: () => console.log("OK Pressed"),
                          },
                        ]
                      );
                    }}
                  >
                    <Iconify icon="ooui:cancel" size={23} color="#DC3642" />
                    <Text style={styles.disabledBuynowText}>CHECKOUT</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.ordernowButton}
                  onPress={handleToValidateCartScreen}
                >
                  <Text style={styles.ordernowText}>CHECKOUT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShoppingCartScreen;
