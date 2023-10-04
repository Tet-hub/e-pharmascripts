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
} from "react-native";
import { Iconify } from "react-native-iconify";
import { fetchUserData } from "../../database/backend";
import styles from "./detailsStylesheet";

const deviceWidth = Dimensions.get("window").width;

const ProductDetailScreen = ({ navigation, route }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // New state variable
  const [item, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const productId = route.params?.productId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const productData = await fetchUserData(productId, "products");
          if (productData) {
            setProductData(productData);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        <View style={styles.imageContainer}>
          {item && item.img ? (
            <Image
              source={{ uri: item.img }}
              style={[
                styles.image,
                { width: deviceWidth, height: (deviceWidth * 2) / 3 },
              ]}
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
            <View style={styles.chatnowView}>
              <Iconify
                icon="ant-design:message-outlined"
                size={19}
                color="#EC6F56"
              />
              <Text style={styles.chatnowText}>Chat now</Text>
            </View>
            <View style={styles.addtocartView}>
              <Iconify icon="uil:cart" size={19} color="#EC6F56" />
              <Text style={styles.addtocartText}>Add to cart</Text>
            </View>
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
