import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export const LoadingComponent = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#EC6F56" />
    </View>
  );
};

export const useIsDeleting = () => {
  const [isDeleting, setIsDeleting] = useState(false);

  const startDeleting = () => {
    setIsDeleting(true);
  };

  const stopDeleting = () => {
    setIsDeleting(false);
  };

  return { isDeleting, startDeleting, stopDeleting };
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: add a semi-transparent background behind the loader
  },
});
