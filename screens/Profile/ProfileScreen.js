import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Iconify } from "react-native-iconify";
import { StatusBar } from "expo-status-bar";
import { getAuthToken } from "../../src/authToken";
import styles from "./stylesheet";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const isStatusBarWhite = true;
  const [isLoading, setLoading] = useState(true);
  const [CurrentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fetchedStatus, setFetchedStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId;
        setCurrentUserId(userId);

        if (userId) {
          // Firestore real-time listener
          const userRef = doc(db, "customers", userId);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              setUser(data);

              if (data.profileImage) {
                setProfileImage(data.profileImage);
              }
              if (data.status) {
                setFetchedStatus(data.status);
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

  const handlePressAccount = () => {
    navigation.navigate("EmailScreen");
  };

  const handlePressAddress = () => {
    navigation.navigate("AddressScreen");
  };

  const handlePressSecurity = () => {
    navigation.navigate("SecurityScreen");
  };

  const handlePressDeleteAccount = () => {
    navigation.navigate("TestScreen");
  };
  // useEffect(() => {
  //   if (isDataLoaded && fetchedStatus !== "Verified") {
  //     setDataLoaded(true);
  //   }
  // }, [isDataLoaded, fetchedStatus]);
  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadCont}>
          <View style={styles.loadingContainer}>
            {/* // <View style={styles.loadingContainer}> */}
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          </View>
        </View>
      ) : (
        <View style={styles.insideContainer}>
          <StatusBar backgroundColor="white" />
          {/* <StatusBar
            style={isStatusBarWhite ? "light" : "dark"}
            backgroundColor={isStatusBarWhite ? "black" : "white"}
          /> */}
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
            {user && !isLoading ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {fetchedStatus === "Verified" && (
                    <View style={styles.verifiedCheckView}>
                      <View>
                        <Iconify
                          size={20}
                          icon="material-symbols:verified"
                          color="#0CB669"
                          style={{ marginRight: 3 }}
                        />
                      </View>
                    </View>
                  )}
                  <Text style={styles.name}>
                    {user.firstName} {user.lastName}
                  </Text>
                </View>
                <Text style={styles.gmail}>{user.email}</Text>
              </>
            ) : (
              <Text>User data not available</Text>
            )}
            <View style={styles.statusView}>
              {fetchedStatus !== "Verified" && (
                <Text style={styles.statusText}>
                  {fetchedStatus ? fetchedStatus : "Unverified"}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleEditProfileScreen}>
              <Text style={styles.editButton}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.line} />

          <View style={styles.lowerContainer}>
            <TouchableOpacity onPress={handlePressAccount}>
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

            <TouchableOpacity onPress={handlePressAddress}>
              <View style={styles.viewCont}>
                <View style={styles.iconsBG}>
                  <Iconify
                    icon="ion:location-outline"
                    size={22}
                    color="black"
                  />
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

            <TouchableOpacity onPress={handlePressSecurity}>
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
            <TouchableOpacity>
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
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
