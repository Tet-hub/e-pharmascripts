import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ToastAndroid,
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

const FavoritesScreen = ({ navigation, route }) => {
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
        where("customerId", "==", currentUserId)
      );

      onSnapshot(favoritesQuery, (snapshot) => {
        const productIds = snapshot.docs.map((doc) => doc.data().productId);

        if (productIds.length > 0) {
          const productQuery = query(
            collection(db, "products"),
            where("productId", "in", productIds)
          );

          onSnapshot(productQuery, (productSnapshot) => {
            const productData = productSnapshot.docs.map((doc) => doc.data());
            setProductData(productData);
          });
          2;
        }
      });
    };

    FetchFavorites();
  }, [currentUserId]);

  const removeProductFromFavorites = async (productId) => {
    const favoritesQuery = query(
      collection(db, "favorites"),
      where("customerId", "==", currentUserId),
      where("productId", "==", productId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);

    if (!favoritesSnapshot.empty) {
      const favoriteDocRef = doc(db, "favorites", favoritesSnapshot.docs[0].id);
      await deleteDoc(favoriteDocRef);
      ToastAndroid.show("Product removed from favorites", ToastAndroid.SHORT);

      // Update the productData state to remove the product
      setProductData((prevData) =>
        prevData.filter((item) => item.productId !== productId)
      );
    }
  };
  //   try {
  //     const productsCollection = collection(db, "products");
  //     const productQuery = query(
  //       productsCollection,
  //       where("createdBy", "==", sellerId),
  //       where("productStatus", "==", "Display")
  //     );
  //     const productDocs = await getDocs(productQuery);

  //     const categories = new Set(); //ensure uniqueness

  //     productDocs.forEach((doc) => {
  //       const data = doc.data();
  //       if (data.category) {
  //         if (Array.isArray(data.category)) {
  //           // If it's an array, extend the Set
  //           data.category.forEach((cat) => categories.add(cat));
  //         } else {
  //           // If it's a single category, add it to the Set
  //           categories.add(data.category);
  //         }
  //       }
  //     });

  //     // Convert the Set back to an array
  //     const uniqueCategories = [...categories];
  //     //unique categories
  //     //console.log("Product CAtegories:", uniqueCategories);
  //     setSelectedCategories(uniqueCategories);
  //   } catch (error) {
  //     console.log("Error fetching category products:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchProductCategories();
  // }, [sellerId]);
  // const addToCart = async (productId) => {
  //   try {
  //     const cartCollection = collection(db, "cart");

  //     await addDoc(cartCollection, {
  //       productId: productId,
  //       userId: currentUserId,
  //     });

  //     console.log("Product added to cart successfully");
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //   }
  // };
  const renderItem = ({ item, index }) => (
    <ScrollView>
      <View style={[styles.productContainer, { width: cardWidth }]}>
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
          <Text style={styles.productName}>
            {" "}
            {item.productName.length > 20
              ? `${item.productName.substring(0, 16)}...`
              : item.productName}
          </Text>
          <Text style={styles.productReq}>
            {item.requiresPrescription === "Yes" ? (
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            ) : null}
          </Text>
          <Text style={styles.productPrice}>₱ {item.price}</Text>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductDetailScreen", {
                productId: item.productId,
                name: route.params?.name,
                // branch: route.params?.branch,
              })
            }
          >
            <View style={styles.addButton}>
              <Text style={styles.addText}>View Product</Text>
              <Iconify icon="ic:round-greater-than" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Favorites</Text>
      <View style={styles.line} />
      {productData.length === 0 ? (
        <Text style={styles.noFavoritesText}>No products added</Text>
      ) : (
        <View style={styles.cardContainer}>
          <FlatList
            data={productData}
            renderItem={renderItem}
            numColumns={2}
            keyExtractor={(item) => item.productId}
          />
        </View>
      )}
    </View>
  );
};

export default FavoritesScreen;
