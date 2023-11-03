import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Iconify } from "react-native-iconify";
// import ImagePicker from "react-native-image-picker";
// import * as ImagePicker from "react-native-image-picker";
import { storage } from "@react-native-firebase/storage";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";
import { storeProductData } from "../../database/storing/storeData";
import { getAuthToken } from "../../src/authToken";
import { updateById } from "../../database/update/updateDataById";
import { fetchSingleDocumentById } from "../../database/fetchSingleDocById";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";

const ToValidateScreen = ({ navigation, route }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [item, setProductData] = useState(null); // Initialize as null
  const [quantity, setQuantity] = useState(0);
  const [productSubtotal, setProductSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [sellerData, setSellerData] = useState(null);
  const productId = route.params?.productId;
  // const quantity = route.params?.quantity;
  const { cartId } = route.params;
  console.log("CART ID:", cartId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const authToken = await getAuthToken();
        const customerId = authToken.userId; // Get customerId from AsyncStorage
        const userData = await fetchSingleDocumentById(customerId, "customers");
        console.log("user:", userData.id);

        //fetching data from "ProductDetailsScreen"
        if (productId) {
          // Fetch data based on the product ID
          const productData = await fetchSingleDocumentById(
            productId,
            "products"
          );
          setQuantity(route.params?.quantity);
          if (productData && productData.createdBy) {
            const sellerData = await fetchSingleDocumentById(
              productData.createdBy,
              "sellers"
            );
            if (sellerData) {
              setSellerData(sellerData);
            }
          }
          if (userData) {
            setUserData(userData);
          }
          if (productData) {
            setProductData(productData);
          }
          console.log("product id from productscreen:", productData.id);
          //fetching data from "ShoppingCartScreen"
        } else if (cartId && cartId.length > 0) {
          try {
            const fetchedProductData = [];
            let fetchedCartQuantity = 0;
            for (const id of cartId) {
              const cartItem = await fetchSingleDocumentById(id, "cart");
              let productData;
              if (cartItem && cartItem.productId) {
                productData = await fetchSingleDocumentById(
                  cartItem.productId,
                  "products"
                );
                fetchedProductData.push({
                  ...productData,
                  quantity: cartItem.quantity, // Set the quantity based on cart data
                });
              }
            }
            setQuantity(fetchedCartQuantity);
            console.log("quantity: ", fetchedCartQuantity);
            // Fetch seller data for each product
            const fetchedSellerData = [];
            for (const data of fetchedProductData) {
              if (data && data.createdBy) {
                const sellerData = await fetchSingleDocumentById(
                  data.createdBy,
                  "sellers"
                );
                if (sellerData) {
                  fetchedSellerData.push(sellerData);
                }
              }
            }

            if (userData) {
              setUserData(userData);
            }
            if (fetchedProductData) {
              setProductData(fetchedProductData);
            }
            console.log(
              "product id from cartscreen map:",
              fetchedProductData.map((data) => data.id)
            );
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }

        setLoading(false); // Set loading to false after data fetch is complete
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set Loading to false on error
      }
    };

    fetchData();
  }, [cartId, productId]);

  // useEffect(() => {
  //   const unsubscribe = listenForItem("sellers", [], (sellers) => {
  //     if (sellers.length > 0) {
  //       setSellerData(sellers[0]); // ssuming you only need tAhe first seller
  //     }
  //   });
  //   return () => unsubscribe(); // Cleanup the listener on component unmount
  // }, []);
  useEffect(() => {
    // Calculate product subtotal = price multiplied by quantity
    if (item && item.price && quantity) {
      const subtotal = item.price * quantity;
      setProductSubtotal(subtotal);

      // Calculate total price  = subtotal plus temp shipping fee
      const shippingFee = 50.0; // temp SF
      const total = subtotal + shippingFee;
      setTotalPrice(total);
    }
  }, [item, quantity]);

  const handlePlaceOrderScreen = async () => {
    try {
      // Ensure both user data and product data are available
      if (!user || !item) {
        console.error("User data or product data is missing.");
        return;
      }
      const orderCreatedTimestamp = Timestamp.now();

      // Create an order object with the necessary data
      const data = {
        customerId: user.id,
        // customerName: `${user.firstName} ${user.lastName}`,
        deliveryAddress: "NA", //google map api
        phoneNumber: user.phone, //temp for now
        // productId: productId,
        // productName: item.productName,
        // quantity: quantity,
        // price: item.price,
        totalPrice: productSubtotal.toFixed(2),
        sellerId: item.createdBy,
        status: "Pending Validation",
        createdAt: orderCreatedTimestamp,
        sellerFcmToken: sellerData.fcmToken,
        branchName: sellerData.branch,
      };
      // console.log("orederData", orderData);

      const orderId = await storeProductData("orders", data);

      // const price = {
      //   orderId: orderId,
      // };
      // const priceId = await storeProductData("priceList", price);

      const image = {
        orderId: orderId,
      };
      const imgId = await storeProductData("attachmentList", image);
      // const imgUrl = item.img || "Image not available"; // Use a default string if item.img is false

      //details for the products being ordered
      const orderedProductDetails = {
        prescriptionImg: "Image not available",
        orderId: orderId,
        productId: productId,
        // prescription: item.requiresPrescription, image for the prescription
        productName: item.productName,
        quantity: quantity,
        price: productSubtotal,
      };

      const productListId = await storeProductData(
        "productList",
        orderedProductDetails
      );

      // Call the function to update product stock

      console.log("Order placed with ID:", orderId);
      // console.log("Pricelist ID", priceId);
      console.log("AttachmentList ID:", imgId);
      console.log("ProductList ID", productListId);

      // Call the function to update product stock
      await updateById(productId, "products", "stock", item.stock - quantity);

      navigation.navigate("OrderScreen");
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const handleImageSelection = () => {};
  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const renderOrderItems = ({ item }) => {
    return (
      <View key={item.id}>
        <View style={styles.productContainer}>
          <View style={styles.imageContainer}>
            {item.img ? (
              <Image source={{ uri: item.img }} style={styles.productImage} />
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
                <Text style={styles.productReq}>[ Requires Prescription ]</Text>
              ) : (
                <Text style={styles.productReq}></Text>
              )}
            </View>
            <View style={styles.priceRowContainer}>
              <Text style={styles.productPrice}>
                {"\u20B1"}
                {item.price}
              </Text>

              <Text style={styles.productAmount}>
                {"x"}
                {item.quantity ? item.quantity : quantity}
              </Text>
            </View>
          </View>
        </View>
        {item.requiresPrescription === "Yes" && (
          <View style={styles.uploadContainer}>
            <Text style={styles.reminderText}>
              Upload your{"\n"} prescription here*
            </Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleImageSelection}
            >
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.delAddressContainer}>
          <View>
            <Iconify icon="system-uicons:location" size={35} color="black" />
          </View>
          <View style={styles.delInfoContainer}>
            <View style={styles.delArrowContainer}>
              <Text style={styles.deliveryTitle}>Delivery Address</Text>
              <TouchableOpacity>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            {user ? ( // Check if userData is not null
              <React.Fragment>
                <Text style={styles.customerName}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={styles.customerNumber}>{user.phone}</Text>
                {user.address ? (
                  <Text>{user.address}</Text>
                ) : (
                  <Text style={styles.customerAddress}>
                    252- I Ascencion St., Sambag I Cebu City, Cebu, Visayas,
                    6000
                  </Text>
                )}
              </React.Fragment>
            ) : (
              <Text>Loading user data...</Text>
            )}
          </View>
        </View>
        <View style={styles.separator} />
        <FlatList
          data={Array.isArray(item) ? item : [item]}
          scrollEnabled={false}
          keyExtractor={(item) => item.id} // Make sure to replace this with the correct unique key for each item
          renderItem={renderOrderItems}
        />

        <View style={styles.bottomContainer}>
          <View style={styles.separator2} />
          <View style={styles.pmentDetailsContainer}>
            <Text style={styles.pmentDetailsText}>Payment Details :</Text>
            <View style={styles.subtotalContainer}>
              <View style={styles.psSubtotalContainer}>
                <Text style={styles.psSubtotalText}>Product Subtotal </Text>
                <Text style={styles.psSubtotalText}>
                  {"\u20B1"}
                  {productSubtotal.toFixed(2)}{" "}
                  {/* Display the product subtotal */}
                </Text>
              </View>
              <View style={styles.psSubtotalContainer}>
                <Text style={styles.psSubtotalText}>Shipping Subtotal</Text>
                <Text style={styles.psSubtotalText}>₱50.00</Text>
              </View>
              <View style={styles.pdTotalContainer}>
                <Text style={styles.pdTotalText}>Total</Text>
                <Text style={styles.pdTotalAmountText}>
                  {"\u20B1"}
                  {totalPrice.toFixed(2)} {/* Display the total price */}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.totalContainer}>
            <Text style={styles.totalPmentText}>Total Payment</Text>
            <View style={styles.tpContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pdTotalAmountText}>
                  {"\u20B1"}
                  {totalPrice.toFixed(2)} {/* Display the total price */}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ordernowButton}
                onPress={handlePlaceOrderScreen}
              >
                <Text style={styles.ordernowText}>ORDER NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ToValidateScreen;
