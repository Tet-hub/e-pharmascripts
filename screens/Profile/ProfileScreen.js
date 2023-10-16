import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Iconify } from "react-native-iconify";
import { StatusBar } from "expo-status-bar";
import { getAuthToken } from "../../src/authToken";
import styles from "./stylesheet";
import { EMU_URL, BASE_URL, API_URL } from "../../src/api/apiURL";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [CurrentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [status, setStatus] = useState("Unverified");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId;
        setCurrentUserId(userId);

        if (userId) {
          // Firestore real-time listener
          const userRef = doc(db, "users", userId);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUser(data);

              if (data.profileImage) {
                setProfileImage(data.profileImage);
              }
              if (data.status) {
                setStatus(data.status);
              }
            }
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditProfileScreen = () => {
    navigation.navigate("EditProfileScreen", { userID: CurrentUserId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.insideContainer}>
        <StatusBar backgroundColor="white" />
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.pic_cont}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Image
              source={require("../../assets/img/default-image.jpg")}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          )}
        </View>
        <View style={styles.nameGmailButton}>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : user ? (
            <>
              {status === "Verified" ? (
                <View style={styles.verifiedCheckView}>
                  <View>
                    <Image
                      source={require("../../assets/img/verified.png")}
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: 50,
                        marginRight: 5,
                      }}
                    />
                  </View>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>
                </>
              )}
              <Text style={styles.gmail}>{user.email}</Text>
            </>
          ) : (
            <Text>User data not available</Text>
          )}
          <View style={styles.statusView}>
            {status !== "Verified" ? (
              <Text style={styles.statusText}>
                {status ? status : "Unverified"}
              </Text>
            ) : null}
          </View>
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
    </ScrollView>
  );
};

export default ProfileScreen;
