import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { Iconify } from "react-native-iconify";
import styles from "./detailsStylesheet";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { BASE_URL } from "../../src/api/apiURL";
import { getAuthToken } from "../../src/authToken";
import { useToast } from "react-native-toast-notifications";
import ChatScreen from "../Chat/ChatScreen";
import buildQueryUrl from "../../src/api/components/conditionalQuery";
const deviceWidth = Dimensions.get("window").width;

const ProductDetailScreen = ({ navigation, route }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // New state variable
  const [item, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const productId = route.params?.productId;
  const toast = useToast();
  const [createdBy, setCreatedBy] = useState(null); // Initialize createdBy state

  // First useEffect to fetch product data and set createdBy
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/products/${productId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const productData = await response.json();
            setProductData(productData);

            // Set the createdBy value obtained from productData
            setCreatedBy(productData.createdBy);
          } else {
            console.log("API request failed with status:", response.status);
          }
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  //Fetch seller details based on createdBy
  useEffect(() => {
    if (createdBy) {
      const fetchBranches = async () => {
        //console.log(`Createdby before conditition: ${createdBy}`);
        try {
          // Construct the Firestore document reference by its ID
          const sellerDocRef = doc(db, "sellers", createdBy);

          // Fetch the seller document
          const sellerDocSnap = await getDoc(sellerDocRef);

          if (sellerDocSnap.exists()) {
            const sellerData = sellerDocSnap.data();
            setBranches(sellerData);
          } else {
            console.log("Seller document not found for createdBy:", createdBy);
          }
        } catch (error) {
          console.log("Error fetching seller document:", error);
        }
      };

      fetchBranches();
    }
  }, [createdBy]);

  const handleIncrement = () => {
    if (quantity < item.stock) {
      // Check if quantity is less than available stock
      setQuantity(quantity + 1);
      setSelectedQuantity(selectedQuantity + 1); // Update selected quantity
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setSelectedQuantity(selectedQuantity - 1); // Update selected quantity
    }
  };
  const addToCart = async () => {
    try {
      const authToken = await getAuthToken();
      const userId = authToken.userId;

      if (!userId) {
        console.log("User ID is undefined or null.");
        return;
      }

      const storeItemUrl = `${BASE_URL}/api/mobile/post/items/cart`;

      // Create the item object to be sent
      const itemToAddToCart = {
        userId,
        productId: productId,
        quantity,
        // productName: item.productName,
        // price: item.price, //should i save the current price when the user
        // sellerId: item.createdBy,
        // img: item.img,
        // requiresPrescription: item.requiresPrescription,
        // category: item.category,
      };
      // console.log("item", itemToAddToCart);
      const response = await fetch(storeItemUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAddToCart),
      });
      if (response.ok) {
        console.log("Item added to cart successfully!");
        //Adding toastAndriod success message
        // ToastAndroid.show(
        //   "Item added to cart successfully!",
        //   ToastAndroid.SHORT
        // );
        // toast.show("Item added to cart successfully!");
        toast.show("Item added to cart successfully!", {
          type: "normal ",
          placement: "bottom",
          duration: 3000,
          offset: 10,
          animationType: "slide-in",
        });
      } else {
        console.log("Error adding item to cart:", response.status);
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
      // Optionally, you can show an error message here.
      ToastAndroid.show("Item adding failed!", ToastAndroid.SHORT); //shdfasdfsdfldklsdklklfdflllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll
    }
  };

  //Add to favorites
  const handleFavorites = async () => {
    try {
      const authToken = await getAuthToken();
      const userId = authToken.userId;

      if (!userId) {
        console.log("User ID is undefined or null.");
        return;
      }
      const currentUserId = userId;
      const favoritesCollection = collection(db, "favorites");

      const data = {
        productId: productId,
        userId: currentUserId,
      };

      // Check if the item is already in favorites
      const favoritesQuery = query(
        favoritesCollection,
        where("productId", "==", productId),
        where("userId", "==", currentUserId)
      );

      const favoritesQuerySnapshot = await getDocs(favoritesQuery);

      if (!favoritesQuerySnapshot.empty) {
        favoritesQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setIsFavorite(false);
        ToastAndroid.show("Product removed from favorites", ToastAndroid.SHORT);
      } else {
        await addDoc(favoritesCollection, data);
        setIsFavorite(true);
        ToastAndroid.show("Product added to favorites", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // Initial check if the product is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const authToken = await getAuthToken();
        const userId = authToken.userId;

        if (!userId) {
          console.log("User ID is undefined or null.");
          return;
        }
        const currentUserId = userId;
        const favoritesCollection = collection(db, "favorites");

        const favoritesQuery = query(
          favoritesCollection,
          where("productId", "==", productId),
          where("userId", "==", currentUserId)
        );

        const favoritesQuerySnapshot = await getDocs(favoritesQuery);

        setIsFavorite(!favoritesQuerySnapshot.empty);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorite();
  }, [productId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <View style={styles.imageContainer}>
          {item && item.img ? (
            <Image
              source={{ uri: item.img }}
              style={styles.image}
              // style={[
              //   styles.image,
              //   { width: deviceWidth, height: (deviceWidth * 2) / 3 },
              // ]}
            />
          ) : (
            <Image
              source={require("../../assets/img/default-image.jpg")}
              style={[
                styles.image,
                { width: deviceWidth, height: (deviceWidth * 2) / 3 },
              ]}
            />
          )}
        </View>
        <View style={styles.productContentContainer}>
          <View style={styles.insideContentContainer}>
            <View style={styles.productNameView}>
              <Text style={styles.productNameText}>{item.productName}</Text>
              <Text style={styles.productNameText}>{item.id}</Text>
              <Iconify
                icon="mdi:heart"
                size={35}
                color={isFavorite ? "#EC6F56" : "#8E8E8E"}
                onPress={handleFavorites}
              />
            </View>
            {item.requiresPrescription == "Yes" ? (
              <Text style={styles.productReq}>[ Requires Prescription ]</Text>
            ) : (
              <Text style={styles.productReq}> </Text>
            )}
            <Text style={styles.productPrice}>
              {"\u20B1"} {item.price}
            </Text>
            <Text style={styles.categoriesText}>
              Categories: {item.category}
            </Text>
            <View style={styles.productInformationView}>
              <Text style={styles.productInformationText}>
                Product Information
              </Text>
            </View>
            <View style={styles.informationView}>
              <Text style={styles.informationContent}>
                {"          "}
                {item.productInfo}
              </Text>
            </View>
            <View style={styles.quantityStockRow}>
              <View style={styles.quantityButton}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={styles.button}
                >
                  <Iconify icon="ph:minus-fill" size={22} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.button}
                >
                  <Iconify icon="ph:plus-fill" size={22} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.stockText}>Stock left: {item.stock}</Text>
            </View>
          </View>
          <View style={styles.threeButtonsRow}>
            {/* Chat now */}
            <TouchableOpacity
              style={styles.chatnowView}
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  // name: branches ? branches.displayName : null,
                  // img: branches ? branches.img : null,
                  name: branches.displayName,
                  img: branches.img,
                  sellerId: item.createdBy,
                })
              }
            >
              <Iconify
                icon="ant-design:message-outlined"
                size={19}
                color="#EC6F56"
              />
              <Text style={styles.chatnowText}>Chat now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addtocartView} onPress={addToCart}>
              <Iconify icon="uil:cart" size={19} color="#EC6F56" />
              <Text style={styles.addtocartText}>Add to cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buynowView}
              onPress={() => {
                navigation.navigate("ToValidateScreen", {
                  productId: item.productId,
                  quantity: quantity,
                });
              }}
            >
              <Text style={styles.buynowText}>BUY NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
