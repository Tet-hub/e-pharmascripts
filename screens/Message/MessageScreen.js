import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image, // Import Image component
} from "react-native";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";
import styles from "./stylesheet";

const MessageScreen = ({ navigation }) => {
  // Simulated chat list data (replace with actual data)
  const chatList = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hello there!",
      timestamp: "10:30 AM",
      image: require("../../assets/img/cymer.jpg"),
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "How are you doing?",
      timestamp: "11:45 AM",
      image: require("../../assets/img/cymer.jpg"),
    },
    // Add more chat items here
  ];

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
            onPress={
              () =>
                navigation.navigate("ChatScreen", {
                  name: item.name,
                  image: item.image,
                })
              // navigation.navigate("Home")
            }
          >
            <View style={styles.chatContent}>
              <Image source={item.image} style={styles.chatImage} />
              <View style={styles.chatText}>
                <Text style={styles.chatName}>{item.name}</Text>
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
