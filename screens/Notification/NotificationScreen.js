import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import styles from "./stylesheet";

const NotificationItem = ({ imageSource, title, description }) => (
  <View style={styles.notificationItem}>
    <Image source={imageSource} style={styles.notificationImage} />
    <View style={styles.notificationTextContainer}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
    </View>
  </View>
);

const NotificationScreen = () => {
  const notifications = [
    {
      imageSource: require("../../assets/img/amlodipine.png"),
      title: "Order has been delivered",
      description:
        "Your order has already been delivered. You can buy whenever you want again.",
    },
    {
      imageSource: require("../../assets/img/amlodipine.png"),
      title: "Order Received?",
      description:
        "Please do not forget to rate, review, and provide feedback as it is important for our system.",
    },
    // ... Add more notification objects as needed
  ];

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <Text style={styles.textTitle}>Notifications</Text>
        <View style={styles.line} />
        <Text style={styles.textTime}>Today</Text>
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            imageSource={notification.imageSource}
            title={notification.title}
            description={notification.description}
          />
        ))}
      </View>
    </View>
  );
};

export default NotificationScreen;
