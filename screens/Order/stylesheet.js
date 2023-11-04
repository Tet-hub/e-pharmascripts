import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  screenTitle: {
    fontWeight: 500,
    fontSize: 18,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
  },
  productContainer: {
    // Added to provide some spacing
    // backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  productDataContainer: {
    flexDirection: "row",
    alignItems: "center", // Added to vertically align the image and info
    paddingHorizontal: 16,
    height: 120,
  },
  imageContainer: {
    marginLeft: 15,
    width: "40%",
  },
  productImage: {
    height: 120, // Adjust the height as needed
    width: "100%", // Make the image take the entire container width
    marginLeft: -15,
    flex: 1,
    resizeMode: "contain",
  },
  productInfoContainer: {
    flex: 1, // Product info takes 50% of the container width
  },
  priceRowContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    fontWeight: 600,
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 500,
  },
  productAmount: {
    fontSize: 14,
    fontWeight: 300,
  },
  xButtonWrapper: {
    position: "absolute",
    top: 5, // Adjust the top position as needed
    right: 5, // Adjust the right position as needed
    marginRight: 3,
    marginTop: 3,
  },
  checkBoxIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  proceedButton: {
    backgroundColor: "#DC3642",
    borderRadius: 30,
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 30,
    paddingLeft: 30,
    zIndex: 3,
    width: "80%",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "#DFFF00",
    zIndex: 2, // Ensure the footer is on top
  },
  proceedButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10, // Adjust this value as needed
  },
  // proceedButtonContainer: {
  //   flexDirection: "row",
  //   backgroundColor: "white",
  //   position: "absolute",
  //   left: "5%",
  //   right: "5%",
  //   borderRadius: 20,
  //   width: "90%",
  //   paddingVertical: 15,
  //   elevation: 15,
  //   alignItems: "center",
  //   justifyContent: "flex-end",
  //   alignSelf: "center",
  //   padding: 10,
  // },
  proceedText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 20,
  },
  completedOrderContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    width: "90%",
    height: 175,
    marginTop: 5,
    paddingHorizontal: 16, // Added to provide some spacing
    alignSelf: "center",
  },
  completedProductContainer: {
    flexDirection: "row",
    alignItems: "center", // Added to vertically align the image and info
  },
  viewRateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -10,
  },
  viewText: {
    fontWeight: 600,
    fontSize: 12,
    color: "#EC6F56",
  },
  rateText: {
    fontWeight: 600,
    fontSize: 12,
    color: "white",
  },
  viewButton: {
    marginRight: 15,
  },
  rateButton: {
    backgroundColor: "#EC6F56",
    paddingBottom: 15,
    paddingTop: 15,
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 10,
  },
  //image style for completed screen
  imageContainerCompletedScreen: {
    width: "40%",
    marginRight: 15,
  },
  productImageCompletedScreen: {
    height: 120, // Adjust the height as needed
    width: "100%", // Make the image take the entire container width
    resizeMode: "contain",
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  homeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  noOrdersCont: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  noOrders: {
    fontSize: 20,
    alignSelf: "center",
    // backgroundColor: "#4CAF",
  },
  orderGroupContainer: {
    flex: 1,
    // width: "90%",
    // alignSelf: "center",
    // backgroundColor: "yellow",

    backgroundColor: "#FFFFFF",
    padding: 10,
    marginBottom: 15,
    borderRadius: 20,
  },
  viewOrderDetails: {
    flexDirection: "row",
    margin: 10,
  },
  viewMoreText: {
    margin: 10,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  separator2: {
    marginTop: 60,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
});

export default styles;
