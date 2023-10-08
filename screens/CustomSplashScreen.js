import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={require("../assets/img/ads/logo-e.jpg")}
        />
        <Text style={styles.title}>
          E-<Text style={styles.highlightedText}>PHARMASCRIPTS</Text>
        </Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center", // Center content horizontally
  },
  logo: {
    width: width * 0.6, // Adjust the scaling factor as needed
    height: width * 0.5, // Maintain aspect ratio (square image)
    resizeMode: "contain",
  },
  title: {
    fontSize: 25,
    color: "black",
    fontWeight: "bold",
    textAlign: "center", // Center text horizontally
    marginTop: 15, // Adjust this value for vertical spacing
  },
  highlightedText: {
    color: "#EC6F56",
  },
});

export default CustomSplashScreen;
