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
import {
  getStorage,
  ref,
  uploadBytes,
  uploadFile,
  getDownloadURL,
} from "@firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";
import { storeProductData } from "../../database/storing/storeData";
import { getAuthToken } from "../../src/authToken";
import { updateById } from "../../database/update/updateDataById";
import { fetchSingleDocumentById } from "../../database/fetchSingleDocById";
import { listenForItem } from "../../database/component/realTimeListenerByCondition";
import styles from "./stylesheet";
import * as ImagePicker from "expo-image-picker";

const ToValidateScreen = ({ navigation, route }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const [itemSelectedImages, setItemSelectedImages] = useState([]);
  const [itemSelectedImageNames, setItemSelectedImageNames] = useState([]);
  const [item, setProductData] = useState(null); // Initialize as null
  const [quantity, setQuantity] = useState(0);
  const [productSubtotal, setProductSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [sellerData, setSellerData] = useState(null);
  const [prescription, setPrescriptionRequired] = useState();
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
                  quantity: cartItem.quantity,
                });
              }
            }
            // setQuantity(quantity);
            // console.log("quantity: ", fetchedCartQuantity);
            // Fetch seller data for each product
            const sellerId = fetchedProductData[0]?.createdBy;
            if (sellerId) {
              const seller = await fetchSingleDocumentById(sellerId, "sellers");
              setSellerData(seller);
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
        if (item) {
          let requiresPrescription = false;
          if (Array.isArray(item)) {
            for (const product of item) {
              if (product && product.requiresPrescription === "Yes") {
                requiresPrescription = true;
                break;
              }
            }
          } else if (item.requiresPrescription === "Yes") {
            requiresPrescription = true;
          }

          if (requiresPrescription) {
            // Set up your state or perform necessary actions if the item requires a prescription
            // For example:
            // setPrescriptionRequired(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set Loading to false on error
      } finally {
        setLoading(false);
      }
    };
    console.log("selecta:", itemSelectedImageNames);
    console.log("selecta c:", itemSelectedImages);

    fetchData();
  }, [cartId, productId]);

  useEffect(() => {
    // Calculate product subtotal = price multiplied by quantity
    if (item) {
      let subtotal = 0;
      if (Array.isArray(item)) {
        for (const product of item) {
          console.log("item price", product.price);
          const currentQuantity = cartId ? product.quantity : quantity;
          subtotal += product.price * currentQuantity;
          console.log("cart quantity", product.quantity);
        }
      } else if (item.price && quantity !== undefined) {
        const currentQuantity = item.quantity ? item.quantity : quantity;
        subtotal += item.price * currentQuantity;
        console.log("product screen quantity", currentQuantity);
      }

      setProductSubtotal(subtotal);
      const shippingFee = 50.0; // temp SF
      const total = subtotal + shippingFee;
      setTotalPrice(total);
    }
  }, [item, cartId, quantity]);

  //handle place order for products checked out from productDetailsScreen
  const handlePlaceOrderScreen = async () => {
    try {
      // Ensure both user data and product data are available
      if (!user || !item || !sellerData) {
        console.error("User data, product data, or seller data is missing.");
        return;
      }
      const orderCreatedTimestamp = Timestamp.now();
      let totalQuantity = 0;
      if (Array.isArray(item)) {
        for (const product of item) {
          totalQuantity += product.quantity;
        }
      } else if (quantity) {
        totalQuantity = quantity;
      }
      console.log("item quantity", totalQuantity);
      //"orders" collection
      const data = {
        customerId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        deliveryAddress: "NA", //google map api
        customerPhoneNumber: user.phone, //temp for now
        totalPrice: totalPrice.toFixed(2),
        sellerId: sellerData.id,
        status: "Pending Validation",
        createdAt: orderCreatedTimestamp,
        sellerFcmToken: sellerData.fcmToken,
        branchName: sellerData.branch,
        totalQuantity: totalQuantity,
        paymentMethod: null,
        orderSubTotalPrice: productSubtotal.toFixed(2),
      };
      const orderId = await storeProductData("orders", data);

      //"attachmentList" collection
      for (const image of itemSelectedImages) {
        try {
          const downloadUrl = await uploadImageAsync(image.uri);
          console.log("Download URL:", downloadUrl);
          // Store the image URLs in the attachmentList collection
          const attachmentData = {
            orderId: orderId,
            img: downloadUrl,
          };
          const attachmentId = await storeProductData(
            "attachmentList",
            attachmentData
          );
          console.log("AttachmentList ID:", attachmentId);
        } catch (error) {
          console.error("Error uploading image:", error);
          console.log("itemselected", itemSelectedImages);
        }
      }
      //will be rendered if the item came from the "ShoppingCartScreen.js"
      if (Array.isArray(item)) {
        for (const product of item) {
          // Ensure that each product has a valid productId
          if (!product.productId) {
            console.error("Product ID is missing or invalid.");
            continue;
          }

          const subtotal = product.quantity * product.price;
          // "productList" collection
          const orderedProductDetails = {
            orderId: orderId,
            productId: product.productId,
            prescription: product.requiresPrescription,
            productName: product.productName,
            quantity: product.quantity,
            price: product.price,
            productImg: product.img,
            requiresPrescription: product.requiresPrescription,
            productSubTotalPrice: subtotal.toFixed(2),
          };

          const productListId = await storeProductData(
            "productList",
            orderedProductDetails
          );

          console.log("Order placed with ID:", orderId);
          console.log("ProductList ID", productListId);
          //updating the stock on the "products" collection
          await updateById(
            product.productId,
            "products",
            "stock",
            product.stock - product.quantity
          );
        }
      }
      //will be rendered if the item came from the "ProductDetailsScreen.js"
      else {
        // "productList" collection
        const subtotal = item.quantity * item.price;
        const orderDetails = {
          orderId: orderId,
          productId: item.productId,
          prescription: item.requiresPrescription,
          productName: item.productName,
          quantity: quantity,
          price: item.price,
          productImg: item.img,
          requiresPrescription: item.requiresPrescription,
          prescriptionImg: "Image not available",
          productSubTotalPrice: subtotal.toFixed(2),
        };

        const productListId = await storeProductData(
          "productList",
          orderDetails
        );

        //updating the stock on the "products" collection
        await updateById(productId, "products", "stock", item.stock - quantity);

        console.log("Order placed with ID:", orderId);
        console.log("ProductList ID", productListId);
      }

      navigation.navigate("OrderScreen");
    } catch (error) {
      console.error("Error placing the order:", error);
    }
  };

  const uploadImageAsync = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const parts = uri.split("/");
      const name = parts[parts.length - 1];

      const storage = getStorage(); // Get the Firebase storage instance
      const storageRef = ref(storage, `images/${name}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      console.log("Download URL:", url);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleItemSelection = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      // aspect: [4, 3],
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Enable image editing
    });

    if (!results.canceled) {
      const selectedAssets = results.assets;
      const newSelectedImages = [
        ...itemSelectedImages,
        ...selectedAssets.map((asset) => ({ uri: asset.uri })),
      ];
      setItemSelectedImages(newSelectedImages);

      const newSelectedImageNames = selectedAssets.map((asset) =>
        asset.uri.split("/").pop()
      );
      const updatedImageNames = [
        ...itemSelectedImageNames,
        ...newSelectedImageNames,
      ];
      setItemSelectedImageNames(updatedImageNames);

      console.log("Selected Images:", newSelectedImages);
      console.log("Selected Image Names:", updatedImageNames);
    }
  };
  const removePrescImage = async (imageUri, imageName) => {
    try {
      // Filter out the selected image and its name from the state
      const updatedImages = itemSelectedImages.filter(
        (image) => image.uri !== imageUri
      );
      setItemSelectedImages(updatedImages);

      const updatedImageNames = itemSelectedImageNames.filter(
        (name) => name !== imageName
      );
      setItemSelectedImageNames(updatedImageNames);

      console.log("Image removed successfully.");
    } catch (error) {
      console.error("Error removing the image:", error);
    }
  };

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
        <View>
          <FlatList
            data={Array.isArray(item) ? item : [item]}
            scrollEnabled={false}
            keyExtractor={(item) => item.id} // Make sure to replace this with the correct unique key for each item
            renderItem={renderOrderItems}
          />
        </View>

        <View style={styles.bottomContainer}>
          {item && (
            <>
              <View style={styles.uploadPresCont}>
                {item.some(
                  (product) => product.requiresPrescription === "Yes"
                ) && (
                  <>
                    <Text style={styles.reminderText}>
                      Upload your prescription/s here *
                    </Text>
                    <View style={styles.uploadContainer}>
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleItemSelection}
                      >
                        <Iconify
                          icon="zondicons:add-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.uploadButtonText}>
                          {" "}
                          Choose Image
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <View style={styles.prescriptionImageCont}>
                  {itemSelectedImages.map((image, index) => {
                    if (image.uri) {
                      return (
                        <View key={index} style={styles.imageAndNameContainer}>
                          <View style={styles.xButtonWrapper}>
                            <TouchableOpacity
                              onPress={() =>
                                removePrescImage(
                                  itemSelectedImages[index].uri,
                                  itemSelectedImageNames[index]
                                )
                              }
                            >
                              <Iconify
                                icon="clarity:remove-solid"
                                size={25}
                                color="#FF6666"
                              />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.selectedImageCont}>
                            <Image
                              source={{ uri: itemSelectedImages[index].uri }}
                              style={styles.selectedImage}
                              onError={() => console.log("Error loading image")}
                            />
                          </View>
                          <Text
                            numberOfLines={1}
                            style={styles.selectedImageName}
                          >
                            {itemSelectedImageNames[index]}
                          </Text>
                        </View>
                      );
                    } else {
                      // Handle the case when the 'uri' property is not present
                      return (
                        <View key={index}>
                          <Text style={styles.errorMessage}>
                            Image URI not found
                          </Text>
                        </View>
                      );
                    }
                  })}
                </View>
              </View>
              <View style={styles.separator3} />
            </>
          )}

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
