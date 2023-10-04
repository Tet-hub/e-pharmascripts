import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Use the appropriate icon family
import styles from "../Home/stylesheet";

const RateScreen = () => {
  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [pharmacyRating, setPharmacyRating] = useState(0); // Initialize pharmacy rating to 0 stars
  const [deliveryRating, setDeliveryRating] = useState(0); // Initialize delivery rating to 0 stars

  const handleStarPress = (selectedRating, type) => {
    // Handle when a star is pressed for pharmacy or delivery
    if (type === "pharmacy") {
      setPharmacyRating(selectedRating);
    } else if (type === "delivery") {
      setDeliveryRating(selectedRating);
    }
  };

  return (
    <View style={[styles.container, { height: deviceHeight - 55 }]}>
      <View style={styles.containerRate}>
        <Text style={styles.productName}>Zynapse 1G Tablet</Text>
        <Text style={styles.rateInstruction}>
          Give an overall rating of your experience
        </Text>
        <View style={styles.separator} />

        <View style={styles.starContainer}>
          <Text style={styles.rateText}>Pharmacy rate:</Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star, "pharmacy")}
                style={styles.star}
              >
                <Icon
                  name="star"
                  size={25}
                  color={star <= pharmacyRating ? "#FAC63E" : "grey"} // Change color based on the rating
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.starContainer}>
          <Text style={styles.rateText}>Delivery rate:</Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star, "delivery")}
                style={styles.star}
              >
                <Icon
                  name="star"
                  size={25}
                  color={star <= deliveryRating ? "#FAC63E" : "grey"} // Change color based on the rating
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitContainer}>
          <Text style={styles.submitText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RateScreen;
