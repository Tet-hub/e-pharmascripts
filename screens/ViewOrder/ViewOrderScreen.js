import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import styles from "./viewOrderStyles";
import { BASE_URL } from "../../src/api/apiURL";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { updateById } from "../../database/update/updateDataById";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BASE_URL2 } from "../../utilities/backendURL";
import axios from "axios";
import { getAuthToken, getCurrentUserId } from "../../src/authToken";

const ViewCancelledOrderScreen = ({ navigation, route }) => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(true);
  const [item, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [attachmentData, setAttachmentData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const { orderId } = route.params;
  console.log("order id", orderId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (orderId) {
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/orders/${orderId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const orderData = await response.json();
            setOrderData(orderData);
            console.log("orderdata", orderData);

            // Replace with appropriate conditions
            const productCondition = [
              {
                fieldName: "orderId",
                operator: "==",
                value: orderId,
              },
            ];
            console.log("orders.id: ", orderId);
            const apiUrl = buildQueryUrl("productList", productCondition);

            const productResponse = await fetch(apiUrl, {
              method: "GET",
            });

            if (productResponse.ok) {
              const products = await productResponse.json();
              products.forEach((product) => {
                console.log("Product ID: ", product.id);
              });
              setProductData(products);
              console.log("productData", products);
            } else {
              console.log(
                "API request failed with status:",
                productResponse.status
              );
            }
            const attachmentCondition = [
              {
                fieldName: "orderId",
                operator: "==",
                value: orderId,
              },
            ];
            console.log("orders.id: ", orderId);
            const attachmentUrl = buildQueryUrl(
              "attachmentList",
              attachmentCondition
            );

            const attachmentResponse = await fetch(attachmentUrl, {
              method: "GET",
            });

            if (attachmentResponse.ok) {
              const attachments = await attachmentResponse.json();
              attachments.forEach((attachment) => {
                console.log("Attachment ID: ", attachment.id);
              });
              setAttachmentData(attachments);
              console.log("Attachment Data", attachments);
            } else {
              console.log(
                "API request failed with status:",
                attachmentResponse.status
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleRemoveOrder = () => {
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: async () => {
            try {
              const userToken = item.customerId;
              const sellerId = item.sellerId;
              const sellerFcmToken = item.sellerFcmToken;

              if (!sellerFcmToken || sellerFcmToken === "null") {
                // Save the notification to the 'notifications' collection in Firestore
                await addDoc(collection(db, "notifications"), {
                  title: "Order Cancelled",
                  body: `Order has been cancelled by the customer ${orderId}.`,
                  receiverId: sellerId,
                  senderId: userToken,
                  read: false,
                  createdAt: serverTimestamp(),
                });
              } else if (sellerFcmToken) {
                try {
                  const response = await axios.post(
                    `${BASE_URL2}/post/sendToFCM`,
                    {
                      title: "Order Cancelled",
                      body: `Order has been cancelled by the customer ${orderId}.`,
                      fcmToken: sellerFcmToken,
                    }
                  );
                  console.log("Notification sent to FCM:", response.data);
                } catch (error) {
                  console.error("Error sending notification:", error);
                }

                // Save the notification to the 'notifications' collection in Firestore
                await addDoc(collection(db, "notifications"), {
                  title: "Order Cancelled",
                  body: `Order has been cancelled by the customer ${orderId}.`,
                  receiverId: sellerId,
                  senderId: userToken,
                  read: false,
                  createdAt: serverTimestamp(),
                });
              }

              await updateById(orderId, "orders", "status", "Cancelled");
              console.log("Order removed and status updated.");
              navigation.navigate("OrderScreen");
            } catch (error) {
              console.error("Error while updating order status:", error);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.productImg ||
              "https://firebasestorage.googleapis.com/v0/b/e-pharmascripts.appspot.com/o/Image%2Fdefault-image.jpg?alt=media&token=76ae025c-1cdd-4cbe-83be-2df33c08ae6e",
          }}
          style={styles.productImage}
        />
      </View>
      <View style={styles.productInfoContainer}>
        <View>
          <Text
            style={styles.productName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.productName || ""}
          </Text>
          {item.prescription === "Yes" ? (
            <Text style={styles.productReq}>[ Requires Prescription ]</Text>
          ) : (
            <Text style={styles.productReq}></Text>
          )}
        </View>
        <View style={styles.priceRowContainer}>
          <Text style={styles.productPrice}>
            {"\u20B1"}
            {item.price || ""}
          </Text>
          <Text style={styles.productAmount}>x{item.quantity || ""}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        <View style={[styles.container]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EC6F56" />
            </View>
          ) : (
            <React.Fragment>
              <View style={styles.delAddressContainer}>
                <View>
                  <Iconify
                    icon="system-uicons:location"
                    size={35}
                    color="black"
                  />
                </View>
                <View style={styles.delInfoContainer}>
                  <Text style={styles.deliveryTitle}>Delivery Address</Text>
                  <Text style={styles.customerName}>
                    | {item.customerName || ""}
                  </Text>
                  <Text style={styles.customerNumber}>
                    | {item.customerPhoneNumber || ""}
                  </Text>
                  <Text style={styles.customerAddress}>
                    | {item.deliveryAddress || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.separator} />

              <FlatList
                data={productData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
              <View style={styles.separator2} />

              <View style={styles.pmentContainer}>
                {attachmentData.length > 0 ? (
                  <>
                    <Text style={styles.pImgTxt}>
                      Prescription image/s uploaded
                    </Text>
                    <FlatList
                      data={attachmentData}
                      scrollEnabled={false}
                      vertical
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImage(item.img);
                            setModalVisible(true);
                          }}
                        >
                          <View style={styles.selectedImageCont}>
                            <Image
                              source={{ uri: item.img }}
                              style={styles.selectedImage}
                              onError={() => console.log("Error loading image")}
                            />
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </>
                ) : null}
              </View>
              <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 30,
                      padding: 15,
                      zIndex: 1,
                      color: "white",
                      borderRadius: 20,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Iconify
                      icon="ion:arrow-back-sharp"
                      size={35}
                      color="white"
                    />
                  </TouchableOpacity>
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullscreenImage}
                    resizeMode="contain"
                  />
                </View>
              </Modal>

              <View style={styles.separator2} />
              <View style={styles.pmentDetailsContainer}>
                <Text style={styles.pmentDetailsText}>Payment Details :</Text>
                <View style={styles.subtotalContainer}>
                  <View style={styles.psSubtotalContainer}>
                    <Text style={styles.psSubtotalText}>Product Subtotal</Text>
                    <Text style={styles.psSubtotalText}>
                      {"\u20B1"}
                      {item.orderSubTotalPrice || ""}
                    </Text>
                  </View>
                  <View style={styles.psSubtotalContainer}>
                    <Text style={styles.psSubtotalText}>Shipping Subtotal</Text>
                    <Text style={styles.psSubtotalText}>₱50.00</Text>
                  </View>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.totalContainer}>
                <Text style={styles.totalPmentText}>Total Payment</Text>
                <Text style={styles.totalAmountText}>
                  {"\u20B1"}
                  {item.totalPrice || ""}
                </Text>
              </View>
              <View style={styles.separator3} />
              <View>
                <TouchableOpacity
                  style={styles.removerOrderButton}
                  onPress={handleRemoveOrder}
                >
                  <Iconify
                    icon="mingcute:delete-2-line"
                    size={28}
                    color="white"
                  />
                  <Text style={styles.removerOrderText}>Remove Order</Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewCancelledOrderScreen;
