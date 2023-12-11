import { View, Text } from "react-native";
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
import { getCurrentCustomerName } from "../../src/authToken";
import PendingOrderList from "./PendingValidationOrder";
import ValidatedOrderList from "./ValidatedOrder";
import ToReceiveOrderList from "./ToReceiveOrder";
import CompletedOrderList from "./CompletedOrder";
import CancelledOrderList from "./CancelledOrder";
import { useIsFocused } from "@react-navigation/native";

const OrderScreen = ({ route }) => {
  const navigation = useNavigation();
  const [orderId, setOrderId] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState("");
  // Define a state to store the pending orders
  const [pendingOrders, setPendingOrders] = useState([]);
  const [filteredProductData, setfilteredProductData] = useState([]);
  const [approvedOrders, setApprovedOrders] = useState([]);
  const [productData, setproductData] = useState([]);
  const [trackerTab, setTrackerTab] = useState(route.params?.tabIndex || 1);
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [orderLength, setOrderLength] = useState(true);
  const [customerName, setCustomerName] = useState(null);
  const [outerLoading, setOuterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldLoadOrders, setShouldLoadOrders] = useState(true);
  const isFocused = useIsFocused();

  const getTrackerTabFromPlaceOrder = route.params?.tabIndexFromPlaceOrder;

  console.log(
    `Trackertab from placeOrder screen: ${getTrackerTabFromPlaceOrder}`
  );

  useEffect(() => {
    if (getTrackerTabFromPlaceOrder === 2) {
      fetchValidatedOrdersRealTime();
    }
  }, [isFocused, getTrackerTabFromPlaceOrder]);

  //Focused Realtime for after puchasing place order
  const fetchValidatedOrdersRealTime = async () => {
    try {
      setLoading(true);
      console.log("Loading started...");

      const authToken = await getAuthToken();
      const currentUserId = authToken.userId;
      console.log("Auth token and user ID fetched...");

      const ordersRef = collection(db, "orders");

      const q = query(
        ordersRef,
        where("customerId", "==", currentUserId),
        where("status", "in", ["Validated"])
      );

      console.log("Query constructed:", q);

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          console.log("Snapshot received...");

          const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log("Orders data mapped from snapshot...");

          const promises = ordersData.map(async (order) => {
            try {
              const conditions = [
                {
                  fieldName: "orderId",
                  operator: "==",
                  value: order.id,
                },
              ];

              const apiUrl = buildQueryUrl("productList", conditions);
              console.log("API URL:", apiUrl);

              const response = await fetch(apiUrl, { method: "GET" });

              if (response.ok) {
                const products = await response.json();

                const rateAndReviewRef = collection(db, "rateAndReview");
                const ratedSnapshot = await getDocs(
                  query(rateAndReviewRef, where("orderId", "==", order.id))
                );
                const isOrderRated = !ratedSnapshot.empty;

                console.log("Order products and rating data fetched...");
                return { products, isOrderRated };
              } else {
                console.log("API request failed with status:", response.status);
                setLoading(false);
              }
            } catch (error) {
              console.error("Error fetching order data:", error);
              setLoading(false);
            }
          });

          const results = await Promise.all(promises);
          console.log("Promises resolved...");

          const filteredResults = results.filter(Boolean);

          const orderData = ordersData.map((order, index) => ({
            ...order,
            isRated: filteredResults[index]?.isOrderRated || false,
          }));
          const orderFieldPriority = ["completedAt", "orderedAt", "createdAt"];

          const orderByField = orderFieldPriority.find((field) =>
            orderData.some((order) => order[field])
          );

          const orderBy = orderByField || "createdAt"; // If none of the fields exist, default to "createdAt"

          const orderDataSorted = orderData.sort((a, b) => {
            const dateA = a[orderBy] || 0; // Using 0 if the field doesn't exist for comparison
            const dateB = b[orderBy] || 0;

            return dateB - dateA; // Descending order
          });
          console.log("Final order data processed...");
          setOrderData(orderDataSorted);
          setfilteredProductData(
            filteredResults.map((result) => result.products)
          );
        } catch (error) {
          console.log("Error processing fetched data: ", error);
          setLoading(false);
        } finally {
          setLoading(false);
          console.log("Loading completed...");
        }
      });

      return () => {
        unsubscribe();
        setLoading(false);
        console.log("Unsubscribed from snapshot updates...");
      };
    } catch (error) {
      console.log("Error fetching orders: ", error);
      setLoading(false);
    }
  };

  // Define the fetchOrdersRealTime function
  const fetchOrdersRealTime = async () => {
    try {
      setLoading(true);
      console.log("Loading started...");

      const authToken = await getAuthToken();
      const currentUserId = authToken.userId;
      console.log("Auth token and user ID fetched...");

      const ordersRef = collection(db, "orders");

      let q;
      if (trackerTab === 1) {
        q = query(
          ordersRef,
          where("customerId", "==", currentUserId),
          where("status", "in", ["Pending Validation"])
        );
      } else if (trackerTab === 2) {
        q = query(
          ordersRef,
          where("customerId", "==", currentUserId),
          where("status", "in", ["Validated"])
        );
      } else if (trackerTab === 3) {
        q = query(
          ordersRef,
          where("customerId", "==", currentUserId),
          where("status", "in", [
            "Ordered",
            "To Deliver",
            "Pending Rider",
            "Rider Declined",
            "On Delivery",
          ])
        );
      } else if (trackerTab === 4) {
        q = query(
          ordersRef,
          where("customerId", "==", currentUserId),
          where("status", "in", ["Cancelled"])
        );
      } else if (trackerTab === 5) {
        q = query(
          ordersRef,
          where("customerId", "==", currentUserId),
          where("status", "in", ["Completed", "Payment Released"])
        );
      }

      console.log("Query constructed:", q);

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          console.log("Snapshot received...");

          const ordersData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log("Orders data mapped from snapshot...");

          const promises = ordersData.map(async (order) => {
            try {
              const conditions = [
                {
                  fieldName: "orderId",
                  operator: "==",
                  value: order.id,
                },
              ];

              const apiUrl = buildQueryUrl("productList", conditions);
              console.log("API URL:", apiUrl);

              const response = await fetch(apiUrl, { method: "GET" });

              if (response.ok) {
                const products = await response.json();

                const rateAndReviewRef = collection(db, "rateAndReview");
                const ratedSnapshot = await getDocs(
                  query(rateAndReviewRef, where("orderId", "==", order.id))
                );
                const isOrderRated = !ratedSnapshot.empty;

                console.log("Order products and rating data fetched...");
                return { products, isOrderRated };
              } else {
                console.log("API request failed with status:", response.status);
                setLoading(false);
              }
            } catch (error) {
              console.error("Error fetching order data:", error);
              setLoading(false);
            }
          });

          const results = await Promise.all(promises);
          console.log("Promises resolved...");

          const filteredResults = results.filter(Boolean);

          const orderData = ordersData.map((order, index) => ({
            ...order,
            isRated: filteredResults[index]?.isOrderRated || false,
          }));
          const orderFieldPriority = ["completedAt", "orderedAt", "createdAt"];

          const orderByField = orderFieldPriority.find((field) =>
            orderData.some((order) => order[field])
          );

          const orderBy = orderByField || "createdAt"; // If none of the fields exist, default to "createdAt"

          const orderDataSorted = orderData.sort((a, b) => {
            const dateA = a[orderBy] || 0; // Using 0 if the field doesn't exist for comparison
            const dateB = b[orderBy] || 0;

            return dateB - dateA; // Descending order
          });
          console.log("Final order data processed...");
          setOrderData(orderDataSorted);
          setfilteredProductData(
            filteredResults.map((result) => result.products)
          );
        } catch (error) {
          console.log("Error processing fetched data: ", error);
          setLoading(false);
        } finally {
          setLoading(false);
          console.log("Loading completed...");
        }
      });

      return () => {
        unsubscribe();
        setLoading(false);
        console.log("Unsubscribed from snapshot updates...");
      };
    } catch (error) {
      console.log("Error fetching orders: ", error);
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchOrdersRealTime();
    } catch (error) {
      console.log("Error while refreshing orders:", error);
    } finally {
      setRefreshing(false);
    }
  };
  // Use fetchOrdersRealTime in the initial useEffect
  useEffect(() => {
    if (shouldLoadOrders) {
      fetchOrdersRealTime();
      setShouldLoadOrders(false);
    }
  }, [shouldLoadOrders, trackerTab]);

  const onSelectSwitch = (value) => {
    setTrackerTab(value);
    setShouldLoadOrders(true);
    setLoading(true);
  };

  const handleNavigateToHome = () => {
    navigation.navigate("HomeScreen");
  };

  const handleRateScreen = (orderId) => {
    navigation.navigate("RateScreen", { orderId });
  };
  const handleViewOrderScreen = (orderId) => {
    navigation.navigate("ViewOrderScreen", { orderId: orderId });
  };
  const handleViewCancelledOrders = (orderId) => {
    navigation.navigate("ViewCancelledOrderScreen", { orderId: orderId });
  };
  const handlePlaceOrderScreen = (orderId, totalPrice) => {
    navigation.navigate("PlaceOrderScreen", {
      orderId: orderId,
      totalPrice,
      customerName,
    });
  };
  const handleOrderPlacedScreen = (orderId) => {
    navigation.navigate("ViewCompletedOrderScreen", { orderId: orderId });
  };
  useEffect(() => {
    const fetchCustomerName = async () => {
      const name = await getCurrentCustomerName();
      setCustomerName(name);
    };

    fetchCustomerName();
  }, []);
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
        console.log("orderId", orderId);
        return () => unsubscribe();
      } catch (error) {
        console.error("Error checking if rated: ", error);
      }
    };
    if (orderId) {
      checkIfRated();
    }
  }, [orderId]);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>MY ORDERS</Text>

      <View>
        <OrderSwitchTabs
          selectionMode={trackerTab}
          option1="PENDING"
          option2="VALIDATED"
          option3="TO RECEIVE"
          option4="CANCELLED"
          option5="COMPLETED"
          onSelectSwitch={onSelectSwitch}
          style={{ fontSize: 20, fontWeight: "bold" }}
        />
      </View>

      <PendingOrderList
        trackerTab={trackerTab}
        loading={loading}
        orderData={orderData}
        filteredProductData={filteredProductData}
        handleViewOrderScreen={handleViewOrderScreen}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <ValidatedOrderList
        trackerTab={trackerTab}
        loading={loading}
        orderData={orderData}
        filteredProductData={filteredProductData}
        handlePlaceOrderScreen={handlePlaceOrderScreen}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <ToReceiveOrderList
        trackerTab={trackerTab}
        loading={loading}
        orderData={orderData}
        filteredProductData={filteredProductData}
        handleOrderPlacedScreen={handleOrderPlacedScreen}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <CancelledOrderList
        trackerTab={trackerTab}
        loading={loading}
        orderData={orderData}
        filteredProductData={filteredProductData}
        handleViewCancelledOrders={handleViewCancelledOrders}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <CompletedOrderList
        trackerTab={trackerTab}
        loading={loading}
        orderData={orderData}
        filteredProductData={filteredProductData}
        handleOrderPlacedScreen={handleOrderPlacedScreen}
        handleRateScreen={handleRateScreen}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButtonCont}
          onPress={handleNavigateToHome}
        >
          <Text style={styles.homeButtonText}>
            <Iconify
              icon="ant-design:home-filled"
              size={35}
              color="#EC6F56"
              style={styles.noOrdersIcon}
            />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderScreen;
