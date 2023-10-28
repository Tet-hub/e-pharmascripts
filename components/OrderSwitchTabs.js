import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DiarySwitchTabs = ({
  selectionMode,
  option1,
  option2,
  option3,
  option4,
  option5,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updateSwitchData = (value) => {
    setSelectionMode(value);
    onSelectSwitch(value);
  };

  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(1)}
        style={{
          ...styles.designTO,
          backgroundColor: getSelectionMode == 1 ? "#EC6F56" : "white",
        }}
      >
        <Text
          style={{
            ...styles.designText,
            color: getSelectionMode == 1 ? "white" : "black",
          }}
        >
          {option1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(2)}
        style={{
          ...styles.designTO,
          backgroundColor: getSelectionMode == 2 ? "#EC6F56" : "white",
        }}
      >
        <Text
          style={{
            ...styles.designText,
            color: getSelectionMode == 2 ? "white" : "black",
          }}
        >
          {option2}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(3)}
        style={{
          ...styles.designTO,
          backgroundColor: getSelectionMode == 3 ? "#EC6F56" : "white",
        }}
      >
        <Text
          style={{
            ...styles.designText,
            color: getSelectionMode == 3 ? "white" : "black",
          }}
        >
          {option3}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(4)}
        style={{
          ...styles.designTO,
          backgroundColor: getSelectionMode == 4 ? "#EC6F56" : "white",
        }}
      >
        <Text
          style={{
            ...styles.designText,
            color: getSelectionMode == 4 ? "white" : "black",
          }}
        >
          {option4}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(5)}
        style={{
          ...styles.designTO,
          backgroundColor: getSelectionMode == 5 ? "#EC6F56" : "white",
        }}
      >
        <Text
          style={{
            ...styles.designText,
            color: getSelectionMode == 5 ? "white" : "black",
          }}
        >
          {option5}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiarySwitchTabs;

const styles = StyleSheet.create({
  tabsContainer: {
    height: 37,
    width: "97%",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  designText: {
    fontSize: 8,
    fontWeight: 400,
    color: "#7A7A7A",
  },
  designTO: {
    flex: 1,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
});
