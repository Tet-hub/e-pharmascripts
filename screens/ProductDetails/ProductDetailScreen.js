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
  const [sellerId, setSellerId] = useState(null); // Initialize sellerId state
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const [aveRating, setAveRating] = useState(0);

  // First useEffect to fetch product data and set sellerId
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/products/${productId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const productData = await response.json();
            setProductData(productData);

            // Set the sellerId value obtained from productData
            const sellerId = productData.sellerId;
            setSellerId(sellerId);

            // Fetch seller details and ratings based on sellerId
            if (sellerId) {
              const sellerDocRef = doc(db, "sellers", sellerId);
              const sellerDocSnap = await getDoc(sellerDocRef);

              if (sellerDocSnap.exists()) {
                const sellerData = sellerDocSnap.data();
                setBranches(sellerData);
              } else {
                console.log(
                  "Seller document not found for sellerId:",
                  sellerId
                );
              }

              const ratingsRef = collection(db, "rateAndReview");
              const querySnapshot = await getDocs(
                query(ratingsRef, where("sellerId", "==", sellerId))
              );

              const sellerRatings = [];
              querySnapshot.forEach((doc) => {
                const ratingData = doc.data();
                sellerRatings.push(ratingData);
              });

              setRatingsAndReviews(sellerRatings);
              // Calculate average seller rating
              const calculateAverageRating = () => {
                if (sellerRatings.length > 0) {
                  const totalRatings = sellerRatings.reduce(
                    (total, review) => total + review.pharmacyRating,
                    0
                  );
                  return totalRatings / sellerRatings.length;
                }
                return 0; // Default to 0 if there are no ratings
              };

              const averageRating = calculateAverageRating();
              // Set the calculated average rating to state
              setAveRating(averageRating);
            }
          } else {
            console.log("API request failed with status:", response.status);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

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
      const customerId = authToken.userId;

      if (!customerId) {
        console.log("User ID is undefined or null.");
        return;
      }
      const storeItemUrl = `${BASE_URL}/api/mobile/post/items/cart`;

      // Create the item object to be sent
      const itemToAddToCart = {
        customerId,
        productId: productId,
        quantity,
        sellerId: item.sellerId,
      };
      console.log("item", itemToAddToCart);
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
        ToastAndroid.show(
          "Item added to cart successfully!",
          ToastAndroid.SHORT
        );
        // toast.show("Item added to cart successfully!");
        // toast.show("Item added to cart successfully!", {
        //   type: "normal ",
        //   placement: "bottom",
        //   duration: 3000,
        //   offset: 10,
        //   animationType: "slide-in",
        // });
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
      const customerId = authToken.userId;

      if (!customerId) {
        console.log("User ID is undefined or null.");
        return;
      }
      const currentCustomerId = customerId;
      const favoritesCollection = collection(db, "favorites");

      const data = {
        productId: productId,
        customerId: currentCustomerId,
      };

      // Check if the item is already in favorites
      const favoritesQuery = query(
        favoritesCollection,
        where("productId", "==", productId),
        where("customerId", "==", currentCustomerId)
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
  const handleSellerInfo = async () => {
    navigation.navigate("BranchDetailsScreen", { sellerId: sellerId });
  };
  // Initial check if the product is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const authToken = await getAuthToken();
        const customerId = authToken.userId;

        if (!customerId) {
          console.log("User ID is undefined or null.");
          return;
        }
        const currentCustomerId = customerId;
        const favoritesCollection = collection(db, "favorites");

        const favoritesQuery = query(
          favoritesCollection,
          where("productId", "==", productId),
          where("customerId", "==", currentCustomerId)
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
      <ScrollView
        contentContainerStyle={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
      >
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
              source={require("../../assets/img/def-image.jpg")}
              style={styles.image}
            />
          )}
        </View>
        <View style={styles.productContentContainer}>
          <View style={styles.insideContentContainer}>
            <View style={[styles.productNameView, styles.row]}>
              <Text style={styles.productNameText}>{item.productName}</Text>
              <Iconify
                icon="mdi:heart"
                size={35}
                color={isFavorite ? "#EC6F56" : "#8E8E8E"}
                onPress={handleFavorites}
                style={styles.heartIcon}
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
              Categories:{" "}
              {Array.isArray(item.category)
                ? item.category.join(", ")
                : item.category}
            </Text>

            <View style={styles.productInformationView}>
              <Text style={styles.productInformationText}>
                Product Information:
              </Text>
            </View>
            <View style={styles.informationView}>
              <Text style={styles.informationContent}>
                {"          "}
                {item.productInfo}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.sellerInfo}
              onPress={handleSellerInfo}
            >
              <View style={styles.sellerImageCont}>
                {branches.img ? (
                  <Image
                    source={{ uri: branches.img }}
                    style={styles.sellerImg}
                  />
                ) : (
                  <Image
                    source={require("../../assets/img/default-image.jpg")}
                    style={styles.sellerImg}
                  />
                )}
              </View>
              <View style={styles.sellerTextCont}>
                <Text style={styles.sellerText}> {branches.branch || ""}</Text>
                <View style={styles.sellerRating}>
                  <Iconify
                    icon="solar:star-bold"
                    size={20}
                    color="#FFD700"
                    style={styles.sellerRatingIcon}
                  />
                  <Text style={styles.sellerRatingText}>
                    {aveRating !== 0 ? aveRating.toFixed(1) : "No ratings"} /
                    5.0
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
                  sellerId: item.sellerId,
                  sellerBranch: branches.branch,
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
