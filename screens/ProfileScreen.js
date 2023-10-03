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
import { Colors } from "../components/styles";
import { StatusBar } from "expo-status-bar";
// import { useUserId } from "../src/api/userIDContext";
import { authentication } from "../firebase/firebase";
import { getAuthToken } from "../src/api/authToken";
import { db } from "../firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore/lite";
import { fetchUserData } from "../database/backend";
const { bodyGray } = Colors;
const { orange } = Colors;

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
              source={require("../assets/img/default-image.jpg")}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderRadius: 20,
    flex: 1,
  },
  insideContainer: {
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Center items horizontally
    width: "100%",
  },
  lowerContainer: {
    width: "80%",
    marginTop: 15,
  },
  pic_cont: {
    width: 100,
    height: 100,
    marginTop: 15,
  },
  save_cont: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    marginTop: 20,
  },
  nameGmailButton: {
    marginTop: 15,
    alignItems: "center",
  },
  name: {
    fontWeight: 600,
    fontSize: 18,
  },
  gmail: {
    fontWeight: 400,
    fontSize: 10,
    color: "#8E8E8E",
  },
  editButton: {
    marginTop: 15,
    fontWeight: 600,
    fontSize: 14,
    color: "white",
    backgroundColor: "#EC6F56",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 30,
  },
  line: {
    height: 0.4,
    width: "80%",
    marginTop: 20,
    backgroundColor: "#8E8E8E",
  },
  line2: {
    height: 0.5,
    width: "100%",
    marginTop: 20,
    backgroundColor: "#8E8E8E",
  },
  viewCont: {
    flexDirection: "row", // Arrange icons and text horizontally
    alignItems: "center", // Align items vertically within the container
    justifyContent: "flex-start", // Spread elements apart
    paddingHorizontal: 10, // Add some horizontal spacing
  },
  viewContText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 13,
    marginVertical: 15,
  },
  arrowIcon: {
    flex: 1, // Distribute remaining space
    alignItems: "flex-end", // Align icon to the end of the flex container
    marginLeft: "auto",
    marginRight: -10,
  },
  iconsBG: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
});
