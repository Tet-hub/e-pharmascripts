import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

import SwiperFlatList from "react-native-swiper-flatlist";
import { useNavigation } from "@react-navigation/native";

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
import { styled } from "nativewind";

import BranchesScreen from "../screens/BranchesScreen";

const { width, height } = Dimensions.get("window");

// Calculate the image dimensions based on screen size
const imageWidth = width; // Adjust as needed
const imageHeight = height * 0.25; // Adjust as needed

const HomeScreen = () => {
  const navigation = useNavigation();
  const handleBranches = () => {
    // Navigate to notification screen when TouchableOpacity of notification icon is pressed
    navigation.navigate("BranchesScreen");
  };
  return (
    <SafeAreaView className="flex-1">
      <ScrollView>
        {/* Body */}
        <View className="pl-2 pr-2 pb-2">
          <View className="justify-center items-center mt-3 bg-gray-200 rounded-md">
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
              data={[
                { image: require("../assets/img/cymer.jpg") },
                { image: require("../assets/img/EPS.png") },
                { image: require("../assets/img/cycy.png") },
                { image: require("../assets/img/cymerin2dworld.jpg") },
              ]}
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
            <Text className="text-black-500 text-center text-xs">
              Online Pharmacy is the solution for a convenient way to buy
              medicine!
            </Text>
          </View>

          {/* PHARMACY SELECTION */}
          <Text className="text-red-700 text-lg mt-4 pl-1 pb-3 pt-5">
            Pharmacy Selection
          </Text>
          <View className="flex flex-row flex-wrap">
            {/**Pharmacy containers code */}
            <View className="w-1/2 p-2 ">
              <View
                style={{
                  height: 250,
                  backgroundColor: "#F4F4F4",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Text className="text-center text-sm font-bold pt-4">
                  Three-Xymer Pharmacy
                </Text>
                <TouchableOpacity
                  onPress={handleBranches}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    width: 120,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-red-500 text-s">View Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-1/2 p-2 ">
              <View
                style={{
                  height: 250,
                  backgroundColor: "#F4F4F4",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Text className="text-center text-sm font-bold pt-4">
                  Three-Xymer Pharmacy
                </Text>
                <TouchableOpacity
                  onPress={handleBranches}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    width: 120,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-red-500 text-s">View Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-1/2 p-2 ">
              <View
                style={{
                  height: 250,
                  backgroundColor: "#F4F4F4",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Text className="text-center text-sm font-bold pt-4">
                  Three-Xymer Pharmacy
                </Text>
                <TouchableOpacity
                  onPress={handleBranches}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    width: 120,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-red-500 text-s">View Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-1/2 p-2 ">
              <View
                style={{
                  height: 250,
                  backgroundColor: "#F4F4F4",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Text className="text-center text-sm font-bold pt-4">
                  Three-Xymer Pharmacy
                </Text>
                <TouchableOpacity
                  onPress={handleBranches}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    width: 120,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-red-500 text-s">View Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-1/2 p-2 ">
              <View
                style={{
                  height: 250,
                  backgroundColor: "#F4F4F4",
                  padding: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <Image
                  source={require("../assets/img/cymer.jpg")}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Text className="text-black-100 text-center text-sm font-bold pt-4">
                  Three-Xymer Pharmacy
                </Text>
                <TouchableOpacity
                  onPress={handleBranches}
                  style={{
                    backgroundColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                    marginTop: 14,
                    borderWidth: 1,
                    borderColor: "#EF4444",
                    width: 120,
                    alignSelf: "center",
                  }}
                >
                  <Text className="text-red-500 text-s">View Pharmacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Add more pharmacy selection items here */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
