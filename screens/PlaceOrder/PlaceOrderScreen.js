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
  Alert,
  ToastAndroid,
  Modal,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Iconify } from "react-native-iconify";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./stylesheet";
import { BASE_URL } from "../../src/api/apiURL";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
import { useRoute } from "@react-navigation/native";
import { updateById } from "../../database/update/updateDataById";
import {
  updateDoc,
  doc,
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useToast } from "react-native-toast-notifications";
import { CreditCardInput } from "../../components/credit-card.component";
import { getCurrentCustomerName } from "../../src/authToken";
import { payRequest } from "../../service/checkout.service";
import { BASE_URL2 } from "../../utilities/backendURL";
import axios from "axios";

const PlaceOrderScreen = ({ navigation, route }) => {
  const toast = useToast();
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;
  const [loading, setLoading] = useState(true);
  const [item, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
  const { orderId, totalPrice, customerName } = route.params;
  const [card, setCard] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [attachmentData, setAttachmentData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  console.log(`CustomerName: ${customerName}`);
  console.log(`TotalPrice: ${totalPrice}`);

  const exchangeRate = 53;
  const amountInUSD = totalPrice / exchangeRate;
  console.log(`Amount in Dollars : ${amountInUSD.toFixed(2)}`);

  const customerId = item.customerId;
  const sellerId = item.sellerId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (orderId) {
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/orders/${orderId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const orderData = await response.json();
            setOrderData(orderData);

            const productCondition = [
              {
                fieldName: "orderId",
                operator: "==",
                value: orderId,
              },
            ];
            const apiUrl = buildQueryUrl("productList", productCondition);

            const productResponse = await fetch(apiUrl, {
              method: "GET",
            });

            if (productResponse.ok) {
              const products = await productResponse.json();
              products.forEach((product) => {});
              setProductData(products);
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
              }
            } else {
              console.log(
                "API request failed with status:",
                productResponse.status
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
  useEffect(() => {
    setIsPaymentMethodSelected(!!selectedPaymentMethod);
  }, [selectedPaymentMethod]);
  const handlePlaceOrder = async () => {
    if (!isPaymentMethodSelected) {
      toast.show(`Please select a payment method first`, {
        type: "normal ",
        placement: "bottom",
        duration: 3000,
        offset: 10,
        animationType: "slide-in",
      });
      return;
    }
    if (orderId && selectedPaymentMethod === "Card") {
      if (!card || !card.id) {
        // console.log("Error card");
        toast.show(`Error card`, {
          type: "normal ",
          placement: "bottom",
          duration: 3000,
          offset: 10,
          animationType: "slide-in",
        });
        return;
      }
    }
    Alert.alert(
      "Confirm Order",
      "Please ensure that you carefully place your order as it cannot be cancelled after. \n\nWould you like to proceed with placing this order?",
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
              if (orderId && selectedPaymentMethod === "Card") {
                try {
                  const response = await payRequest(
                    card.id,
                    totalPrice,
                    customerName
                  );
                  const paymentIntentId = response.paymentIntentId;

                  console.log("Payment Intent ID:", paymentIntentId);

                  // Update the order status only when payment is successful
                  await updateById(
                    orderId,
                    "orders",
                    "paymentMethod",
                    selectedPaymentMethod
                  );

                  const orderCreatedTimestamp = Timestamp.now();
                  const orderDocRef = doc(db, "orders", orderId);
                  await updateDoc(
                    orderDocRef,
                    {
                      paymentId: paymentIntentId,
                      orderedAt: orderCreatedTimestamp,
                      status: "Ordered", // Update the status here
                    },
                    { merge: true }
                  );

                  const sellerResponse = await axios.get(
                    `${BASE_URL2}/get/getSeller/${sellerId}`
                  );
                  const sellerData = sellerResponse.data;
                  const sellerFcmToken = sellerData.fcmToken;

                  if (!sellerFcmToken || sellerFcmToken.length === 0) {
                    // Save the notification to the 'notifications' collection in Firestore
                    await addDoc(collection(db, "notifications"), {
                      title: "New Order Arrived",
                      body: `New Order has arrived, please work on order ${orderId}.`,
                      receiverId: sellerId,
                      senderId: customerId,
                      read: false,
                      createdAt: serverTimestamp(),
                    });
                  } else if (sellerFcmToken) {
                    try {
                      const response = await axios.post(
                        `${BASE_URL2}/post/sendToFCM`,
                        {
                          title: "New Order Arrived",
                          body: `New Order has arrived, please work on order ${orderId}.`,
                          fcmToken: sellerFcmToken,
                        }
                      );
                      console.log("Notification sent to FCM:", response.data);
                    } catch (error) {
                      console.error("Error sending notification:", error);
                    }

                    // Save the notification to the 'notifications' collection in Firestore
                    await addDoc(collection(db, "notifications"), {
                      title: "New Order Arrived",
                      body: `New Order has arrived, please work on order ${orderId}.`,
                      receiverId: sellerId,
                      senderId: customerId,
                      read: false,
                      createdAt: serverTimestamp(),
                    });
                  }
                  setBtnLoading(false);
                } catch (error) {
                  // console.error("Error processing payment:", error);
                  toast.show(`Error processing payment`, {
                    type: "normal ",
                    placement: "bottom",
                    duration: 3000,
                    offset: 10,
                    animationType: "slide-in",
                  });
                  setBtnLoading(false);
                }
              } else if (orderId && selectedPaymentMethod) {
                // Update the order status for other payment methods
                await updateById(orderId, "orders", "status", "Ordered");
                await updateById(
                  orderId,
                  "orders",
                  "paymentMethod",
                  selectedPaymentMethod
                );

                const orderCreatedTimestamp = Timestamp.now();
                const orderDocRef = doc(db, "orders", orderId);
                await updateDoc(
                  orderDocRef,
                  {
                    orderedAt: orderCreatedTimestamp,
                  },
                  { merge: true }
                );

                const sellerResponse = await axios.get(
                  `${BASE_URL2}/get/getSeller/${sellerId}`
                );
                const sellerData = sellerResponse.data;
                const sellerFcmToken = sellerData.fcmToken;

                if (!sellerFcmToken || sellerFcmToken.length === 0) {
                  // Save the notification to the 'notifications' collection in Firestore
                  await addDoc(collection(db, "notifications"), {
                    title: "New Order Arrived",
                    body: `New Order has arrived, please work on order ${orderId}.`,
                    receiverId: sellerId,
                    senderId: customerId,
                    read: false,
                    createdAt: serverTimestamp(),
                  });
                } else if (sellerFcmToken) {
                  try {
                    const response = await axios.post(
                      `${BASE_URL2}/post/sendToFCM`,
                      {
                        title: "New Order Arrived",
                        body: `New Order has arrived, please work on order ${orderId}.`,
                        fcmToken: sellerFcmToken,
                      }
                    );
                    console.log("Notification sent to FCM:", response.data);
                  } catch (error) {
                    console.error("Error sending notification:", error);
                  }

                  // Save the notification to the 'notifications' collection in Firestore
                  await addDoc(collection(db, "notifications"), {
                    title: "New Order Arrived",
                    body: `New Order has arrived, please work on order ${orderId}.`,
                    receiverId: sellerId,
                    senderId: customerId,
                    read: false,
                    createdAt: serverTimestamp(),
                  });
                }
              }
            } catch (error) {
              console.error("Error placing the order:", error);
              setBtnLoading(false);
            } finally {
              setBtnLoading(false);
              navigation.navigate("OrderScreen", {
                tabIndexFromPlaceOrder: 2,
              });
            }
          },
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
          {item.requiresPrescription === "Yes" ? (
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
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EC6F56" />
            </View>
          ) : (
            <View>
              <View style={styles.delAddressContainer}>
                <View>
                  <Iconify
                    icon="system-uicons:location"
                    size={35}
                    color="black"
                  />
                </View>
                <View style={styles.delInfoContainer}>
                  <View style={styles.delArrowContainer}>
                    <Text style={styles.deliveryTitle}>
                      {item.customerName || ""}
                    </Text>
                    {/* <TouchableOpacity>
                  <Iconify
                    icon="iconoir:nav-arrow-right"
                    size={25}
                    color="black"
                  />
                </TouchableOpacity> */}
                  </View>
                  <Text style={styles.customerName}>
                    {item.customerName || ""}
                  </Text>
                  <Text style={styles.customerNumber}>
                    {item.customerPhoneNumber || ""}
                  </Text>
                  <Text style={styles.customerAddress}>
                    {item.deliveryAddress || ""}
                  </Text>
                </View>
              </View>
              <View style={styles.separator} />

              <View style={styles.productInfoContainer}>
                <View>
                  <FlatList
                    data={productData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                  />
                </View>
              </View>
              <View style={styles.pmentContainer}>
                {attachmentData.length > 0 ? (
                  <>
                    <Text style={styles.reminderText}>
                      Prescription image/s uploaded
                    </Text>
                    <FlatList
                      data={attachmentData}
                      horizontal
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
              <View style={styles.separator} />
              <View style={styles.paymentMethodContainer}>
                <Text style={styles.pmText}>Payment Method :</Text>
                <View style={styles.pmOptions}>
                  <TouchableOpacity
                    style={[
                      styles.methodContainer,
                      selectedPaymentMethod === "CashOnDelivery" &&
                        styles.selectedMethod,
                    ]}
                    onPress={() => setSelectedPaymentMethod("CashOnDelivery")}
                  >
                    <Iconify
                      icon="healthicons:vespa-motorcycle-outline"
                      size={30}
                      style={[
                        styles.methodsIcon,
                        selectedPaymentMethod === "CashOnDelivery" &&
                          styles.selectedText,
                      ]}
                    />
                    <Text
                      style={[
                        styles.methodsText,
                        selectedPaymentMethod === "CashOnDelivery" &&
                          styles.selectedText,
                      ]}
                    >
                      Cash on{"\n"}Delivery
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodContainer,
                      selectedPaymentMethod === "Card" && styles.selectedMethod,
                    ]}
                    onPress={() => setSelectedPaymentMethod("Card")}
                  >
                    <Iconify
                      icon="ph:wallet-light"
                      size={30}
                      style={[
                        styles.methodsIcon,
                        selectedPaymentMethod === "Card" && styles.selectedText,
                      ]}
                    />
                    <Text
                      style={[
                        styles.methodsText,
                        selectedPaymentMethod === "Card" && styles.selectedText,
                      ]}
                    >
                      Credit Card
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* CreditCard Input */}
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 24,
                  marginLeft: 23,
                }}
              >
                {selectedPaymentMethod === "Card" && (
                  <CreditCardInput name={customerName} onSuccess={setCard} />
                )}
              </View>

              <View style={styles.bottomContainer}>
                <View style={styles.separator2} />
                <View style={styles.pmentDetailsContainer}>
                  <Text style={styles.pmentDetailsText}>Payment Details :</Text>
                  <View style={styles.subtotalContainer}>
                    <View style={styles.psSubtotalContainer}>
                      <Text style={styles.psSubtotalText}>
                        Product Subtotal
                      </Text>
                      <Text style={styles.psSubtotalText}>
                        {"\u20B1"}
                        {item.orderSubTotalPrice || ""}
                      </Text>
                    </View>
                    <View style={styles.psSubtotalContainer}>
                      <Text style={styles.psSubtotalText}>Delivery Fee</Text>
                      <Text style={styles.psSubtotalText}>
                        {"\u20B1"}
                        {item.deliveryFee || "50.00"}
                      </Text>
                    </View>
                    <View style={styles.pdTotalContainer}>
                      <Text style={styles.pdTotalText}>Total</Text>
                      <View style={styles.ttCont}>
                        <Text style={styles.pdTotalAmountText}>
                          {"\u20B1"}
                          {item.totalPrice || ""}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalPmentText}>Total Payment</Text>
                  <View style={styles.tpContainer}>
                    <Text style={styles.totalAmountText}>
                      {"\u20B1"}
                      {item.totalPrice || ""}
                    </Text>
                    <TouchableOpacity
                      style={styles.ordernowButton}
                      onPress={handlePlaceOrder}
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.ordernowText}>PLACE ORDER</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlaceOrderScreen;
