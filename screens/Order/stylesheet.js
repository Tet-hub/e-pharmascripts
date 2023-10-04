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
    flexDirection: "row",
    alignItems: "center", // Added to vertically align the image and info
    paddingHorizontal: 16, // Added to provide some spacing
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    width: "90%",
    height: 120,
    alignSelf: "center",
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
  proceedButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
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
    marginTop: 25,
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
    backgroundColor: "white",
    borderColor: "#EC6F56",
    borderWidth: 1,
    paddingBottom: 15,
    paddingTop: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  rateButton: {
    backgroundColor: "#EC6F56",
    paddingBottom: 15,
    paddingTop: 15,
    paddingRight: 30,
    paddingLeft: 30,
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
});

export default styles;
