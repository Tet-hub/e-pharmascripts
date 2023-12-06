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
  updateDoc,
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
  const [timeClose, setTimeClose] = useState("");
  const [timeOpen, setTimeOpen] = useState("");
  const [pharmacyRating, setPharmacyRating] = useState(0);
  const [currentSellerId, setSellerId] = useState(null);
  const [currentSellerDisplayName, setSellerDisplayName] = useState("");
  //rater
  const [raterFirstName, setRaterFirstName] = useState("");
  const [raterImg, setRaterImage] = useState(null);
  const [raterInfo, setRaterInfo] = useState([]);

  //rating review
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const reviewCount = ratingsAndReviews.length - 1;
  const [showAllReviews, setShowAllReviews] = useState(false);

  //console.log("SELLER", sellerId);
  function convertToAmPm(time24) {
    const [hours, minutes] = time24.split(":");
    let period = hours >= 12 ? "PM" : "AM";
    let hour = hours % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  }

  const fetchUserData = async (customerId) => {
    try {
      const userRef = doc(db, "customers", customerId);
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
        const fetchedRatingsAndReviews = [];
        for (const doc of querySnapshot.docs) {
          const data = doc.data();
          const { pharmacyRating, reviewDescription, reviewedAt, customerId } =
            data;

          // Fetch user data for this customerId
          await fetchUserData(customerId);

          // Add the review data to the array
          fetchedRatingsAndReviews.push({
            pharmacyRating,
            reviewDescription,
            reviewedAt,
          });
        }

        fetchedRatingsAndReviews.sort(
          (a, b) => b.reviewedAt.toDate() - a.reviewedAt.toDate()
        );
        // Set the array once after collecting all data
        setRatingsAndReviews(fetchedRatingsAndReviews);
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
          setSellerId(sellerInfo.sellerId);
          setSellerDisplayName(sellerInfo.displayName);
          setCompanyName(sellerInfo.companyName);
          setAddress(sellerInfo.formattedAddress);
          setBranch(sellerInfo.branch);
          setImage(sellerInfo.img);
          if (sellerInfo.timeClose && sellerInfo.timeOpen) {
            setTimeClose(convertToAmPm(sellerInfo.timeClose));
            setTimeOpen(convertToAmPm(sellerInfo.timeOpen));
          } else {
            // Set default values or handle the case when time values are not available
            setTimeClose(" Not Specified");
            setTimeOpen("");
          }

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
  /*
  useEffect(() => {
    const updateSellerRating = async () => {
      try {
        const sellerRef = doc(db, "sellers", sellerId);
        const sellerSnapshot = await getDoc(sellerRef);

        if (sellerSnapshot.exists()) {
          await updateDoc(sellerRef, {
            averageRating: averageRating,
          });
          console.log("Average rating updated in seller collection.");
        } else {
          console.log("Seller not found");
        }
      } catch (error) {
        console.error("Error updating seller rating:", error);
      }
    };

    if (averageRating !== 0) {
      updateSellerRating();
    }
  }, [averageRating, sellerId]);*/

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const lastCommaIndex = formattedDate.lastIndexOf(",");
    const formattedDateTime =
      formattedDate.slice(0, lastCommaIndex) +
      " at" +
      formattedDate.slice(lastCommaIndex + 1);

    return formattedDateTime;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.screenTitle}>Branch Info</Text>
        <TouchableOpacity
          style={styles.messageView}
          onPress={() =>
            navigation.navigate("ChatScreen", {
              name: currentSellerDisplayName,
              img: img,
              sellerId: currentSellerId,
              sellerBranch: branch,
            })
          }
        >
          <Iconify icon="tabler:message" size={35} color="#EC6F56" />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />

      <View style={{ width: "90%", alignSelf: "center", paddingBottom: 20 }}>
        <View style={styles.imgPharmacyNameView}>
          <View style={styles.pharmacyImageContainer}>
            {img ? (
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

        <Text style={styles.pharmacyDetailsText}>Pharmacy Details :</Text>
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
        <View>
          <View style={styles.locationView}>
            <Iconify
              icon="icomoon-free:hour-glass"
              size={21}
              color="#EC6F56"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.locationText}>Store Hours:</Text>
          </View>
          <Text style={styles.addressText}>
            {timeOpen} - {timeClose}
          </Text>
          <Text style={styles.note}>
            Note: Orders created after store hours will be delivered on the
            following day.
          </Text>
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
                    <View style={styles.flexDiv}>
                      <View>
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
                                  star <= review.pharmacyRating
                                    ? "#FAC63E"
                                    : "grey"
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
                      <View>
                        <Text style={styles.dateReviewed}>
                          {formatDate(review.reviewedAt)}
                        </Text>
                      </View>
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
