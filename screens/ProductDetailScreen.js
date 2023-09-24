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
  // const deviceHeight = Dimensions.get("window").height;

  // const deviceWidth = Dimensions.get("window").width;
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [item, setProductData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = route.params?.productId;
        if (productId) {
          const productData = await fetchUserData(productId, "products");
          if (item) {
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
    setQuantity(quantity + 1);
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  // const { width: deviceWidth } = Dimensions.get("window");
  const scrollableContentHeight = deviceHeight - 50; // Adjust margin as needed
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[styles.scrollableContent, { height: scrollableContentHeight }]}
      >
        <View style={[styles.container, { height: deviceHeight }]}>
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
                <Iconify
                  icon="mdi:heart"
                  size={35}
                  color={isFavorite ? "#EC6F56" : "#8E8E8E"}
                  onPress={() => setIsFavorite(!isFavorite)}
                />
              </View>
              {item.requiresPrescription == "Yes" ? (
                <Text style={styles.productReq}>
                  {" "}
                  [ Requires Prescription ]{" "}
                </Text>
              ) : (
                <Text style={styles.productReq}> </Text>
              )}
              <Text style={styles.productPrice}>₱ {item.price}</Text>
              <Text style={styles.categoriesText}>
                Categories: {item.category}{" "}
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
                <Text style={styles.stockText}>Stock: 50</Text>
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
                <View style={styles.buynowView}>
                  <Text style={styles.buynowText}>BUY NOW</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableContent: {
    marginBottom: 13, // Add margin as needed
  },
  imageContainer: {
    width: "100%", // Set to 100% to take the full width of the screen
    alignSelf: "center",
    marginTop: 15,
    paddingHorizontal: 10, // Add horizontal padding for margin
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
    marginBottom: 20,
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
    marginTop: 20,
    width: "85%",
    justifyContent: "space-between",
    position: "absolute",
    bottom: -80,
  },
});
