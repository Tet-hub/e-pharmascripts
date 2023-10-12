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
import { EMU_URL, BASE_URL, API_URL } from "../../src/api/apiURL";
import { getAuthToken } from "../../src/authToken";
import { useToast } from "react-native-toast-notifications";
const deviceWidth = Dimensions.get("window").width;

const ProductDetailScreen = ({ navigation, route }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // New state variable
  const [item, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const productId = route.params?.productId;
  const sellerName = route.params?.branch;
  const company = route.params?.name;
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const apiUrl = `${BASE_URL}/api/mobile/get/fetch/docs/by/products/${productId}`;
          const response = await fetch(apiUrl);

          if (response.ok) {
            const productData = await response.json();
            setProductData(productData);
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
  }, []);

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
        productName: item.productName,
        quantity,
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
      ToastAndroid.show("Item adding failed!", ToastAndroid.SHORT);
    }
  };
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
                onPress={() => setIsFavorite(!isFavorite)}
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
            <TouchableOpacity style={styles.chatnowView}>
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
