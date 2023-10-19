import { StyleSheet, Dimensions } from "react-native";
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 20,
    marginLeft: 20,
  },
  line: {
    height: 0.5,
    width: "90%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 20,
  },
  imgPharmacyNameView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  companyNameText: {
    fontSize: 14,
    fontWeight: 400,
    color: "#3C3C3C",
    marginLeft: 35,
    marginTop: 10,
  },
  branchText: {
    fontSize: 15,
    fontWeight: 600,
    color: "#3C3C3C",
    marginTop: 8,
  },
  companyNameView: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "55%",
  },
  pharmacyImageContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 10,
    height: 140,
    width: 150,
    padding: 10,
    marginRight: 10,
  },
  pharmacyDetailsText: {
    color: "white",
    fontWeight: 500,
    fontSize: 12,
    textAlign: "center",
    padding: 15,
  },
  pharmacyDetailsView: {
    width: "40%",
    borderRadius: 20,
    backgroundColor: "black",
    marginTop: 25,
  },
  pharmacyView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  pharmacyText: {
    fontSize: 14,
    fontWeight: 500,
  },
  companyNameTextTop: {
    color: "#3C3C3C",
    fontWeight: 600,
    fontSize: 15,
    marginTop: 10,
  },
  locationView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 500,
  },
  addressText: {
    color: "#3C3C3C",
    fontWeight: 400,
    fontSize: 14,
    marginLeft: 35,
    marginTop: 10,
  },
  ratingsView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  ratingsText: {
    fontSize: 14,
    fontWeight: 500,
  },
  starRating: {
    flexDirection: "row",
  },
  star: {
    marginRight: 5,
    alignItems: "center",
  },
  ratingsStarView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  averageStar: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: 600,
  },
  nameStarView: {
    flexDirection: "row",
    marginTop: 20,
    height: "100%",
  },
  ratingsReviewsView: {
    marginLeft: 17,
    height: "100%",
    width: "70%",
  },
  ratingReviewBackground: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    marginTop: 10,
    height: 150,
  },
  reviewText: {
    fontSize: 12,
    fontWeight: 300,
    color: "#4E4E4E",
    marginTop: 10,
  },
  raterNameText: {
    fontWeight: 600,
    fontSize: 12,
  },
  starRatingReviews: {
    flexDirection: "row",
    marginTop: 5,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: 500,
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 15,
  },
  seeAllTextView: {
    backgroundColor: "#F5F5F5",
    marginTop: 5,
    borderRadius: 5,
  },
  noReviewsText: {
    backgroundColor: "#F5F5F5",
    marginTop: 10,
    borderRadius: 5,
    textAlign: "center",
    paddingTop: 15,
    paddingBottom: 15,
  },
  reviewTextView: {
    width: "100%",
  },
});

export default styles;
