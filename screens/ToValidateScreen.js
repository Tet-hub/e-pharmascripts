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
import { storeProductData } from "../database/storing/storeData";
import { getAuthToken } from "../src/api/authToken";
import { updateById } from "../database/update/updateDataById";
import { fetchSingleDocumentById } from "../database/fetchSingleDocById";

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
        const userData = await fetchSingleDocumentById(userId, "users");

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
        userId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        deliveryAddress: "NA", //google map api
        phoneNumber: user.phone, //temp for now
        productId: productId,
        productName: item.productName,
        quantity: quantity,
        totalPrice: productSubtotal.toFixed(2),
        sellerId: item.createdBy,
        Status: "Not Validated",
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
        <View style={[styles.container]}>
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
                      source={require("../assets/img/default-image.jpg")}
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

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1, // This allows the ScrollView to grow to fill the screen
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  delAddressContainer: {
    width: "80%",
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
  },
  delInfoContainer: {
    marginLeft: 15,
    width: "85%",
  },
  deliveryTitle: {
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 10,
  },
  customerName: {
    fontWeight: 300,
    fontSize: 13,
  },
  customerNumber: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
  },
  customerAddress: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  separator2: {
    marginTop: 60,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "80%",
    height: 120,
    alignSelf: "center",
  },
  imageContainer: {
    flex: 1,
    width: "40%",
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
  },
  productImage: {
    height: 120,
    width: "100%",
    marginLeft: -15,
    flex: 1,
    resizeMode: "contain",
  },
  productInfoContainer: {
    flex: 1,
  },
  priceRowContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: 600,
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 500,
  },
  productAmount: {
    fontSize: 14,
    fontWeight: 300,
  },
  pmentDetailsContainer: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  pmentDetailsText: {
    fontWeight: 500,
    fontSize: 14,
  },
  subtotalContainer: {
    width: "80%",
    marginLeft: 50,
    marginTop: 10,
  },
  psSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  pdTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  pdTotalText: {
    fontWeight: 600,
    fontSize: 15,
  },
  pdTotalAmountText: {
    fontWeight: 600,
    fontSize: 15,
  },
  psSubtotalText: {
    fontSize: 15,
    fontWeight: 300,
  },
  totalContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  totalPmentText: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 20,
  },
  totalAmountText: {
    fontWeight: 700,
    color: "#EC6F56",
    fontSize: 12,
    marginRight: 11,
  },
  delArrowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  ordernowText: {
    fontWeight: 600,
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  ordernowButton: {
    backgroundColor: "#DC3642",
    padding: 15,
    borderRadius: 30,
    width: "60%",
  },
  bottomContainer: {
    justifyContent: "flex-end",
  },
  reminderText: {
    fontSize: 10,
    fontWeight: 200,
    fontStyle: "italic",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: "70%",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  uploadText: {
    fontSize: 14,
    fontWeight: 400,
  },
  uploadButton: {
    backgroundColor: "#EC6F56",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});
