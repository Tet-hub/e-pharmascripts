import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";
import { getAuthToken } from "../../src/authToken";
import { BASE_URL } from "../../src/api/apiURL";
import {
  collection,
  doc,
  serverTimestamp,
  addDoc,
  query,
  orderBy,
  getDocs,
  where,
  onSnapshot,
  subcollection,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getCurrentUserId } from "../../src/authToken";
import { getCurrentEmail } from "../../src/authToken";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [scrollToEnd, setScrollToEnd] = useState(true);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Call the getUserId function and set the result to the state variable
    getCurrentUserId().then((id) => setUserId(id));
    getCurrentEmail().then((id) => setEmail(id));
  }, []);
  console.log(`userid now: ${userId}`);
  console.log(`email now: ${email}`);

  // Access the sellerId from route.params
  const { name, sellerId, img } = route.params;
  console.log(`seller img url: ${img}`);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesCollection = collection(db, "messages");
        const messagesQuery = query(
          messagesCollection,
          orderBy("timestamp", "asc"),
          where("senderId", "in", [userId, sellerId]),
          where("receiverId", "in", [userId, sellerId])
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const messageData = [];
          snapshot.forEach((doc) => {
            messageData.push({ id: doc.id, ...doc.data() });
          });

          setMessages(messageData);

          // Scroll to the end of the list when new messages arrive
          if (scrollToEnd && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [userId, sellerId, scrollToEnd]);

  const sendMessage = async (messageText, receiverId) => {
    try {
      const messagesCollection = collection(db, "messages");
      const authToken = await getAuthToken();
      const senderId = authToken.userId;

      // Create a new message document in the "messages" collection with an auto-generated ID
      const message = {
        senderId: senderId,
        receiverId: receiverId,
        message: messageText,
        sellerName: name,
        sellerId: sellerId,
        userId: userId,
        timestamp: new Date(),
        userEmail: email,
        // img: img,
      };

      await addDoc(messagesCollection, message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const authToken = await getAuthToken();
      const userId = authToken.userId;

      await sendMessage(newMessage, sellerId);
      setNewMessage("");

      // Set scrollToEnd to true to scroll to the end when a new message is sent
      setScrollToEnd(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Assign the ref to the FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.senderId === userId
                ? styles.yourMessage
                : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestampText}>
              {item.timestamp &&
                new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>
        )}
        onLayout={() => {
          // Scroll to the end when the FlatList layout changes
          if (scrollToEnd && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sendMessageCont}
      >
        <View style={styles.inputContainer}>
          <Iconify
            icon="fluent:emoji-48-regular"
            size={22}
            style={styles.icons}
          />
          <Iconify icon="mdi:image-outline" size={22} style={styles.icons} />
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
          />
        </View>
        <View style={styles.sendButtonContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Iconify icon="bi:send-fill" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
