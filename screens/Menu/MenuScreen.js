import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../src/api/context";
import { fetchUserData } from "../../database/backend";
import { getAuthToken } from "../../src/api/authToken";
import { useUserId } from "../../src/api/userIDContext";
import styles from "./stylesheet";

const defaultImage = require("../../assets/img/default-image.jpg");

const MenuScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);
  const userId = useUserId(); // Assuming useUserId() returns a valid user ID
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId; // Get userId from AsyncStorage

        if (userId) {
          const userData = await fetchUserData(userId, "users");
          console.log("userId", userId);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
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
  const handleInstallmentScreen = () => {
    // Navigate to installment screen
    navigation.navigate("InstallmentScreen");
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
            {user && user.img ? (
              <Image
                source={{ uri: user.img }}
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

          <TouchableOpacity onPress={handleInstallmentScreen}>
            <View style={styles.viewCont}>
              <View style={styles.iconsBG}>
                <Iconify icon="quill:creditcard" size={22} color="#EC6F56" />
              </View>
              <Text style={styles.viewContText}>Installment</Text>
              <View style={styles.arrowIcon}>
                <Iconify
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

        <TouchableOpacity onPress={handleLogout}>
          <View style={styles.logoutCont}>
            <Text style={styles.logoutButton}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;
