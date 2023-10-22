import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
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
import styles from "./stylesheet";

const ToValidateScreen = ({ navigation, route }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [item, setProductData] = useState(null); // Initialize as null
  const [productSubtotal, setProductSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const productId = route.params?.productId;
  const quantity = route.params?.quantity;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const authToken = await getAuthToken();
        const userId = authToken.userId; // Get userId from AsyncStorage
        const userData = await fetchSingleDocumentById(userId, "customers");

        // Fetch product data
        if (productId) {
          const productData = await fetchSingleDocumentById(
            productId,
            "products"
          );
          // console.log("product Data kay:", productData);
          // Set loading to false once both user and product data are fetched
          setLoading(false);

          if (userData) {
            setUserData(userData);
          }
          if (productData) {
            setProductData(productData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Ensure loading is set to false on error
      }
    };

    fetchData();
  }, []);

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
        customerName: `${user.firstName} ${user.lastName}`,
        deliveryAddress: "NA", //google map api
        phoneNumber: user.phone, //temp for now
        productId: productId,
        productName: item.productName,
        quantity: quantity,
        totalPrice: productSubtotal.toFixed(2),
        sellerId: item.createdBy,
        status: "Pending Validation",
        createdAt: orderCreatedTimestamp,
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
      const imgUrl = item.img || "Image not available"; // Use a default string if item.img is falsy
      const totalPrice = {
        img: imgUrl,
        orderId: orderId,
        prescription: item.requiresPrescription,
        productName: item.productName,
        quantity: quantity,
        price: productSubtotal,
      };

      const productListId = await storeProductData("productList", totalPrice);

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
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
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
          {item ? ( // Check if item is not null
            <React.Fragment>
              <View style={styles.productContainer}>
                <View style={styles.imageContainer}>
                  {item.img ? (
                    <Image
                      source={{ uri: item.img }}
                      style={styles.productImage}
                      // style={[
                      //   styles.image,
                      //   { width: deviceWidth, height: (deviceWidth * 2) / 3 },
                      // ]}
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
                    <Text style={styles.productReq}>
                      {" "}
                      {item.requiresPrescription == "Yes" ? (
                        <Text style={styles.productReq}>
                          {" "}
                          [ Requires Prescription ]{" "}
                        </Text>
                      ) : (
                        <Text style={styles.productReq}> </Text>
                      )}
                    </Text>
                  </View>
                  <View style={styles.priceRowContainer}>
                    <Text style={styles.productPrice}>
                      {"\u20B1"}
                      {item.price}
                    </Text>

                    <Text style={styles.productAmount}>
                      {"x"}
                      {route.params?.quantity}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.uploadContainer}>
                {item.requiresPrescription === "Yes" ? ( // Use a ternary operator here
                  <React.Fragment>
                    <Text style={styles.reminderText}>
                      Upload your{"\n"} prescription here*
                    </Text>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleImageSelection}
                    >
                      <Text style={styles.uploadButtonText}>Choose File</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ) : null}
              </View>
            </React.Fragment>
          ) : (
            <Text>Loading user data...</Text>
          )}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToValidateScreen;
