import React, { useState, useEffect } from "react";
import { Iconify } from "react-native-iconify";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Touchable,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import styles from "./homestyle";
import axios from "axios";
import { EMU_URL, BASE_URL, API_URL } from "../../src/api/apiURL";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";

const { width, height } = Dimensions.get("window");
const adsImage = require("../../assets/img/ads/ads.png");
const cycy = require("../../assets/img/ads/cycy.png");
// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [mainPharmacy, setPharmacy] = useState([]);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  //const [searchKeyword, setSearchKeyword] = useState("");

  //
  //handleNavigateToProducts
  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        //HTTP GET request to API endpoint without specifying conditions
        const response = await axios.get(
          `${BASE_URL}/api/mobile/get/fetch/docs/by/condition?collectionName=pharmacy`
        );

        // Extracting the data from the response
        const pharmacyData = response.data;
        setPharmacy(pharmacyData);
      } catch (error) {
        console.log("Error fetching pharmacy data:", error);
      }
    };

    fetchPharmacyData();
  }, []);

  const handlePressAddress = () => {
    navigation.navigate("SearchProductsScreen");
  };

  const handleSearchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productQuery = query(productsCollection);
      const productDocs = await getDocs(productQuery);

      const matchedProductIds = [];
      const searchKeywordTrimmed = searchKeyword.trim().toLowerCase();

      productDocs.forEach((doc) => {
        const productId = doc.id;
        const productName = doc.data().productName;
        const productStatus = doc.data().productStatus;

        if (productStatus === "Display") {
          const productNameLower = productName.toLowerCase();
          if (productNameLower.includes(searchKeywordTrimmed)) {
            matchedProductIds.push(productId);
          }
        }
      });

      navigation.navigate("SearchProductsScreen", {
        searchKeyword: searchKeywordTrimmed,
      });
      setSearchKeyword("");
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  //
  const renderSearchIcon = () => {
    return (
      <TouchableOpacity
        style={styles.searchButtonIcon}
        onPress={() => {
          if (searchKeyword.trim() !== "") {
            handleSearchProducts();
          }
        }}
      >
        <Iconify icon="iconoir:search" size={22} color="black" />
      </TouchableOpacity>
    );
  };

  //
  const renderPharmacy = ({ item }) => {
    return (
      <View style={[styles.pharmacyContainer, { width: cardWidth }]}>
        <View style={styles.pharmacyCard}>
          <Image style={styles.image} source={{ uri: item.img }} />
          <Text style={styles.pharmacyName}>{item.companyName}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("BranchesScreen", { name: item.companyName })
            }
          >
            <View style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Pharmacy</Text>
              <Iconify icon="ic:round-greater-than" size={15} color="#EC6F56" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Body circum:search */}
        <View className="pl-4 pr-4 pb-2">
          <StatusBar backgroundColor="white" barStyle="light-content" />
          <View style={{ marginTop: 13, marginBottom: 5 }}>
            <Text
              style={{
                color: "black",
                fontSize: 22,
                fontWeight: 600,
                marginLeft: 2,
              }}
            >
              E-
              <Text style={{ color: "#EC6F56" }}> PharmaScripts</Text>
            </Text>
          </View>
          <View style={styles.searchFilterCont}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.searchCont}
              onPress={handlePressAddress}
            >
              <View style={styles.searchTexInputView}>
                <Text style={styles.searchTextInput}>Search product</Text>
              </View>
              {renderSearchIcon()}
            </TouchableOpacity>
          </View>
          <View className="justify-center items-center mt-3 bg-gray-200">
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              index={0}
              showPagination
              paginationDefaultColor="#ccc" // Customize pagination color
              paginationActiveColor="#FF0000"
              paginationStyle={{
                flexDirection: "row",
                position: "absolute",
                bottom: 24,
                alignSelf: "center",
                justifyContent: "center",
              }}
              paginationStyleItem={{
                width: 35,
                height: 7,
                borderRadius: 2,
                marginLeft: 5,
                marginRight: 5,
              }}
              scrollEnabled={false} // Disable swiping
              data={[{ image: adsImage }, { image: cycy }]}
              renderItem={({ item }) => (
                <Image
                  source={item.image}
                  style={{
                    width: imageWidth,
                    height: imageHeight,
                    resizeMode: "cover",
                  }}
                />
              )}
            />
            <Text className="text-black-500 text-center text-xs p-1">
              Online pharmacy is the solution for a convenient way to buy
              medicine!
            </Text>
          </View>
          {/* PHARMACY SELECTION */}
          <Text
            className="mt-4 pl-1 pb-2"
            style={{ color: "#3A3A3A", fontWeight: 600, fontSize: 16 }}
          >
            Pharmacy Selection
          </Text>
          {/**Pharmacy containers code */}

          <View style={styles.container}>
            <FlatList
              numColumns={2} // Display two items per row
              scrollEnabled={false}
              data={mainPharmacy}
              keyExtractor={(item) => item.id}
              renderItem={renderPharmacy}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
