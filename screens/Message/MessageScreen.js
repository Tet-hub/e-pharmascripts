import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Iconify } from "react-native-iconify";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { TextInput } from "react-native-gesture-handler";
import styles from "./stylesheet";
import { getCurrentUserId } from "../../src/authToken";

const MessageScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sellerImage, setSellerImage] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const DefaultImage = require("../../assets/img/default-image.jpg");
  //get userID
  useEffect(() => {
    getCurrentUserId().then((id) => setUserId(id));
  }, []);
  //console.log(`UserId: ${userId}`);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const userId = await getCurrentUserId(); // Get the current user's ID using await

        if (userId) {
          // Create a query to get messages where the current user is either the sender or receiver, ordered by timestamp
          const chatQuery = query(
            messagesCollection,
            orderBy("timestamp", "desc"),
            where("userId", "==", userId)
          );

          // Create a real-time listener
          const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
            const latestMessagesMap = new Map();

            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const otherUserId =
                userId === data.senderId ? data.receiverId : data.senderId;

              if (!latestMessagesMap.has(otherUserId)) {
                latestMessagesMap.set(otherUserId, {
                  id: doc.id,
                  sellerName: data.sellerName,
                  lastMessage: data.message,
                  sellerId: data.sellerId,
                  img: data.img,
                  timestamp: new Date(
                    data.timestamp.seconds * 1000
                  ).toLocaleTimeString(),
                });
              }
              setSellerId(sellerId);
            });

            // Convert the map values to an array and set it as the chatList state
            const updatedChatList = Array.from(latestMessagesMap.values());
            setChatList(updatedChatList);
          });

          // Return a cleanup function to unsubscribe from the listener when the component unmounts
          return () => {
            unsubscribe();
          };
        }
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    fetchChatList();
  }, []);

  // Get screen dimensions
  const { width } = Dimensions.get("window");

  // Calculate dynamic padding based on screen width
  const dynamicPadding = Math.min(16, width * 0.05);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.horizontalLine} />
      </View>
      <View className="items-center flex-row mt-5 ml-3 mr-3 ">
        <View style={styles.searchFilterCont}>
          <View style={styles.searchCont}>
            <Iconify icon="circum:search" size={22} style={styles.iconSearch} />
            <TextInput placeholder="Search branch" />
          </View>
        </View>
      </View>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chatItem,
              { paddingHorizontal: dynamicPadding }, // Add padding here
            ]}
            onPress={() =>
              navigation.navigate("ChatScreen", {
                name: item.sellerName,
                sellerId: item.sellerId,
                img: item.img,
              })
            }
          >
            <View style={styles.chatContent}>
              <View className="w-12 h-12 ml-3 mr-5">
                {item.img ? (
                  <Image
                    source={{ uri: item.img }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Image
                    source={DefaultImage}
                    style={styles.pic_cont}
                    className="w-full h-full rounded-full"
                  />
                )}
              </View>
              <View style={styles.chatText}>
                <Text style={styles.chatName}>{item.sellerName}</Text>
                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
              </View>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MessageScreen;
