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
import { fetchUserData } from "../database/backend";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

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
              source={require("../assets/img/default-image.jpg")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  image: {
    height: (deviceWidth * 2) / 3,
    width: "100%",
  },
  productContentContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  insideContentContainer: {
    width: "85%",
    alignSelf: "center",
  },
  productNameView: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productNameText: {
    fontWeight: 600,
    fontSize: 20,
  },
  productReq: {
    fontWeight: 400,
    fontSize: 10,
    color: "#0CB669",
    marginTop: 10,
  },
  productPrice: {
    fontWeight: 600,
    fontSize: 24,
    textAlign: "right",
    marginTop: 10,
  },
  categoriesText: {
    color: "#8E8E8E",
    fontSize: 11,
    fontWeight: 400,
    marginTop: 10,
  },
  productInformationText: {
    fontSize: 11,
    fontWeight: 600,
    color: "white",
    textAlign: "center",
  },
  productInformationView: {
    backgroundColor: "black",
    borderRadius: 20,
    padding: 15,
    marginTop: 30,
    width: "50%",
  },
  informationView: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  informationContent: {
    fontSize: 10,
    fontWeight: 400,
    color: "#4E4E4E",
    textAlign: "justify",
    lineHeight: 16,
  },
  quantityButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#F5F5F5",
    width: "30%",
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 300,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 5,
  },
  stockText: {
    color: "#8E8E8E",
    fontWeight: 400,
    fontSize: 12,
  },
  quantityStockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  chatnowView: {
    borderColor: "#EC6F56",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    padding: 10,
    marginRight: 10,
  },
  chatnowText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#EC6F56",
  },
  addtocartView: {
    borderColor: "#EC6F56",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "38%",
    marginRight: 10,
  },
  addtocartText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#EC6F56",
  },
  buynowView: {
    backgroundColor: "#DC3642",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "40%",
  },
  buynowText: {
    color: "white",
    fontSize: 14,
    fontWeight: 600,
  },
  threeButtonsRow: {
    flexDirection: "row",
    padding: 15,
    width: "85%",
    justifyContent: "space-between",
  },
});

export default ProductDetailScreen;
