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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Iconify } from "react-native-iconify";
import styles from "./viewCancelledOrderStyles";
import { BASE_URL } from "../../src/api/apiURL";
import buildQueryUrl from "../../src/api/components/conditionalQuery";

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
                    <Text style={styles.psSubtotalText}>Delivery Fee</Text>
                    <Text style={styles.psSubtotalText}>
                      {"\u20B1"}
                      {item.deliveryFee || "50.00"}
                    </Text>
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
                <View style={styles.removerOrderButton}>
                  <Iconify
                    icon="pajamas:canceled-circle"
                    size={30}
                    color="red"
                  />
                  <Text style={styles.removerOrderText}>ORDER CANCELLED</Text>
                </View>
              </View>
            </React.Fragment>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewCancelledOrderScreen;
