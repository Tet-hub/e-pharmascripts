import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { db } from "../firebase/firebase";
import { onSnapshot, collection } from "firebase/firestore/lite";
import { setupFirestoreListener } from "../database/component/realTimeListener";

const TestScreen = () => {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    // Set up the Firestore real-time listener for the 'pharmacies' collection
    const unsubscribe = setupFirestoreListener("pharmacy", (data) => {
      // Callback function that updates the state with the fetched or updated data
      setPharmacies(data);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text>Pharmacy Screen</Text>
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.companyName}</Text>
            {/* Render other pharmacy data as needed */}
          </View>
        )}
      />
    </View>
  );
};

export default TestScreen;
