import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";

import { Iconify } from "react-native-iconify";
import { Colors } from "../../components/styles";
import { StatusBar } from "expo-status-bar";
// import { useUserId } from "../src/api/userIDContext";
import { authentication } from "../../firebase/firebase";
import { getAuthToken } from "../../src/api/authToken";
import { db } from "../../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";
import { fetchUserData } from "../../database/backend";
const { bodyGray } = Colors;
const { orange } = Colors;
import styles from "./stylesheet";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  // const userId = useUserId(); // Assuming useUserId() returns a valid user ID
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId; // Get userId from AsyncStorage

        if (userId) {
          const userData = await fetchUserData(userId, "users");
          // console.log("userId", userId);
          if (userData) {
            setUser(userData);
            // console.log("userdata", userData);
          }
        }
      } catch (error) {
        // console.log("error in profilescreen");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfileScreen = () => {
    // Navigate to my order screen
    navigation.navigate("EditProfileScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <StatusBar backgroundColor="white" />
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.pic_cont}>
          {user && user.img ? (
            <Image
              source={{ uri: user.img }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Image
              source={require("../../assets/img/default-image.jpg")}
              className="w-full h-full rounded-full"
            />
          )}
        </View>
        <View style={styles.nameGmailButton}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : user ? (
            <>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.gmail}>{user.email}</Text>
            </>
          ) : (
            <Text>User data not available</Text>
          )}
          <TouchableOpacity onPress={handleEditProfileScreen}>
            <Text style={styles.editButton}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.line} />

        <View style={styles.lowerContainer}>
          <TouchableOpacity onPress>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify icon="codicon:account" size={22} color="black" />
              </View>
              <Text style={styles.viewContText}>Account</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify icon="ion:location-outline" size={22} color="black" />
              </View>
              <Text style={styles.viewContText}>Address</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="mdi:security-lock-outline"
                  size={22}
                  color="black"
                />
              </View>
              <Text style={styles.viewContText}>Security</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="iconamoon:notification"
                  size={22}
                  color="black"
                />
              </View>
              <Text style={styles.viewContText}>Notifications</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.line2} />
          <TouchableOpacity onPress>
            <View style={styles.viewCont} className="mt-2">
              <View style={styles.iconsBG}>
                <Iconify icon="ic:outline-delete" size={22} color="black" />
              </View>
              <Text style={styles.viewContText}>Delete Account</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
