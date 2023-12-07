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
  Image,
  Modal,
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
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebase";
import {
  getCurrentUserId,
  getCurrentEmail,
  getCurrentCustomerName,
} from "../../src/authToken";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, uploadBytes, ref } from "@firebase/storage";
import { useFocusEffect } from "@react-navigation/native";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const { name, sellerId, img, sellerBranch } = route.params;

  useEffect(() => {
    // Call the getUserId function and set the result to the state variable
    getCurrentUserId().then((id) => setUserId(id));
    getCurrentEmail().then((id) => setEmail(id));
  }, []);
  useEffect(() => {
    const fetchCustomerName = async () => {
      const name = await getCurrentCustomerName();
      setCustomerName(name);
    };

    fetchCustomerName();
  }, []);

  //console.log(`seller img url: ${img}`);
  useFocusEffect(
    React.useCallback(() => {
      const fetchMessages = async () => {
        try {
          const authToken = await getAuthToken();
          const currentUserId = authToken.userId;

          const messagesCollection = collection(db, "messages");

          const messagesQuery = query(
            messagesCollection,
            orderBy("timestamp", "desc"),
            where("senderId", "in", [currentUserId, sellerId]),
            where("receiverId", "in", [currentUserId, sellerId])
          );

          const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messageData = [];
            snapshot.forEach((doc) => {
              messageData.push({ id: doc.id, ...doc.data() });
            });

            setMessages(messageData);
          });

          return () => unsubscribe();
        } catch (error) {
          console.log("Error fetching messages:", error);
        }
      };

      (async () => {
        await fetchMessages();
      })();

      // Ensure that you don't return anything from the callback.
    }, [sellerId])
  );

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const authToken = await getAuthToken();
      const userId = authToken.userId;

      await sendMessage(newMessage, sellerId);
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };
  const sameDate = (date1, date2) => {
    if (!date1 || !date2) {
      return false;
    }
    const d1 = new Date(date1.seconds * 1000);
    const d2 = new Date(date2.seconds * 1000);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const handleImageUpload = async () => {
    try {
      //convert console.error to console.log
      const originalConsoleWarn = console.warn;
      console.warn = (...args) => {
        if (
          args.length > 0 &&
          typeof args[0] === "string" &&
          args[0].includes(
            'Key "cancelled" in the image picker result is deprecated'
          )
        ) {
          console.log("Filtered warning:", args[0]);
        } else {
          originalConsoleWarn.apply(console, args);
        }
      };

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      // Restore the original console.warn after the ImagePicker call
      console.warn = originalConsoleWarn;

      // Check if the user canceled the image picker
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setSelectedImageUrl(selectedAsset.uri);
      }

      // Check if assets array is defined and not empty
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        if (imageUri) {
          console.log("Image URI to upload:", imageUri);
          const downloadUrl = await uploadImageToFirebase(imageUri);
          sendMessage("", sellerId, downloadUrl);
        } else {
          console.log("Image URI is undefined");
        }
      } else {
        console.log("No assets selected from the image picker");
      }
    } catch (error) {
      console.log("Error picking an image:", error);
    }
  };

  const uploadImageToFirebase = async (imageUri) => {
    console.log("Image URI to upload:", imageUri);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = `${Date.now()}-${Math.random()}.jpg`;
      const reference = ref(storage, `messagesImage/${imageName}`);

      await uploadBytes(reference, blob);

      const downloadUrl = await getDownloadURL(reference);

      console.log("Download URL:", downloadUrl);

      return downloadUrl;
    } catch (error) {
      console.log("Error uploading image to Firebase Storage:", error);
    }
  };

  const sendMessage = async (messageText, receiverId, imageUri) => {
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
        customerId: userId,
        timestamp: new Date(),
        userEmail: email,
        userFullName: customerName,
        sellerBranch: sellerBranch,
      };

      if (imageUri) {
        message.messageImg = imageUri;
      }

      await addDoc(messagesCollection, message);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUrl(null);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            {/* Check if it's the first item or if the date has changed */}
            {index === 0 ||
            !sameDate(messages[index - 1].timestamp, item.timestamp) ? (
              <View style={styles.dateDivider}>
                <Text style={styles.dateText}>
                  {item.timestamp &&
                    new Date(
                      item.timestamp.seconds * 1000
                    ).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
            <View
              style={[
                styles.messageContainer,
                item.senderId === userId
                  ? styles.yourMessage
                  : styles.otherMessage,
              ]}
            >
              {/* Check if the message has an image */}
              {item.messageImg ? (
                <TouchableOpacity
                  onPress={() => handleImagePress(item.messageImg)}
                >
                  <Image
                    source={{ uri: item.messageImg }}
                    style={styles.imageStyle}
                  />
                </TouchableOpacity>
              ) : (
                // Render text if there is no image
                <Text style={styles.messageText}>{item.message}</Text>
              )}
              <Text style={styles.timestampText}>
                {item.timestamp &&
                  new Date(item.timestamp.seconds * 1000).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
              </Text>
            </View>
          </View>
        )}
        inverted={true}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedImageUrl }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.sendMessageCont}
      >
        <View style={styles.inputContainer}>
          <Iconify
            icon="mdi:image-outline"
            size={22}
            style={styles.icons}
            onPress={handleImageUpload}
          />
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
