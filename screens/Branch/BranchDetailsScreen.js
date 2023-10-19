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
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../Branch/bd";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  query,
  where,
  isEmpty,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getAuthToken } from "../../src/authToken";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";

const BranchDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sellerId } = route.params;
  const [companyName, setCompanyName] = useState("");
  const [branch, setBranch] = useState("");
  const [address, setAddress] = useState("");
  const [img, setImage] = useState(null);
  const [pharmacyRating, setPharmacyRating] = useState(0);
  //rater
  const [raterFirstName, setRaterFirstName] = useState("");
  const [raterImg, setRaterImage] = useState(null);
  const [raterInfo, setRaterInfo] = useState([]);

  //rating review
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const reviewCount = ratingsAndReviews.length - 1;
  const [showAllReviews, setShowAllReviews] = useState(false);

  //console.log("SELLER", sellerId);

  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const { firstName, profileImage } = userData;

        // Add the rater info to the raterInfo array
        setRaterInfo((prevRaterInfo) => [
          ...prevRaterInfo,
          {
            firstName,
            profileImage,
          },
        ]);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRatingAndReviewData = async () => {
    try {
      const rateAndReviewCollection = collection(db, "rateAndReview");
      const q = query(
        rateAndReviewCollection,
        where("sellerId", "==", sellerId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ratingsAndReviews = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const { pharmacyRating, reviewDescription, userId } = data;

          // Fetch user data for this userId
          await fetchUserData(userId);

          // Add the review data to the array
          ratingsAndReviews.push({
            pharmacyRating,
            reviewDescription,
          });
        }

        // Set the array once after collecting all data
        setRatingsAndReviews(ratingsAndReviews);
      } else {
        console.log("No ratings and reviews found for this seller.");
      }
    } catch (error) {
      console.error("Error fetching ratings and reviews:", error);
    }
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const sellerRef = doc(db, "sellers", sellerId);
        const sellerSnapshot = await getDoc(sellerRef);

        if (sellerSnapshot.exists()) {
          const sellerInfo = sellerSnapshot.data();
          setCompanyName(sellerInfo.companyName);
          setAddress(sellerInfo.address);
          setBranch(sellerInfo.branch);
          setImage(sellerInfo.img);

          // Fetch rating and review data
          fetchRatingAndReviewData();
        } else {
          console.log("Seller not found");
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  // Trim branch name
  const extractBranchName = (branch) => {
    if (branch) {
      const openParenthesisIndex = branch.indexOf("(");
      if (openParenthesisIndex !== -1) {
        return branch.substring(0, openParenthesisIndex).trim();
      }
    }
    return branch;
  };

  // Calculate the average pharmacy rating
  const calculateAverageRating = () => {
    let totalRating = 0;
    if (ratingsAndReviews.length > 0) {
      totalRating = ratingsAndReviews.reduce((total, review) => {
        return total + review.pharmacyRating;
      }, 0);
      return totalRating / ratingsAndReviews.length;
    }
    return 0; // Default to 0 if there are no ratings
  };

  // Get the average rating
  const averageRating = calculateAverageRating();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Branch Info</Text>
      <View style={styles.line} />

      <View style={{ width: "90%", alignSelf: "center", paddingBottom: 20 }}>
        <View style={styles.imgPharmacyNameView}>
          <View style={styles.pharmacyImageContainer}>
            {img ? ( // Check if sellerData has an img property
              <Image
                source={{ uri: img }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Image
                source={require("../../assets/img/default-image.jpg")}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </View>
          <View style={styles.companyNameView}>
            <View
              style={{
                width: "80%",
                alignSelf: "center",
                marginTop: 5,
                marginLeft: 5,
              }}
            >
              <Text style={styles.companyNameTextTop}>{companyName}</Text>
              <Text style={styles.branchText}>
                ({extractBranchName(branch)} Branch)
              </Text>
              <View style={styles.ratingsStarView}>
                <View style={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>
                      <Icon
                        name="star"
                        size={15}
                        color={star <= averageRating ? "#FAC63E" : "grey"}
                      />
                    </Text>
                  ))}
                </View>
                <Text style={styles.averageStar}>
                  {averageRating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.pharmacyDetailsView}>
          <Text style={styles.pharmacyDetailsText}>Pharmacy Details</Text>
        </View>
        <View>
          <View style={styles.pharmacyView}>
            <Iconify
              icon="iconoir:pharmacy-cross-circle"
              size={25}
              color="#EC6F56"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.pharmacyText}>Pharmacy:</Text>
          </View>
          <Text style={styles.companyNameText}>{companyName}</Text>
        </View>

        <View>
          <View style={styles.locationView}>
            <Iconify
              icon="fluent:location-16-filled"
              size={25}
              color="#EC6F56"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.locationText}>Location/Address:</Text>
          </View>
          <Text style={styles.addressText}>{address}</Text>
        </View>

        <View style={styles.ratingsView}>
          <Iconify
            icon="material-symbols:reviews"
            size={25}
            color="#EC6F56"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.ratingsText}>Ratings/Reviews:</Text>
        </View>

        {ratingsAndReviews.length === 0 ? (
          <Text style={styles.noReviewsText}>No ratings and reviews yet</Text>
        ) : (
          ratingsAndReviews
            .slice(0, showAllReviews ? undefined : 1)
            .map((review, index) => (
              <View key={index} style={styles.ratingReviewBackground}>
                <View style={styles.nameStarView}>
                  <View className="w-7 h-7 ml-5">
                    {raterInfo[index].profileImage ? (
                      <Image
                        source={{ uri: raterInfo[index].profileImage }}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/img/default-image.jpg")}
                        className="w-full h-full rounded-full"
                      />
                    )}
                  </View>

                  <View style={styles.ratingsReviewsView}>
                    <Text style={styles.raterNameText}>
                      {raterInfo[index].firstName}
                    </Text>
                    <View style={styles.starRatingReviews}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} style={styles.star}>
                          <Icon
                            name="star"
                            size={8}
                            color={
                              star <= review.pharmacyRating ? "#FAC63E" : "grey"
                            }
                          />
                        </Text>
                      ))}
                    </View>
                    <View style={styles.reviewTextView}>
                      <Text style={styles.reviewText}>
                        {review.reviewDescription}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
        )}

        {ratingsAndReviews.length === 0 ? (
          <Text></Text>
        ) : (
          <View style={styles.seeAllTextView}>
            <TouchableOpacity
              onPress={() => setShowAllReviews(!showAllReviews)}
            >
              <Text style={styles.seeAllText}>
                {showAllReviews
                  ? "Show Less Reviews"
                  : `See All Reviews (${reviewCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default BranchDetailsScreen;
