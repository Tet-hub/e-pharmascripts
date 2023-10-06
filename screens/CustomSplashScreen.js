// CustomSplashScreen.js
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const CustomSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/img/lologo.png")} />
      <Text style={{ fontSize: 25, color: "black", fontWeight: 700 }}>
        E-<Text style={{ color: "#EC6F56" }}>PHARMASCRIPTS</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "50%",
    // height: "50%",
    resizeMode: "contain",
  },
});

export default CustomSplashScreen;
