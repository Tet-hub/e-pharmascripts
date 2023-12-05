import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../Rate/stylesheet";
import { TextInput } from "react-native-gesture-handler";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getCurrentUserId } from "../../src/authToken";
import { getCurrentEmail } from "../../src/authToken";
const RateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params;
  console.log("ORDERID: ", orderId);

  const deviceHeight = Dimensions.get("window").height;
  const deviceWidth = Dimensions.get("window").width;

  const [pharmacyRating, setPharmacyRating] = useState(0);
  // State variables to store the fetched data
  const [productName, setProductName] = useState("");
  const [branch, setBranch] = useState("");
  const [seller, setSeller] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [pharmacyBranch, setPharmacyBranch] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [email, setEmail] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  console.log("sdf: ", customerId);

  const handleStarPress = (selectedRating, type) => {
    if (type === "pharmacy") {
      setPharmacyRating(selectedRating);
    }
  };

  const handleReviewChange = (text) => {
    setReviewDescription(text);
    setCharacterCount(text.length);
  };

  //
  useEffect(() => {
    if (customerId) {
      const fetchOrderData = async () => {
        const orderRef = doc(db, "orders", orderId);
        const orderSnapshot = await getDoc(orderRef);

        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data();
          if (customerId === orderData.customerId) {
            const sellerId = orderData.sellerId;
            setSeller(sellerId);
            setProductName(orderData.productName);

            const sellerRef = doc(db, "sellers", sellerId);
            const sellerSnapshot = await getDoc(sellerRef);

            if (sellerSnapshot.exists()) {
              const sellerData = sellerSnapshot.data();
              setBranch(sellerData.branch);
              setCompanyName(sellerData.companyName);

              const openingParenthesisIndex = sellerData.branch.indexOf("(");
              const cleanBranch =
                openingParenthesisIndex !== -1
                  ? sellerData.branch.slice(0, openingParenthesisIndex).trim()
                  : sellerData.branch;

              setPharmacyBranch(
                sellerData.companyName + " (" + cleanBranch + " Branch)"
              );
            }
          }
        }
      };

      fetchOrderData();
    }
  }, [orderId, customerId]);
  useEffect(() => {
    // Call the getUserId function and set the result to the state variable
    getCurrentUserId().then((id) => setCustomerId(id));
    getCurrentEmail().then((id) => setEmail(id));
  }, []);
  //
  useEffect(() => {
    const fetchUserRatingAndReview = async () => {
      try {
        const rateAndReviewRef = doc(db, "rateAndReview", orderId);
        const rateAndReviewSnapshot = await getDoc(rateAndReviewRef);

        if (rateAndReviewSnapshot.exists()) {
          const rateAndReviewData = rateAndReviewSnapshot.data();
          setPharmacyRating(rateAndReviewData.pharmacyRating);
          setReviewDescription(rateAndReviewData.reviewDescription);
        }
      } catch (error) {
        console.error("Error fetching user rating and review: ", error);
      }
    };

    fetchUserRatingAndReview();
  }, []);

  //
  useEffect(() => {
    const fetchOrderRateAndReview = async () => {
      try {
        const orderRateAndReviewRef = doc(db, "rateAndReview", orderId);
        const orderRateAndReviewRefSnapshot = await getDoc(
          orderRateAndReviewRef
        );

        if (orderRateAndReviewRefSnapshot.exists()) {
          const orderRateAndReviewData = orderRateAndReviewRefSnapshot.data();
          if (orderRateAndReviewData.orderId === orderId) {
            setIsRated(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user rating and review: ", error);
      }
    };

    fetchOrderRateAndReview();
  }, []);

  //
  const submitRatingReview = async () => {
    try {
      const rateAndReviewRef = doc(db, "rateAndReview", orderId);

      const data = {
        pharmacyRating,
        reviewDescription,
        sellerId: seller,
        customerId: customerId,
        orderId: orderId,
        reviewedAt: serverTimestamp(),
      };

      await setDoc(rateAndReviewRef, data);
      ToastAndroid.show("Successfully rated", ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting rating and review: ", error);
    }
  };

  //
  const fetchPharmacyRatings = async () => {
    try {
      const ratingsCollectionRef = collection(db, "rateAndReview");
      const ratingsQuery = query(
        ratingsCollectionRef,
        where("sellerId", "==", seller)
      );
      const querySnapshot = await getDocs(ratingsQuery);

      const pharmacyRatings = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pharmacyRatings.push(data.pharmacyRating);
      });
      //console.log("Pharmacy Ratings:", pharmacyRatings);
    } catch (error) {
      console.error("Error fetching pharmacy ratings:", error);
    }
  };

  useEffect(() => {
    if (seller) {
      fetchPharmacyRatings();
    }
  }, [seller]);
  console.log("ProductName:", productName);
  return (
    <View style={[styles.container, { height: deviceHeight - 55 }]}>
      <View style={styles.containerRate}>
        <Text style={styles.pharmacyBranch}>{pharmacyBranch}</Text>
        <Text style={styles.rateInstruction}>
          Give an overall rating of your experience
        </Text>
        <View style={styles.separator} />

        <View style={styles.starContainer}>
          <Text style={styles.rateText}>Rate pharmacy:</Text>
          <View style={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star, "pharmacy")}
                style={styles.star}
                disabled={isRated}
              >
                <Icon
                  name="star"
                  size={25}
                  color={star <= pharmacyRating ? "#FAC63E" : "grey"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reviewView}>
          <Text style={styles.reviewText}>Review</Text>
          <View style={styles.reviewInputView}>
            <View style={styles.inputReview}>
              <TextInput
                placeholder="Describe your experience (optional)"
                maxLength={150}
                multiline
                style={[isRated ? styles.disabledTextInput : null]}
                value={reviewDescription}
                editable={!isRated}
                onChangeText={handleReviewChange}
              />
            </View>
          </View>
          {!isRated && (
            <Text style={styles.countCharactersInput}>
              {" "}
              {characterCount}/150
            </Text>
          )}
        </View>

        {!isRated && (
          <TouchableOpacity
            style={styles.submitContainer}
            onPress={submitRatingReview}
          >
            <Text style={styles.submitText}>SUBMIT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RateScreen;
