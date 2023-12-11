import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Iconify } from "react-native-iconify";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "@firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { ScrollView } from "react-native-gesture-handler";
import { Timestamp } from "firebase/firestore";
import { storeProductData } from "../../database/storing/storeData";
import { getAuthToken } from "../../src/authToken";
import { updateById } from "../../database/update/updateDataById";
import { fetchSingleDocumentById } from "../../database/fetchSingleDocById";
import styles from "./stylesheet";
import * as ImagePicker from "expo-image-picker";
import renderOrderItems from "./orderItem";
const ToValidateScreen = ({ navigation, route }) => {
  const toast = useToast();
  const [itemSelectedImages, setItemSelectedImages] = useState([]);
  const [itemSelectedImageNames, setItemSelectedImageNames] = useState([]);
  const [item, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [productSubtotal, setProductSubtotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUserData] = useState(null);
  const [shippingFeeData, setShippingFeeData] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const productId = route.params?.productId;
  // const quantity = route.params?.quantity;
  const { cartId } = route.params;
  console.log("CART ID:", cartId);
  // console.log("productData:", item);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const authToken = await getAuthToken();
        const customerId = authToken.userId; // Get customerId from AsyncStorage
        const userData = await fetchSingleDocumentById(customerId, "customers");
        console.log("users:", userData.id);
        const shippingFee = await fetchSingleDocumentById(
          "orderSf",
          "shippingFee"
        );
        if (shippingFee) {
          setShippingFeeData(shippingFee);
          setDeliveryFee(shippingFee.shippingFee);
        } else {
          setDeliveryFee("50.00");
        }
        console.log("sf:", shippingFee);
        console.log("delivery fee", deliveryFee);

        //fetching data from "ProductDetailsScreen"
        if (productId) {
          // Fetch data based on the product ID
          const productData = await fetchSingleDocumentById(
            productId,
            "products"
          );
          setQuantity(route.params?.quantity);
          if (productData && productData.sellerId) {
            const sellerData = await fetchSingleDocumentById(
              productData.sellerId,
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
            const sellerIds = fetchedProductData.map(
              (product) => product.sellerId
            );
            const uniqueSellerIds = [...new Set(sellerIds)]; // Get unique seller IDs

            const sellerDataArray = [];

            for (const sellerId of uniqueSellerIds) {
              const seller = await fetchSingleDocumentById(sellerId, "sellers");
              sellerDataArray.push(seller);
            }

            // Assuming you want to set the seller data array for each seller in state
            setSellerData(sellerDataArray);

            console.log("sellerdatas", sellerDataArray);
            console.log("productData", fetchedProductData);

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
            console.log("Error fetching data:", error);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setLoading(false); // Set Loading to false on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cartId, productId]);

  useEffect(() => {
    // Calculate product subtotal = price multiplied by quantity
    if (item) {
      let subtotal = 0;
      if (Array.isArray(item)) {
        for (const product of item) {
          const currentQuantity = cartId ? product.quantity : quantity;
          subtotal += product.price * currentQuantity;
        }
      } else if (item.price && quantity !== undefined) {
        const currentQuantity = item.quantity ? item.quantity : quantity;
        subtotal = item.price * currentQuantity;
      }

      setProductSubtotal(subtotal);
      const shippingFee = Number(deliveryFee);
      const total = subtotal + shippingFee;
      setTotalPrice(total);
    }
  }, [item, cartId, quantity]);

  const handlePlaceOrderScreen = async () => {
    const attachmentsBySeller = {};

    for (const image of itemSelectedImages) {
      const { sellerId } = image;
      if (!attachmentsBySeller[sellerId]) {
        attachmentsBySeller[sellerId] = [];
      }
      attachmentsBySeller[sellerId].push(image);
    }
    for (const sellerGroup of Object.values(groupedProducts)) {
      const { products, sellerId } = sellerGroup;
      let requiresPrescription = false;

      // Check if any product from this seller requires a prescription
      for (const product of products) {
        if (product.requiresPrescription === "Yes") {
          requiresPrescription = true;
          break;
        }
      }

      if (requiresPrescription) {
        // Check if any image has been added for each seller
        const sellerImages = itemSelectedImages.filter(
          (image) => image.sellerId === sellerId
        );
        //display toast message
        if (sellerImages.length === 0) {
          const sellerName =
            sellerData.find((seller) => seller.id === sellerId)?.branch ||
            "Seller";
          toast.show(`Please add your prescription image/s for ${sellerName}`, {
            type: "normal",
            placement: "bottom",
            duration: 3000,
            offset: 10,
            animationType: "slide-in",
          });
          return;
        }
      }
    }
    Alert.alert(
      "Confirm Order",
      "Before placing this order, ensure that your mobile phone and delivery address are correctly set.\n\nWould you like to proceed with placing this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Place Order",
          onPress: async () => {
            setBtnLoading(true);
            try {
              for (const sellerGroup of Object.values(groupedProducts)) {
                const { products, sellerId } = sellerGroup;

                if (!user || !products || !sellerData) {
                  console.log(
                    "User data, product data, or seller data is missing."
                  );
                  continue;
                }
                let requiresPrescription = false;
                for (const product of products) {
                  if (product.requiresPrescription === "Yes") {
                    requiresPrescription = true;
                    break;
                  }
                }

                if (requiresPrescription && itemSelectedImages.length === 0) {
                  toast.show(`Please add your prescription image first`, {
                    type: "normal",
                    placement: "bottom",
                    duration: 3000,
                    offset: 10,
                    animationType: "slide-in",
                  });
                  return;
                }

                if (sellerId) {
                  const seller = await fetchSingleDocumentById(
                    sellerId,
                    "sellers"
                  );
                  if (!seller) {
                    console.log("Seller data is missing.");
                    continue;
                  }
                  const sellerBranchName = seller.branch;

                  for (const product of products) {
                    if (product.stock < product.quantity) {
                      toast.show(
                        `Insufficient stock for ${product.productName}`,
                        {
                          type: "normal",
                          placement: "bottom",
                          duration: 3000,
                          offset: 10,
                          animationType: "slide-in",
                        }
                      );
                      return;
                    }
                  }

                  const orderCreatedTimestamp = Timestamp.now();

                  let sellerProductTotal = 0;
                  products.forEach((product) => {
                    sellerProductTotal += product.price * product.quantity;
                  });
                  let totalQuantity = 0;
                  products.forEach((product) => {
                    totalQuantity += product.quantity;
                  });
                  const sellerDeliveryFee = Number(deliveryFee);

                  const orderSubTotalPrice = sellerProductTotal;
                  const totalPriceForSeller =
                    orderSubTotalPrice + sellerDeliveryFee;

                  const data = {
                    customerId: user.id,
                    customerName: `${user.firstName} ${user.lastName}`,
                    deliveryAddress: user.address,
                    customerPhoneNumber: user.phone,
                    totalPrice: totalPrice.toFixed(2),
                    sellerId: sellerId,
                    status: "Pending Validation",
                    createdAt: orderCreatedTimestamp,
                    branchName: sellerBranchName,
                    paymentMethod: null,
                    totalQuantity: totalQuantity,
                    totalPrice: totalPriceForSeller.toFixed(2),
                    orderSubTotalPrice: orderSubTotalPrice.toFixed(2),
                    deliveryFee: deliveryFee,
                  };
                  const orderId = await storeProductData("orders", data);

                  for (const product of products) {
                    const pImage = product.img
                      ? product.img
                      : "No product Image";
                    const subtotal = product.quantity * product.price;
                    const orderDetails = {
                      orderId: orderId,
                      productId: product.productId,
                      prescription: product.requiresPrescription,
                      productName: product.productName,
                      quantity: product.quantity,
                      price: product.price,
                      productImg: pImage,
                      productSubTotalPrice: subtotal.toFixed(2),
                    };

                    const productListId = await storeProductData(
                      "productList",
                      orderDetails
                    );
                  }

                  const sellerAttachments = attachmentsBySeller[sellerId];
                  if (
                    requiresPrescription &&
                    sellerAttachments &&
                    sellerAttachments.length > 0
                  ) {
                    for (const image of sellerAttachments) {
                      try {
                        const downloadUrl = await uploadImageAsync(image.uri);
                        const attachmentData = {
                          orderId: orderId,
                          sellerId: image.sellerId,
                          img: downloadUrl,
                        };
                        const attachmentId = await storeProductData(
                          "attachmentList",
                          attachmentData
                        );
                      } catch (error) {
                        console.log("Error uploading image:", error);
                      }
                    }
                  }

                  for (const product of products) {
                    const updatedStock = product.stock - product.quantity;
                    await updateById(
                      product.productId,
                      "products",
                      "stock",
                      updatedStock
                    );

                    if (updatedStock === 0) {
                      await updateById(
                        product.productId,
                        "products",
                        "productStatus",
                        "Hidden"
                      );
                      console.log(
                        `Product ${product.productName} status updated to hidden.`
                      );
                    }
                  }
                }
              }
            } catch (error) {
              console.log("Error placing the order:", error);
              setBtnLoading(false);
            } finally {
              navigation.navigate("OrderScreen");
              setBtnLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
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
      console.log("Error uploading image:", error);
    }
  };

  const handleItemSelection = async (sellerGroup) => {
    try {
      let results = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!results.canceled) {
        const sellerId = sellerGroup.sellerId;
        const selectedAssets = results.assets;
        // Store selected images with their respective seller IDs
        const newSelectedImages = selectedAssets.map((asset) => ({
          uri: asset.uri,
          sellerId: sellerId,
        }));
        setItemSelectedImages((prevImages) => [
          ...prevImages,
          ...newSelectedImages,
        ]);

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
    } catch (error) {
      console.log("Error selecting image:", error);
    }
  };

  const removePrescImage = async (imageUri, sellerId, imageName) => {
    try {
      // Filter out the selected image and its name from the state
      const updatedImages = itemSelectedImages.filter(
        (image) => image.uri !== imageUri || image.sellerId !== sellerId
      );
      setItemSelectedImages(updatedImages);

      const updatedImageNames = itemSelectedImageNames.filter(
        (name, index) =>
          itemSelectedImages[index].uri !== imageUri ||
          itemSelectedImages[index].sellerId !== sellerId ||
          name !== imageName
      );
      setItemSelectedImageNames(updatedImageNames);

      console.log("Image removed successfully.");
    } catch (error) {
      console.log("Error removing the image:", error);
    }
  };

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EC6F56" />
      </View>
    );
  }

  // Group products by sellerId
  const groupProductsBySeller = (products) => {
    return products.reduce((groupedProducts, product) => {
      const { sellerId } = product;

      if (!groupedProducts[sellerId]) {
        groupedProducts[sellerId] = {
          sellerId: sellerId,
          products: [product],
        };
      } else {
        groupedProducts[sellerId].products.push(product);
      }

      return groupedProducts;
    }, {});
  };
  const calculateSellerProductTotal = (products) => {
    let sellerProductTotal = 0;
    products.forEach((product) => {
      sellerProductTotal += product.price * product.quantity;
    });
    return sellerProductTotal;
  };

  // Use the function to group the products
  const groupedProducts = groupProductsBySeller(item);

  // Initialize variables for grand totals
  let grandProductTotal = 0;
  let grandDeliveryFee = 0;
  let grandTotalPrice = 0;

  // Calculate totals for each seller
  Object.values(groupedProducts).forEach((sellerGroup) => {
    const { products } = sellerGroup;

    // Calculate subtotal for products from specific seller
    let sellerProductTotal = 0;
    products.forEach((product) => {
      sellerProductTotal += product.price * product.quantity;
    });

    // Fetch the delivery fee here
    const sellerDeliveryFee = Number(deliveryFee);

    const sellerTotalPrice = sellerProductTotal + sellerDeliveryFee;

    // Add seller totals to the grand totals
    grandProductTotal += sellerProductTotal;
    grandDeliveryFee += sellerDeliveryFee;
    grandTotalPrice += sellerTotalPrice;
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={styles.container}>
          {/* Address Section */}
          <View style={styles.delAddressContainer}>
            <View>
              <Iconify icon="system-uicons:location" size={35} color="black" />
            </View>
            <View style={styles.delInfoContainer}>
              <View style={styles.delArrowContainer}>
                <Text style={styles.deliveryTitle}>Delivery Address</Text>
              </View>
              {user ? (
                <React.Fragment>
                  <Text style={styles.customerName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.customerNumber}>{user.phone}</Text>
                  {user.address ? (
                    <Text>{user.address}</Text>
                  ) : (
                    <Text style={styles.noCustomerAddress}>
                      Delivery address not specified
                    </Text>
                  )}
                </React.Fragment>
              ) : (
                <Text>Loading user data...</Text>
              )}
            </View>
          </View>
          <View style={styles.separator} />
          {/* Product Section */}
          <View>
            {Object.values(groupedProducts).map((sellerGroup) => (
              <View
                key={sellerGroup.sellerId}
                style={styles.orderGroupContainer}
              >
                <View style={{ flexDirection: "row", marginLeft: 10 }}>
                  <Iconify
                    icon="healthicons:market-stall-outline"
                    size={23}
                    color="black"
                  />
                  <Text style={styles.groupTitle}>
                    {sellerData.find(
                      (seller) => seller.id === sellerGroup.sellerId
                    )?.branch || "Unknown Seller"}
                  </Text>
                </View>
                <View style={styles.separator0} />

                <FlatList
                  data={sellerGroup.products}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.id}
                  renderItem={(props) =>
                    renderOrderItems({ ...props, quantity })
                  }
                />
                <View style={styles.bottomContainer}>
                  {/* Upload Prescription Section */}
                  <View style={styles.uploadPresCont}>
                    {Array.isArray(item) ? (
                      <>
                        {sellerGroup.products.some(
                          (product) => product.requiresPrescription === "Yes"
                        ) && (
                          <>
                            <Text style={styles.reminderText}>
                              Upload your prescription/s here *
                            </Text>
                            <View style={styles.uploadContainer}>
                              <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={() => handleItemSelection(sellerGroup)}
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
                      </>
                    ) : sellerGroup.products.some(
                        (product) => product.requiresPrescription === "Yes"
                      ) ? (
                      <>
                        <Text style={styles.reminderText}>
                          Upload your prescription/s here *
                        </Text>
                        <View style={styles.uploadContainer}>
                          <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={() => handleItemSelection(sellerGroup)}
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
                    ) : null}
                    <View style={styles.prescriptionImageCont}>
                      {sellerGroup.products.some(
                        (product) => product.requiresPrescription === "Yes"
                      ) &&
                        itemSelectedImages
                          .filter(
                            (image) => image.sellerId === sellerGroup.sellerId
                          )
                          .map((image, index) => {
                            if (image.uri) {
                              return (
                                <View
                                  key={index}
                                  style={styles.imageAndNameContainer}
                                >
                                  <View style={styles.xButtonWrapper}>
                                    <TouchableOpacity
                                      onPress={() =>
                                        removePrescImage(
                                          image.uri,
                                          image.sellerId,
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
                                      source={{ uri: image.uri }}
                                      style={styles.selectedImage}
                                      onError={() =>
                                        console.log("Error loading image")
                                      }
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

                  <View style={styles.separator0} />
                  {/* Payment Details Section */}
                  <View style={styles.pmentDetailsContainer}>
                    <Text style={styles.pmentDetailsText}>
                      Payment Details :
                    </Text>
                    <View style={styles.subtotalContainer}>
                      <View style={styles.psSubtotalContainer}>
                        <Text style={styles.psSubtotalText}>
                          Product Subtotal{" "}
                        </Text>
                        <Text style={styles.psSubtotalText}>
                          {"\u20B1"}
                          {calculateSellerProductTotal(
                            sellerGroup.products
                          ).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.psSubtotalContainer}>
                        <Text style={styles.psSubtotalText}>Delivery Fee</Text>
                        <Text style={styles.psSubtotalText}>
                          {"\u20B1"}
                          {deliveryFee}
                        </Text>
                      </View>
                      <View style={styles.pdTotalContainer}>
                        <Text style={styles.pdTotalText}>Total</Text>
                        <Text style={styles.pdTotalAmountText}>
                          {"\u20B1"}
                          {(
                            calculateSellerProductTotal(sellerGroup.products) +
                            Number(deliveryFee)
                          ).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Final total Price */}
          <View style={styles.separator} />
          <View style={styles.totalContainer}>
            <Text style={styles.totalPmentText}>Total Payment</Text>
            <View style={styles.tpContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.pdTotalAmountText}>
                  {"\u20B1"}
                  {grandTotalPrice.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.ordernowButton}
                onPress={handlePlaceOrderScreen}
                disabled={btnLoading}
              >
                {btnLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.ordernowText}>ORDER NOW</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToValidateScreen;
