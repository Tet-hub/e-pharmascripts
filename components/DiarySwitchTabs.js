import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DiarySwitchTabs = ({
  selectionMode,
  option1,
  option2,
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
        style={{...styles.maintenanceTO, backgroundColor: getSelectionMode == 1 ? "#EC6F56" : "white" }}
      >
        <Text style={{...styles.maintenanceText, color: getSelectionMode == 1 ? "white" : "black" }}>
          {option1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => updateSwitchData(2)}
        style={{...styles.stockTO, backgroundColor: getSelectionMode == 2 ? "#EC6F56" : "white" }}
      >
        <Text style={{...styles.maintenanceText, color: getSelectionMode == 2 ? "white" : "black" }}>
          {option2}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DiarySwitchTabs;

const styles = StyleSheet.create({
    tabsContainer:{
        height: 44,
        width: "90%",
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    maintenanceText:{
        fontSize: 13,
        fontWeight: 500,
    },
    stockText:{
        fontSize: 13,
        fontWeight: 500,
    },
    maintenanceTO:{
        flex: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderRadius: 25,
    },
    stockTO:{
        flex: 1,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
    },

});