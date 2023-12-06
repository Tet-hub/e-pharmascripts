import { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { CheckBox, Divider } from "react-native-elements";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { setNotificationHandler } from "../../components/NotificationHandler";
import { BASE_URL2 } from "../../utilities/backendURL";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { db } from "../../firebase/firebase";
import {
  doc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import { getCurrentUserId } from "../../src/authToken";
import DiarySwitchTabs from "../../components/OrderSwitchTabs";
import imagePath from "../../constants/imagePath";

setNotificationHandler();

export default function NotificationScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotifications((oldNotifications) => {
          const newNotifications = [...oldNotifications, notification];
          AsyncStorage.setItem(
            "notifications",
            JSON.stringify(newNotifications)
          );
          console.log("New Notification Received:", notification);
          return newNotifications;
        });

        fetchNotifications();
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("notifications").then((value) => {
      if (value) {
        setNotifications(JSON.parse(value));
      }
    });
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();

      const notificationsCollection = collection(db, "notifications");
      const q = query(
        notificationsCollection,
        where("receiverId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const notificationsQuerySnapshot = await getDocs(q);

      const fetchedNotifications = notificationsQuerySnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        }
      );

      setNotifications(fetchedNotifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  // Display notifications
  const renderNotifications = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#EC6F56" />;
    }
    if (notifications.length > 0) {
      return notifications.map((notification, index) => (
        <View key={index} style={{ flexDirection: "row" }}>
          {showCheckboxes && (
            <CheckBox
              checked={selectedNotifications.includes(notification.id)}
              onPress={() => {
                setSelectedNotifications((oldSelectedNotifications) => {
                  if (oldSelectedNotifications.includes(notification.id)) {
                    return oldSelectedNotifications.filter(
                      (id) => id !== notification.id
                    );
                  } else {
                    return [...oldSelectedNotifications, notification.id];
                  }
                });
              }}
            />
          )}
          <TouchableOpacity
            style={[
              styles.notificationContainer,
              { backgroundColor: notification.read ? "white" : "#f8f8f8" },
            ]}
            onLongPress={() => {
              if (showCheckboxes) {
                setSelectedNotifications([]);
                setShowCheckboxes(false);
              } else {
                setShowCheckboxes(true);
              }
            }}
            onPress={async () => {
              switch (notification.title) {
                case "Account Verified":
                  navigation.navigate("ProfileScreen");
                  break;
                case "Account Rejected":
                  navigation.navigate("ProfileScreen");
                  break;
                case "Order Processing":
                  navigation.navigate("OrderScreen", { tabIndex: 3 });
                  break;
                case "Order Out for Delivery":
                  navigation.navigate("OrderScreen", { tabIndex: 3 });
                  break;
                case "Order Delivered":
                  navigation.navigate("OrderScreen", { tabIndex: 5 });
                  break;
                case "Order Validated":
                  navigation.navigate("OrderScreen", { tabIndex: 2 });
                  break;
                case "Order Cancelled":
                  navigation.navigate("OrderScreen", { tabIndex: 4 });
                  break;
                default:
                  break;
              }
              await updateDoc(doc(db, "notifications", notification.id), {
                read: true,
              });
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  source={
                    notification.title === "Order Processing"
                      ? imagePath.processing
                      : notification.title === "Order Out for Delivery"
                      ? imagePath.delivering
                      : notification.title === "Order Delivered"
                      ? imagePath.delivered
                      : notification.title === "Order Validated"
                      ? imagePath.validated
                      : notification.title === "Order Cancelled"
                      ? imagePath.cancelled
                      : notification.title === "Account Verified"
                      ? imagePath.verified
                      : notification.title === "Account Rejected"
                      ? imagePath.rejected
                      : imagePath.defaultImg
                  }
                  style={{ width: 70, height: 70, marginRight: 20 }}
                />
              </View>
              <View>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {notification && notification.title}
                </Text>
                <Text
                  style={{
                    fontWeight: "300",
                    fontSize: 14,
                    marginLeft: 5,
                    marginTop: 5,
                  }}
                >
                  {notification && notification.body}
                </Text>
              </View>
            </View>
            <Divider
              width={0.5}
              orientation="horizontal"
              style={{ paddingTop: 20, borderColor: "#8E8E8E" }}
            />
          </TouchableOpacity>
        </View>
      ));
    } else {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "300",
              padding: 15,
              paddingLeft: 10,
              color: "#4E4E4E",
            }}
          >
            Empty Notification
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>Notifications</Text>
        <Divider
          width={0.5}
          orientation="horizontal"
          style={{ paddingTop: 20, borderColor: "#8E8E8E" }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "300",
            padding: 20,
            paddingLeft: 10,
          }}
        >
          Today
        </Text>
        <View
          style={[
            styles.buttonContainer,
            { marginBottom: showCheckboxes ? 20 : 0 },
          ]}
        >
          {showCheckboxes && (
            <TouchableOpacity
              onPress={() => {
                if (allSelected) {
                  setSelectedNotifications([]);
                  setAllSelected(false);
                } else {
                  setSelectedNotifications(
                    notifications.map((notification) => notification.id)
                  );
                  setAllSelected(true);
                }
              }}
              style={styles.selectButton}
            >
              <Text style={{ color: "white" }}>
                {allSelected ? "Select None" : "Select All"}
              </Text>
            </TouchableOpacity>
          )}
          {selectedNotifications.length > 0 && (
            <TouchableOpacity
              onPress={async () => {
                setDeleting(true); // Set deleting to true before the deletion
                await Promise.all(
                  selectedNotifications.map(async (id) => {
                    const notification = notifications.find(
                      (notification) => notification.id === id
                    );
                    if (notification.id) {
                      await deleteDoc(
                        doc(db, "notifications", notification.id)
                      );
                    } else {
                      console.error("Notification ID is undefined");
                    }
                  })
                );
                setSelectedNotifications([]);
                setDeleting(false);
                setShowCheckboxes(false);
                fetchNotifications();
              }}
            >
              {deleting ? (
                <ActivityIndicator size="large" color="#EC6F56" />
              ) : (
                <Iconify
                  icon="material-symbols:delete"
                  size={30}
                  color={"red"}
                />
              )}
            </TouchableOpacity>
          )}
          {showCheckboxes && (
            <TouchableOpacity
              onPress={() => {
                setSelectedNotifications([]);
                setShowCheckboxes(false);
              }}
            >
              <Iconify icon="mingcute:close-fill" size={30} />
            </TouchableOpacity>
          )}
        </View>
        <Text>{renderNotifications()}</Text>
      </ScrollView>
      {notifications.length > 0 ? (
        <TouchableOpacity
          onPress={async () => {
            if (notifications.length > 0) {
              const userId = await getCurrentUserId();
              const notificationsCollection = collection(db, "notifications");
              const q = query(
                notificationsCollection,
                where("receiverId", "==", userId)
              );

              const notificationsQuerySnapshot = await getDocs(q);

              notificationsQuerySnapshot.forEach(async (docSnapshot) => {
                const notificationRef = doc(
                  db,
                  "notifications",
                  docSnapshot.id
                );
                await updateDoc(notificationRef, { read: true });
              });

              setNotifications(
                notifications.map((notification) => ({
                  ...notification,
                  backgroundColor: "white",
                  read: true,
                }))
              );
            }
          }}
          style={styles.readButton}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Mark All as Read
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export const registerForPushNotificationsAsync = async () => {
  let token;
  const userToken = await AsyncStorage.getItem("userToken");
  const userId = await getCurrentUserId();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      sound: true,
      importance: Notifications.AndroidImportance.MAX,
      bypassDnd: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      priority: Notifications.AndroidNotificationPriority.MAX,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      enableLights: true,
    });
  } else {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "4908418d-b286-4faa-935d-4f712f2f41a9",
      })
    ).data;
    console.log(token);
    axios
      .post(
        `${BASE_URL2}/post/customers/storeExpoPushToken/${userId}`,
        {
          expoPushToken: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error sending request:", error);
      });
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    backgroundColor: "white",
  },

  text: {
    fontSize: 20,
    fontWeight: "500",
  },

  notificationContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: "auto",
    width: 320,
  },

  readButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EC6F56",
    width: 335,
    height: 59,
    borderRadius: 30,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  selectButton: {
    height: 30,
    width: 100,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
});
