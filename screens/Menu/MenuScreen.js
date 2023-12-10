import { View, Image, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../src/context";
import { getAuthToken } from "../../src/authToken";
import styles from "./stylesheet";
import { EMU_URL, BASE_URL, API_URL } from "../../src/api/apiURL";

const defaultImage = require("../../assets/img/default-image.jpg");

const MenuScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId; // Get userId from AsyncStorage

        if (userId) {
          // Calling API here
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/customers/${userId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);

            if (userData.profileImage) {
              setProfileImage(userData.profileImage);
            }
          } else {
            console.log("API request failed with status:", response.status);
          }
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOrderScreen = () => {
    // Navigate to my order screen
    navigation.navigate("OrderScreen");
  };

  const handleTransactionScreen = () => {
    // Navigate to my order screen
    navigation.navigate("TransactionHistoryScreen");
  };

  const handleFavoritesScreen = () => {
    // Navigate to favorites screen
    navigation.navigate("FavoritesScreen");
  };
  const handleStoreLocatorScreen = () => {
    // Navigate to store locator screen
    navigation.navigate("StoreLocatorScreen");
  };
  const handleSettingsScreen = () => {
    // Navigate to settings screen
    navigation.navigate("SettingsScreen");
  };
  const handleLogout = () => {
    // Call the signOut function to clear the token
    signOut();
    // Navigate to the "Login" screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.insideContainer}>
        <View style={{ marginTop: 13 }}>
          <Text
            style={{
              color: "black",
              fontSize: 22,
              fontWeight: 600,
              marginLeft: 20,
              marginTop: 5,
            }}
          >
            E-
            <Text style={{ color: "#EC6F56" }}> PharmaScripts</Text>
          </Text>
        </View>

        <View style={styles.line} />

        <View style={styles.profileCont}>
          <View style={styles.pic_cont}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Image
                source={defaultImage}
                className="w-full h-full rounded-full"
              />
            )}
          </View>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : user ? (
            <>
              <Text style={styles.name}>
                {user.firstName} {user.lastName}
              </Text>
            </>
          ) : (
            <Text>User data not available</Text>
          )}
        </View>

        <Text style={styles.menuText}>Menu</Text>
        <View style={styles.line} />

        <View style={{ marginTop: 10 }}>
          <TouchableOpacity onPress={handleOrderScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="solar:notebook-outline"
                  size={22}
                  color="#EC6F56"
                />
              </View>
              <Text style={styles.viewContText}>My Orders</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  style={{ marginLeft: 155 }}
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleTransactionScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="grommet-icons:transaction"
                  size={22}
                  color="#EC6F56"
                />
              </View>
              <Text style={styles.viewContText}>Transactions</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  style={{ marginLeft: 155 }}
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFavoritesScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify icon="ph:heart-light" size={22} color="#EC6F56" />
              </View>
              <Text style={styles.viewContText}>Favorites</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleStoreLocatorScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="ion:location-outline"
                  size={22}
                  color="#EC6F56"
                />
              </View>
              <Text style={styles.viewContText}>Store Locator</Text>
              <View style={styles.arrowIcon}>
                <Iconify
                  icon="iconoir:nav-arrow-right"
                  size={22}
                  color="black"
                />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSettingsScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify
                  icon="solar:settings-outline"
                  size={22}
                  color="#EC6F56"
                />
              </View>
              <Text style={styles.viewContText}>Settings</Text>
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
        <View style={styles.line} />

        {/* <TouchableOpacity onPress={handleLogout}>
          <View style={styles.logoutCont}>
            <Text style={styles.logoutButton}>Logout</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default MenuScreen;
