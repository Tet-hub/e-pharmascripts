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
  doc,
  getDoc,
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const DefaultImage = require("../../assets/img/default-image.jpg");
  //get userID
  useEffect(() => {
    getCurrentUserId().then((id) => setUserId(id));
  }, []);
  //console.log(`UserId: ${userId}`);

  // Filtered chat list based on searchKeyword
  const filteredChatList = chatList.filter((item) =>
    item.sellerBranch.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Function to handle search input change
  const handleSearch = (text) => {
    setSearchKeyword(text);
  };

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const userId = await getCurrentUserId();

        if (userId) {
          const chatQuery = query(
            messagesCollection,
            orderBy("timestamp", "desc"),
            where("customerId", "==", userId)
          );

          const unsubscribe = onSnapshot(chatQuery, async (querySnapshot) => {
            const latestMessagesMap = new Map();

            for (const doc of querySnapshot.docs) {
              const data = doc.data();
              const otherUserId =
                userId === data.senderId ? data.receiverId : data.senderId;

              const messageDate = new Date(data.timestamp.seconds * 1000);
              const currentDate = new Date();

              let timestamp;

              if (
                messageDate.getDate() === currentDate.getDate() &&
                messageDate.getMonth() === currentDate.getMonth() &&
                messageDate.getFullYear() === currentDate.getFullYear()
              ) {
                timestamp = new Date(
                  data.timestamp.seconds * 1000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
              } else {
                timestamp = new Date(
                  data.timestamp.seconds * 1000
                ).toLocaleDateString();
              }

              if (!latestMessagesMap.has(otherUserId)) {
                latestMessagesMap.set(otherUserId, {
                  id: doc.id,
                  sellerName: data.sellerName,
                  lastMessage: data.message,
                  sellerId: data.sellerId,
                  sellerBranch: data.sellerBranch,
                  img: data.img,
                  timestamp: timestamp,
                });
                setSellerId(data.sellerId);
                console.log("seller", data.sellerId);
              }
            }

            for (const [otherUserId, message] of latestMessagesMap.entries()) {
              try {
                const sellerId = message.sellerId;
                const sellersCollection = collection(db, "sellers");
                const sellerDocRef = doc(sellersCollection, sellerId);
                const sellerDocSnapshot = await getDoc(sellerDocRef);

                if (sellerDocSnapshot.exists()) {
                  const sellerData = sellerDocSnapshot.data();
                  const sellerImage = sellerData.img;

                  // Update the message object with seller image
                  message.img = sellerImage;

                  // Now set the state for chatList with updated message data
                  const updatedChatList = Array.from(
                    latestMessagesMap.values()
                  );
                  setChatList(updatedChatList);
                  console.log(
                    "Seller document not found for sellerId:",
                    updatedChatList
                  );
                } else {
                  console.log(
                    "Seller document not found for sellerId:",
                    sellerId
                  );
                }
              } catch (error) {
                console.error("Error fetching seller data:", error);
              }
            }
          });

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

  //show search icon
  const renderSearchIcon = () => {
    return (
      <Text style={styles.searchButtonIcon}>
        <Iconify icon="iconoir:search" size={22} color="gray" />
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.horizontalLine} />
      </View>
      <View className="items-center flex-row mt-5 ml-3 mr-3 ">
        <View style={styles.searchCont}>
          <View style={styles.searchTexInputView}>
            <TextInput
              placeholder="Search branch"
              value={searchKeyword}
              onChangeText={handleSearch}
              style={styles.searchBranchInput}
            />
          </View>
          {renderSearchIcon()}
        </View>
      </View>
      {filteredChatList.length === 0 ? (
        <View style={styles.noMatchContainer}>
          <Text style={styles.noMatchText}>No matched results</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chatItem, { paddingHorizontal: dynamicPadding }]}
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  sellerId: item.sellerId,
                  sellerBranch: item.sellerBranch,
                  img: item.img,
                  name: item.sellerName,
                })
              }
            >
              <View style={styles.chatContent}>
                <View className="w-12 h-12 ml-2 mr-5">
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
                  <Text
                    style={styles.chatName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.sellerBranch}
                  </Text>

                  {/* Display "Sent an image" if there is no messageText */}
                  <Text style={styles.lastMessage}>
                    {item.lastMessage ? (
                      item.lastMessage
                    ) : (
                      <Text style={{ fontStyle: "italic" }}>Sent an image</Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MessageScreen;
