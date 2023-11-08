import {
  View,
  Text,
  StyleSheet,
  Switch,
  Dimensions,
  Image,
  Button,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Iconify } from "react-native-iconify";
import OrderSwitchTabs from "../../components/OrderSwitchTabs";
import { Checkbox } from "expo-checkbox";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import styles from "./stylesheet";
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { BASE_URL } from "../../src/api/apiURL";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
const OrderScreen = () => {
  const navigation = useNavigation();
  const [orderId, setOrderId] = useState("rOHz230V7aygWyLmQ6MR");
  const [isRated, setIsRated] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  // Define a state to store the pending orders
  const [pendingOrders, setPendingOrders] = useState([]);
  const [filteredProductData, setfilteredProductData] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [productData, setproductData] = useState([]);
  const [trackerTab, setTrackerTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const onSelectSwitch = (value) => {
    setTrackerTab(value);
    setLoading(true);
  };
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchOrdersRealTime = () => {
      setLoading(true);
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("customerId", "==", currentCustomerId)
        );
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          try {
            const ordersData = [];
            snapshot.docs.forEach((doc) => {
              const data = { id: doc.id, ...doc.data() };
              ordersData.push(data);
            });
            // console.log("orders data:", ordersData);
            //filtering data based on status and tracker tab
            const filterOrderByStatus = ordersData.filter((item) => {
              if (trackerTab === 1 && item.status === "Pending Validation") {
                return true;
              } else if (trackerTab === 2 && item.status === "Validated") {
                return true;
              } else if (
                trackerTab === 3 &&
                (item.status === "Ordered" ||
                  item.status === "To Deliver" ||
                  item.status === "Pending Rider" ||
                  item.status === "On Delivery")
              ) {
                return true;
              } else if (trackerTab === 4 && item.status === "Cancelled") {
                return true;
              } else if (trackerTab === 5 && item.status === "Completed") {
                return true;
              } else {
                return false;
              }
            });
            // Fetch order data for each orderId
            const promises = filterOrderByStatus.map(async (order) => {
              try {
                const conditions = [
                  {
                    fieldName: "orderId",
                    operator: "==",
                    value: order.id,
                  },
                ];
                console.log("orders.id: ", order.id);

                const apiUrl = buildQueryUrl("productList", conditions);

                const response = await fetch(apiUrl, {
                  method: "GET",
                });
                if (response.ok) {
                  const products = await response.json();
                  products.forEach((product) => {
                    console.log("Product ID: ", product.id);
                  });
                  setproductData(products);
                  // console.log("Product data: ", products);
                  return products;
                } else {
                  console.log(
                    "API request failed with status:",
                    response.status
                  );
                  return null;
                }
              } catch (error) {
                console.error("Error fetching order data:", error);
                setLoading(false);
                return null;
              }
            });

            const results = await Promise.all(promises);
            const orderResults = await Promise.all(filterOrderByStatus);
            const filteredResults = results.filter(Boolean);
            const orderData = orderResults.filter(Boolean);
            setOrderData(orderData);
            setfilteredProductData(filteredResults);
            // console.log("Filtered Product Data:", filteredResults);
            // console.log("Order Data:", orderData);
          } catch (error) {
            console.error("Error processing fetched data: ", error);
          } finally {
            setLoading(false);
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching pending orders: ", error);
      }
    };

    fetchOrdersRealTime();
  }, [currentCustomerId, trackerTab]);

  const handleNavigateToHome = () => {
    navigation.navigate("HomeScreen"); // Replace "HomeScreen" with the name of your homescreen component
  };

  const handleRateScreen = () => {
    navigation.navigate("RateScreen", { orderId, currentCustomerId });
  };
  const handleViewOrderScreen = (orderId) => {
    navigation.navigate("ViewCompletedOrderScreen", { orderId: orderId });
  };
  const handleApprovedProductDetailScreen = () => {
    navigation.navigate("ApprovedProductDetailScreen");
  };

  //
  useEffect(() => {
    async function getUserData() {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;

        setCurrentCustomerId(customerId);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    }

    getUserData();
  }, []);

  const buttonText = isRated ? "VIEW RATE" : "RATE";
  //
  useEffect(() => {
    const checkIfRated = async () => {
      try {
        const rateAndReviewRef = collection(db, "rateAndReview");
        const q = query(rateAndReviewRef, where("orderId", "==", orderId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setIsRated(true);
          } else {
            setIsRated(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error checking if rated: ", error);
      }
    };

    checkIfRated();
  }, [orderId]);
  // Fetch pending orders from the database

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => ({
      ...prevSelectedItems,
      [item]: !prevSelectedItems[item],
    }));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>MY ORDERS</Text>

      <View>
        <OrderSwitchTabs
          selectionMode={1}
          option1="PENDING"
          option2="APPROVED"
          option3="TO RECEIVE"
          option4="CANCELLED"
          option5="COMPLETED"
          onSelectSwitch={onSelectSwitch}
          style={{ fontSize: 20, fontWeight: "bold" }}
        />
      </View>

      {trackerTab === 1 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : orderData.length === 0 ? (
            <View style={styles.noOrdersCont}>
              <View style={styles.noOrders}>
                <Iconify
                  icon="fluent-mdl2:deactivate-orders"
                  size={50}
                  color="black"
                  style={styles.noOrdersIcon}
                />
                <Text>No Orders Yet</Text>
              </View>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.orderGroupContainer}>
                  <View style={styles.sellerCont}>
                    <Iconify
                      icon="healthicons:market-stall-outline"
                      size={23}
                      color="black"
                    />
                    <Text style={styles.groupTitle}>
                      {item.branchName ? item.branchName : "branchName"}
                    </Text>
                  </View>
                  {filteredProductData.map((orders, index) => (
                    <View key={index}>
                      {orders.map((order, orderIndex) => {
                        if (order.orderId === item.id && orderIndex === 0) {
                          return (
                            <View key={order.id}>
                              <View style={styles.productContainer}>
                                <View style={styles.productDataContainer}>
                                  <View style={styles.imageContainer}>
                                    <Image
                                      source={{ uri: order.productImg || "" }}
                                      style={styles.productImage}
                                    />
                                  </View>
                                  <View style={styles.productInfoContainer}>
                                    <View style={styles.productNamePrescCont}>
                                      <View>
                                        <Text
                                          style={styles.productName}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {order.productName || ""}
                                        </Text>
                                      </View>
                                      <View>
                                        {order.requiresPrescription ===
                                        "Yes" ? (
                                          <Text style={styles.productReq}>
                                            [ Requires Prescription ]
                                          </Text>
                                        ) : (
                                          <Text
                                            style={styles.productReq}
                                          ></Text>
                                        )}
                                      </View>
                                    </View>
                                    <View style={styles.priceRowContainer}>
                                      <View style={styles.quantityCont}>
                                        <Text style={styles.productAmount}>
                                          x{order.quantity || ""}
                                        </Text>
                                      </View>

                                      <Text style={styles.productPrice}>
                                        {"\u20B1"}
                                        {order.price || ""}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.separator} />
                                <View style={styles.viewOrderDetails}>
                                  <View>
                                    <Text>Items: {item.totalQuantity}</Text>
                                  </View>
                                  <View style={styles.orderTotalCont}>
                                    <Text style={styles.orderTotalText}>
                                      Order Total:
                                    </Text>
                                    <Text style={styles.productPrice}>
                                      {" \u20B1"} {item.totalPrice}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.separator2} />
                                <View style={styles.viewButtonCont}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleViewOrderScreen(item.id)
                                    }
                                    style={styles.viewButton}
                                  >
                                    <Text style={styles.viewText}>
                                      VIEW DETAILS
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      )}

      {trackerTab === 2 && (
        <View style={styles.container}>
          <View style={styles.container}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : orderData.length === 0 ? (
              <View style={styles.noOrdersCont}>
                <View style={styles.noOrders}>
                  <Iconify
                    icon="fluent-mdl2:deactivate-orders"
                    size={50}
                    color="black"
                    style={styles.noOrdersIcon}
                  />
                  <Text>No Orders Yet</Text>
                </View>
              </View>
            ) : (
              <FlatList
                data={orderData}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.orderGroupContainer}>
                    <View style={styles.sellerCont}>
                      <Checkbox
                        color="#EC6F56"
                        value={selectedItems[item.id] || false}
                        onValueChange={() => handleSelectItem(item.id)}
                        style={styles.checkBoxIcon}
                      />
                      <View style={styles.verticalSeparator} />
                      <Iconify
                        icon="healthicons:market-stall-outline"
                        size={23}
                        color="black"
                      />
                      <Text style={styles.groupTitle}>
                        {item.branchName ? item.branchName : "branchName"}
                      </Text>
                    </View>
                    {filteredProductData.map((orders, index) => (
                      <View key={index}>
                        {orders.map((order, orderIndex) => {
                          if (order.orderId === item.id && orderIndex === 0) {
                            return (
                              <View key={order.id}>
                                <View style={styles.productContainer}>
                                  <View style={styles.checkBoxCont}></View>
                                  <View style={styles.productDataContainer}>
                                    <View style={styles.imageContainer}>
                                      <Image
                                        source={{
                                          uri: order.productImg || "",
                                        }}
                                        style={styles.productImage}
                                      />
                                    </View>
                                    <View style={styles.productInfoContainer}>
                                      <View style={styles.productNamePrescCont}>
                                        <View>
                                          <Text
                                            style={styles.productName}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                          >
                                            {order.productName || ""}
                                          </Text>
                                        </View>
                                        <View>
                                          {order.requiresPrescription ===
                                          "Yes" ? (
                                            <Text style={styles.productReq}>
                                              [ Requires Prescription ]
                                            </Text>
                                          ) : (
                                            <Text
                                              style={styles.productReq}
                                            ></Text>
                                          )}
                                        </View>
                                      </View>
                                      <View style={styles.priceRowContainer}>
                                        <View style={styles.quantityCont}>
                                          <Text style={styles.productAmount}>
                                            x{order.quantity || ""}
                                          </Text>
                                        </View>

                                        <Text style={styles.productPrice}>
                                          {"\u20B1"}
                                          {order.price || ""}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                  <View style={styles.separator} />
                                  <View style={styles.viewOrderDetails}>
                                    <View>
                                      <Text>Items: {item.totalQuantity}</Text>
                                    </View>
                                    <View style={styles.orderTotalCont}>
                                      <Text style={styles.orderTotalText}>
                                        Order Total:
                                      </Text>
                                      <Text style={styles.productPrice}>
                                        {" \u20B1"} {item.totalPrice}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.separator2} />
                                  <View style={styles.viewButtonCont}>
                                    <TouchableOpacity
                                      onPress={handleViewOrderScreen}
                                      style={styles.viewButton}
                                    >
                                      <Text style={styles.viewText}>
                                        VIEW DETAILS
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </View>
                    ))}
                  </View>
                )}
              />
            )}
          </View>
          <View style={styles.proceedButtonContainer}>
            <TouchableOpacity
              onPress={handleApprovedProductDetailScreen}
              style={styles.proceedButton}
            >
              <Text style={styles.proceedText}>Proceed to payment</Text>
              <Iconify icon="iconoir:nav-arrow-right" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {trackerTab === 3 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : orderData.length === 0 ? (
            <View style={styles.noOrdersCont}>
              <View style={styles.noOrders}>
                <Iconify
                  icon="fluent-mdl2:deactivate-orders"
                  size={50}
                  color="black"
                  style={styles.noOrdersIcon}
                />
                <Text>No Orders Yet</Text>
              </View>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.orderGroupContainer}>
                  <View style={styles.sellerCont}>
                    <Iconify
                      icon="healthicons:market-stall-outline"
                      size={23}
                      color="black"
                    />
                    <Text style={styles.groupTitle}>
                      {item.branchName ? item.branchName : "branchName"}
                    </Text>
                  </View>
                  {filteredProductData.map((orders, index) => (
                    <View key={index}>
                      {orders.map((order, orderIndex) => {
                        if (order.orderId === item.id && orderIndex === 0) {
                          return (
                            <View key={order.id}>
                              <View style={styles.productContainer}>
                                <View style={styles.productDataContainer}>
                                  <View style={styles.imageContainer}>
                                    <Image
                                      source={{ uri: order.productImg || "" }}
                                      style={styles.productImage}
                                    />
                                  </View>
                                  <View style={styles.productInfoContainer}>
                                    <View style={styles.productNamePrescCont}>
                                      <View>
                                        <Text
                                          style={styles.productName}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {order.productName || ""}
                                        </Text>
                                      </View>
                                      <View>
                                        {order.requiresPrescription ===
                                        "Yes" ? (
                                          <Text style={styles.productReq}>
                                            [ Requires Prescription ]
                                          </Text>
                                        ) : (
                                          <Text
                                            style={styles.productReq}
                                          ></Text>
                                        )}
                                      </View>
                                    </View>
                                    <View style={styles.priceRowContainer}>
                                      <View style={styles.quantityCont}>
                                        <Text style={styles.productAmount}>
                                          x{order.quantity || ""}
                                        </Text>
                                      </View>

                                      <Text style={styles.productPrice}>
                                        {"\u20B1"}
                                        {order.price || ""}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.separator} />
                                <View style={styles.viewOrderDetails}>
                                  <View>
                                    <Text>
                                      Items: {item.totalQuantity || ""}
                                    </Text>
                                  </View>
                                  <View style={styles.orderTotalCont}>
                                    <Text style={styles.orderTotalText}>
                                      Order Total:
                                    </Text>
                                    <Text style={styles.productPrice}>
                                      {" \u20B1"} {item.totalPrice}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.separator2} />
                                <View style={styles.viewButtonCont}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      handleViewOrderScreen(item.id)
                                    }
                                    style={styles.viewButton}
                                  >
                                    <Text style={styles.viewText}>
                                      VIEW DETAILS
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      )}

      {trackerTab === 4 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : orderData.length === 0 ? (
            <View style={styles.noOrdersCont}>
              <View style={styles.noOrders}>
                <Iconify
                  icon="fluent-mdl2:deactivate-orders"
                  size={50}
                  color="black"
                  style={styles.noOrdersIcon}
                />
                <Text>No Orders Yet</Text>
              </View>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.orderGroupContainer}>
                  <View style={styles.sellerCont}>
                    <Iconify
                      icon="healthicons:market-stall-outline"
                      size={23}
                      color="black"
                    />
                    <Text style={styles.groupTitle}>
                      {item.branchName ? item.branchName : "branchName"}
                    </Text>
                  </View>
                  {filteredProductData.map((orders, index) => (
                    <View key={index}>
                      {orders.map((order, orderIndex) => {
                        if (order.orderId === item.id && orderIndex === 0) {
                          return (
                            <View key={order.id}>
                              <View style={styles.productContainer}>
                                <View style={styles.productDataContainer}>
                                  <View style={styles.imageContainer}>
                                    <Image
                                      source={{ uri: order.productImg || "" }}
                                      style={styles.productImage}
                                    />
                                  </View>
                                  <View style={styles.productInfoContainer}>
                                    <View style={styles.productNamePrescCont}>
                                      <View>
                                        <Text
                                          style={styles.productName}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {order.productName || ""}
                                        </Text>
                                      </View>
                                      <View>
                                        {order.requiresPrescription ===
                                        "Yes" ? (
                                          <Text style={styles.productReq}>
                                            [ Requires Prescription ]
                                          </Text>
                                        ) : (
                                          <Text
                                            style={styles.productReq}
                                          ></Text>
                                        )}
                                      </View>
                                    </View>
                                    <View style={styles.priceRowContainer}>
                                      <View style={styles.quantityCont}>
                                        <Text style={styles.productAmount}>
                                          x{order.quantity || ""}
                                        </Text>
                                      </View>

                                      <Text style={styles.productPrice}>
                                        {"\u20B1"}
                                        {order.price || ""}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.separator} />
                                <View style={styles.viewOrderDetails}>
                                  <View>
                                    <Text>Items: {item.totalQuantity}</Text>
                                  </View>
                                  <View style={styles.orderTotalCont}>
                                    <Text style={styles.orderTotalText}>
                                      Order Total:
                                    </Text>
                                    <Text style={styles.productPrice}>
                                      {" \u20B1"} {item.totalPrice}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.separator2} />
                                <View style={styles.viewButtonCont}>
                                  <TouchableOpacity
                                    onPress={handleViewOrderScreen}
                                    style={styles.viewButton}
                                  >
                                    <Text style={styles.viewText}>
                                      VIEW DETAILS
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      )}

      {trackerTab === 5 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : orderData.length === 0 ? (
            <View style={styles.noOrdersCont}>
              <View style={styles.noOrders}>
                <Iconify
                  icon="fluent-mdl2:deactivate-orders"
                  size={50}
                  color="black"
                />
                <Text>No Orders Yet</Text>
              </View>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={orderData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.orderGroupContainer}>
                  <View style={styles.sellerCont}>
                    <Iconify
                      icon="healthicons:market-stall-outline"
                      size={23}
                      color="black"
                      style={styles.noOrdersIcon}
                    />
                    <Text style={styles.groupTitle}>
                      {item.branchName ? item.branchName : "branchName"}
                    </Text>
                  </View>
                  {filteredProductData.map((orders, index) => (
                    <View key={index}>
                      {orders.map((order, orderIndex) => {
                        if (order.orderId === item.id && orderIndex === 0) {
                          return (
                            <View key={order.id}>
                              <View style={styles.productContainer}>
                                <View style={styles.productDataContainer}>
                                  <View style={styles.imageContainer}>
                                    <Image
                                      source={{ uri: order.productImg || "" }}
                                      style={styles.productImage}
                                    />
                                  </View>
                                  <View style={styles.productInfoContainer}>
                                    <View style={styles.productNamePrescCont}>
                                      <View>
                                        <Text
                                          style={styles.productName}
                                          numberOfLines={1}
                                          ellipsizeMode="tail"
                                        >
                                          {order.productName || ""}
                                        </Text>
                                      </View>
                                      <View>
                                        {order.requiresPrescription ===
                                        "Yes" ? (
                                          <Text style={styles.productReq}>
                                            [ Requires Prescription ]
                                          </Text>
                                        ) : (
                                          <Text
                                            style={styles.productReq}
                                          ></Text>
                                        )}
                                      </View>
                                    </View>
                                    <View style={styles.priceRowContainer}>
                                      <View style={styles.quantityCont}>
                                        <Text style={styles.productAmount}>
                                          x{order.quantity || ""}
                                        </Text>
                                      </View>

                                      <Text style={styles.productPrice}>
                                        {"\u20B1"}
                                        {order.price || ""}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.separator} />
                                <View style={styles.viewOrderDetails}>
                                  <View>
                                    <Text>Items: {item.totalQuantity}</Text>
                                  </View>
                                  <View style={styles.orderTotalCont}>
                                    <Text style={styles.orderTotalText}>
                                      Order Total:
                                    </Text>
                                    <Text style={styles.productPrice}>
                                      {" \u20B1"} {item.totalPrice}
                                    </Text>
                                  </View>
                                </View>
                                <View style={styles.separator2} />
                                <View>
                                  <View style={styles.viewRateContainer}>
                                    <TouchableOpacity
                                      onPress={handleRateScreen}
                                    >
                                      <View style={styles.rateButton}>
                                        <Text style={styles.rateText}>
                                          {buttonText}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                    <View style={{ marginHorizontal: 5 }} />
                                    <TouchableOpacity
                                      onPress={handleViewOrderScreen}
                                      style={styles.viewButton}
                                    >
                                      <Text style={styles.viewText}>
                                        VIEW DETAILS
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </View>
                  ))}
                </View>
              )}
            />
          )}
        </View>
      )}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={handleNavigateToHome}
      >
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderScreen;
