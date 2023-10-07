import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Extract the recipient's name from the route parameters
  const { name, image } = route.params;

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Create a new message object and add it to the messages state
    const message = {
      text: newMessage,
      sender: "You", // Change this to the actual sender's name
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Header displaying recipient's name */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
      </View> */}

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === "You" ? styles.yourMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </View>
        )}
      />
      <View style={styles.centeredContainer}>
        <View style={styles.sendMessageCont}>
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
              <Iconify
                icon="bi:send-fill"
                size={26}
                style={styles.sendButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;
