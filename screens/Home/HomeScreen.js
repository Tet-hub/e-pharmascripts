import React, { useState, useEffect } from "react";
import { Iconify } from "react-native-iconify";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
  FlatList,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { filterData } from "../../components/data";
import { fetchData } from "../../database/fetchData";
import styles from "./stylesheet";
const { width, height } = Dimensions.get("window");
const adsImage = require("../../assets/img/ads/ads.png");
const cycy = require("../../assets/img/ads/cycy.png");
// Calculate the image dimensions based on screen size
const imageWidth = width; //Adjust as needed
const imageHeight = height * 0.18; // Adjust as needed
const cardWidth = (width - 30) / 2;
const HomeScreen = () => {
  const navigation = useNavigation();
  const [mainPharmacy, setPharmacy] = useState([]);
  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        const pharmacyData = await fetchData("pharmacy");
        // console.log("Pharmacy Data:", pharmacyData);
        setPharmacy(pharmacyData);
        // console.log("pharmacyData", pharmacyData);
      } catch (error) {
        console.error("Error fetching pharmacy data:", error);
      }
    };

    fetchPharmacyData(); // Call the function to fetch data
  }, []);

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
    <SafeAreaView className="flex-1">
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
            <View style={styles.searchCont}>
              <Iconify
                icon="circum:search"
                size={22}
                style={styles.iconSearch}
              />
              <TextInput placeholder="Search product" />
            </View>
            <TouchableOpacity>
              <View style={styles.iconFilterCont}>
                <Iconify icon="mi:filter" size={25} color="white" />
              </View>
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