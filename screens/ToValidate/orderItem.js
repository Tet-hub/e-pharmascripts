import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./stylesheet";

const renderOrderItems = ({ item, quantity }) => {
  return (
    <View key={item.id}>
      <View style={styles.productContainer}>
        <View style={styles.imageContainer}>
          {item.img ? (
            <Image source={{ uri: item.img }} style={styles.productImage} />
          ) : (
            <Image
              source={require("../../assets/img/default-image.jpg")}
              style={styles.productImage}
            />
          )}
        </View>
        <View style={styles.productInfoContainer}>
          <View>
            <Text
              style={styles.productName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.productName}
            </Text>
            {item.requiresPrescription === "Yes" ? (
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            ) : (
              <Text style={styles.productReq}></Text>
            )}
          </View>
          <View style={styles.priceRowContainer}>
            <Text style={styles.productPrice}>
              {"\u20B1"}
              {item.price}
            </Text>

            <Text style={styles.productAmount}>
              {"x"}
              {item.quantity ? item.quantity : quantity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default renderOrderItems;
