import {
  View,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import styles from "./addressStyle";
import {
  addDoc,
  setDoc,
  doc,
  getDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { ScrollView } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";

const AccountScreen = () => {
  const apiKey = "AIzaSyAErVuJDetH9oqE36Gx_sBDBv2JIUbXcJ4"; // Replace with your API key
  const address1 = "93 Juana Osmeña Street, Cebu City, Cebu, Philippines";
  const addresses = [
    "Luka, Oslob, Cebu, Philippines",
    "6000 Mabini St, Cebu City, 6000 Cebu",
    "Magallanes St, Cebu City, 6000 Cebu",
  ];

  const [distances, setDistances] = useState({});

  useEffect(() => {
    // Function to fetch distance for a single address
    const fetchDistance = async (origin, destination) => {
      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          origin
        )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status === "OK" && data.rows.length > 0) {
          const distanceText = data.rows[0].elements[0].distance.text;
          return distanceText;
        } else {
          console.error(
            "Error fetching distance data for",
            origin,
            data.status
          );
          return null;
        }
      } catch (error) {
        console.error("Error fetching distance data for", origin, error);
        return null;
      }
    };

    // Fetch distances for each address
    const fetchDistances = async () => {
      const distancePromises = addresses.map((address) =>
        fetchDistance(address1, address)
      );
      const distances = await Promise.all(distancePromises);

      const distancesObject = {};
      addresses.forEach((address, index) => {
        distancesObject[address] = distances[index];
      });

      setDistances(distancesObject);
    };

    fetchDistances();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Test Address</Text>
      <View style={styles.line} />
      {Object.entries(distances).map(([address, distance]) => (
        <View key={address}>
          <Text>
            Distance from {address1} to {address}: {distance}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default AccountScreen;
