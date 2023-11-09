import { View, Text, Image } from "react-native";
import React from "react";

const TermsConditions = () => {
  return (
    <View>
      <View>
        <Text className="px-2 mt-5 ml-2 text-lg font-bold">Notification</Text>
        <Text style={{ color: "gray", fontSize: 16, marginBottom: 10 }}>
          Today
        </Text>
      </View>
    </View>
  );
};

export default TermsConditions;
