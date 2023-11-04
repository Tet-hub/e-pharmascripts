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
  const [productData, setproductData] = useState([]);
  const [trackerTab, setTrackerTab] = useState(1);
  const [loading, setLoading] = useState(true); // Added loading state
  const [ordersData, setOrdersData] = useState([]);

  const onSelectSwitch = (value) => {
    setTrackerTab(value);
    setLoading(true);
  };
  const { width, height } = Dimensions.get("window");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchOrdersRealTime = () => {
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
            setOrdersData(ordersData);
            // console.log("orders data:", ordersData);
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

                  return products; // Return products to be used later
                } else {
                  console.log(
                    "API request failed with status:",
                    response.status
                  );
                  return null;
                }
              } catch (error) {
                console.error("Error fetching order data:", error);
                return null;
              }
            });

            const results = await Promise.all(promises);
            const filteredResults = results.filter(Boolean);
            setPendingOrders(filteredResults);
            console.log("filteredResults data:", filteredResults);
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
  const handleViewOrderScreen = () => {
    navigation.navigate("ViewCompletedOrderScreen");
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
          {/* ... */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : pendingOrders.length === 0 ? (
            <View style={styles.noOrders}>
              <Iconify
                icon="fluent-mdl2:deactivate-orders"
                size={22}
                color="black"
              />
              <Text>No pending orders</Text>
            </View>
          ) : (
            <View style={styles.orderGroupContainer}>
              {pendingOrders.map((orders, index) => {
                // Initializing the total quantity
                let totalQuantity = 0;

                return (
                  <View key={index}>
                    <Text style={styles.groupTitle}>
                      {orders.length > 0 && ordersData[index]?.branchName
                        ? ordersData[index]?.branchName
                        : ""}
                    </Text>
                    {orders.map((order, orderIndex) => {
                      // Adding to the total quantity
                      totalQuantity += order.quantity || 0;

                      if (orderIndex === 0) {
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
                                  <View>
                                    <Text style={styles.productName}>
                                      {order.productName || ""}
                                    </Text>
                                    <Text style={styles.productReq}>
                                      {order.requiresPrescription
                                        ? "[ Requires Prescription ]"
                                        : ""}
                                    </Text>
                                  </View>
                                  <View style={styles.priceRowContainer}>
                                    <Text style={styles.productAmount}>
                                      x{order.quantity || ""}
                                    </Text>
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
                                  <Text style={styles.productAmount}>
                                    Total Quantity: {totalQuantity}
                                  </Text>
                                  <Text>{`Order Total: \u20B1${order.productSubtotal}`}</Text>
                                </View>
                              </View>
                              <View style={styles.viewMoreText}>
                                <Text>View more Products</Text>
                              </View>
                            </View>
                          </View>
                        );
                      } else {
                        return null; // To skip rendering additional items for the same order
                      }
                    })}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}

      {trackerTab === 2 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : pendingOrders.length === 0 ? (
            <View style={styles.noOrders}>
              <Iconify
                icon="fluent-mdl2:deactivate-orders"
                size={22}
                color="black"
              />
              <Text>No pending orders</Text>
            </View>
          ) : (
            <FlatList
              data={pendingOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productContainer}
                  onPress={handleApprovedProductDetailScreen}
                >
                  <View>
                    <Checkbox
                      color="#EC6F56"
                      value={isChecked}
                      onValueChange={setIsChecked}
                      style={styles.checkBoxIcon}
                    />
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.productDetails.img }}
                      style={styles.productImage}
                    />
                  </View>
                  <View style={styles.productInfoContainer}>
                    <View>
                      <Text style={styles.productName}>
                        {item.productDetails.productName}
                      </Text>
                      <Text style={styles.productReq}>
                        {item.productDetails.requiresPrescription
                          ? "[ Requires Prescription ]"
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.priceRowContainer}>
                      <Text style={styles.productAmount}>x{item.quantity}</Text>
                      <Text style={styles.productPrice}>
                        {"\u20B1"}
                        {item.productDetails.price}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.xButtonWrapper}>
                    <TouchableOpacity style={styles.xButton}>
                      <Iconify
                        icon="carbon:close-filled"
                        size={22}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          <View style={styles.footer}>
            <View style={styles.proceedButtonContainer}>
              <TouchableOpacity style={styles.proceedButton}>
                <Text style={styles.proceedText}>Proceed to payment</Text>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {trackerTab === 3 && (
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : pendingOrders.length === 0 ? (
            <View style={styles.noOrders}>
              <Iconify
                icon="fluent-mdl2:deactivate-orders"
                size={22}
                color="black"
              />
              <Text>No pending orders</Text>
            </View>
          ) : (
            <FlatList
              data={pendingOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.productContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.productDetails.img }}
                      style={styles.productImage}
                    />
                  </View>
                  <View style={styles.productInfoContainer}>
                    <View>
                      <Text style={styles.productName}>
                        {item.productDetails.productName}
                      </Text>
                      <Text style={styles.productReq}>
                        {item.productDetails.requiresPrescription
                          ? "[ Requires Prescription ]"
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.priceRowContainer}>
                      <Text style={styles.productAmount}>x{item.quantity}</Text>
                      <Text style={styles.productPrice}>
                        {"\u20B1"}
                        {item.productDetails.price}
                      </Text>
                    </View>
                  </View>
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
          ) : pendingOrders.length === 0 ? (
            <View style={styles.noOrders}>
              <Iconify
                icon="fluent-mdl2:deactivate-orders"
                size={22}
                color="black"
              />
              <Text>No pending orders</Text>
            </View>
          ) : (
            <FlatList
              data={pendingOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.productContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.productDetails.img }}
                      style={styles.productImage}
                    />
                  </View>
                  <View style={styles.productInfoContainer}>
                    <View>
                      <Text style={styles.productName}>
                        {item.productDetails.productName}
                      </Text>
                      <Text style={styles.productReq}>
                        {item.productDetails.requiresPrescription
                          ? "[ Requires Prescription ]"
                          : ""}
                      </Text>
                    </View>
                    <View style={styles.priceRowContainer}>
                      <Text style={styles.productAmount}>x{item.quantity}</Text>
                      <Text style={styles.productPrice}>
                        {"\u20B1"}
                        {item.productDetails.price}
                      </Text>
                    </View>
                  </View>
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
          ) : pendingOrders.length === 0 ? (
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
              data={pendingOrders}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.completedOrderContainer}>
                  <View style={styles.completedProductContainer}>
                    <View style={styles.imageContainerCompletedScreen}>
                      <Image
                        source={{ uri: item.productDetails.img }}
                        style={styles.productImageCompletedScreen}
                      />
                    </View>
                    <View style={styles.productInfoContainer}>
                      <View>
                        <Text style={styles.productName}>
                          {item.productDetails.productName}
                        </Text>
                        <Text style={styles.productReq}>
                          {item.productDetails.requiresPrescription
                            ? "[ Requires Prescription ]"
                            : ""}
                        </Text>
                      </View>
                      <View style={styles.priceRowContainer}>
                        <Text style={styles.productAmount}>
                          x{item.quantity}
                        </Text>
                        <Text style={styles.productPrice}>
                          Order Total: {"\u20B1"}
                          {item.totalPrice}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.viewRateContainer}>
                      <TouchableOpacity onPress={handleViewOrderScreen}>
                        <View style={styles.viewButton}>
                          <Text style={styles.viewText}>DETAILS</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleRateScreen}>
                        <View style={styles.rateButton}>
                          <Text style={styles.rateText}>{buttonText}</Text>
                        </View>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 15, color: "green" }}>
                        status:{item.status}
                      </Text>
                    </View>
                  </View>
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
