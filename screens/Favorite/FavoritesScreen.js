import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";
import {
  onSnapshot,
  getDocs,
  doc,
  collection,
  query,
  where,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { ScrollView } from "react-native-gesture-handler";

const deviceWidth = Dimensions.get("window").width;
const { width } = Dimensions.get("window");
const cardWidth = (width - 30) / 2;

const FavoritesScreen = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const FetchFavorites = async () => {
      const authToken = await getAuthToken();
      const userId = authToken.userId;
      setCurrentUserId(userId);

      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", currentUserId)
      );

      // Set up a real-time listener with onSnapshot
      onSnapshot(favoritesQuery, (snapshot) => {
        const productIds = snapshot.docs.map((doc) => doc.data().productId);

        if (productIds.length > 0) {
          const productQuery = query(
            collection(db, "products"),
            where("productId", "in", productIds)
          );

          // Set up a real-time listener for product data
          onSnapshot(productQuery, (productSnapshot) => {
            const productData = productSnapshot.docs.map((doc) => doc.data());
            setProductData(productData);
          });
        }
      });
    };

    FetchFavorites();
  }, [currentUserId]);

  const removeProductFromFavorites = async (productId) => {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("userId", "==", currentUserId),
      where("productId", "==", productId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);

    if (!favoritesSnapshot.empty) {
      const favoriteDocRef = doc(db, "favorites", favoritesSnapshot.docs[0].id);
      await deleteDoc(favoriteDocRef);
    }
  };

  const addToCart = async (productId) => {
    try {
      const cartCollection = collection(db, "cart");

      await addDoc(cartCollection, {
        productId: productId,
        userId: currentUserId,
      });

      console.log("Product added to cart successfully");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const renderItem = ({ item, index }) => (
    <ScrollView>
      <View style={styles.row}>
        <View style={styles.productContainer}>
          <View style={styles.productCard}>
            <View style={styles.xButtonContainer}>
              <TouchableOpacity
                style={styles.xButton}
                onPress={() => removeProductFromFavorites(item.productId)}
              >
                <Iconify icon="bi:x" size={13} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              {item && item.img ? (
                <Image source={{ uri: item.img }} style={styles.image} />
              ) : (
                <Image
                  source={require("../../assets/img/default-image.jpg")}
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              )}
            </View>

            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productReq}>
              {item.requiresPrescription === "Yes" ? (
                <Text style={styles.productReq}>[ Requires Prescription ]</Text>
              ) : null}
            </Text>
            <Text style={styles.productPrice}>₱ {item.price}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item.productId)}
            >
              <Text style={styles.addText}>Add to cart</Text>
              <Iconify
                icon="ic:outline-shopping-cart"
                size={17}
                color="white"
                style={styles.cartIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Favorites</Text>
      <View style={styles.line} />
      <FlatList
        data={productData}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.productId}
      />
    </View>
  );
};

export default FavoritesScreen;
