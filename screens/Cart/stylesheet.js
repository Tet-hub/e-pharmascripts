import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
  },
  itemsContainer: {
    width: "90%",
    alignSelf: "center",
    bottom: 100, //brute force padding from the checkout container
  },
  screenTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 500,
  },
  selectedProductContainer: {
    height: "100%",
    paddingTop: "30%",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3,
    width: "100%",
    height: 120,
    alignSelf: "center",
    marginTop: 15,
  },
  imageContainer: {
    marginLeft: 10,
    width: "40%",
  },
  productImage: {
    height: 120,
    width: "100%",
    marginLeft: -15,
    flex: 1,
    resizeMode: "contain",
  },
  productInfoContainer: {
    flex: 1,
  },
  priceRowContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontWeight: 600,
    fontSize: 14,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 500,
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: 300,
  },
  xButtonWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    marginRight: 3,
    marginTop: 3,
  },
  checkBoxIcon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  quantityButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 300,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  checkoutContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 10, //brute force padding from the checkout tab navigator
    borderRadius: 20,
    width: "100%",
    paddingVertical: 15,
    elevation: 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "60%",
    justifyContent: "space-between",
  },
  delFeeContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "60%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "60%",
    marginTop: 10,
    marginBottom: 20,
  },
  checkoutText: {
    fontWeight: 700,
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  checkoutWrapper: {
    backgroundColor: "#DC3642",
    width: "85%",
    alignSelf: "center",
    borderRadius: 30,
    padding: 20,
  },
  priceText: {
    fontWeight: 400,
    fontSize: 15,
  },
  delFeeText: {
    fontWeight: 400,
    fontSize: 15,
  },
  amountText: {
    fontWeight: 400,
    fontSize: 15,
  },
  totalText: {
    fontWeight: 600,
    fontSize: 15,
    color: "#EC6F56",
  },
  totalAmountText: {
    fontWeight: 600,
    fontSize: 15,
    color: "#EC6F56",
  },
  button: {
    paddingHorizontal: 5,
  },
  quantityText: {
    marginHorizontal: 7,
    fontSize: 14,
    fontWeight: 500,
  },
  totalContainer: {
    width: "80%",
    alignSelf: "center",
    // marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  totalPmentText: {
    fontSize: 12,
    fontWeight: 600,
    marginRight: 20,
  },
  totalAmountText: {
    fontWeight: 700,
    color: "#EC6F56",
    fontSize: 12,
    marginRight: 11,
  },
  tpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  ordernowText: {
    fontWeight: 600,
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  ordernowButton: {
    backgroundColor: "#DC3642",
    padding: 15,
    borderRadius: 30,
    width: "100%",
  },
  sellerContainer: {
    backgroundColor: "#f0f0f0", // Background color for the seller container
    padding: 10, // Padding around the seller container
    marginBottom: 10, // Margin at the bottom to separate seller containers
    // Add any other styles you want for the seller container here
  },
  sellerName: {
    fontWeight: "bold", // Style for the seller's name
    fontSize: 16, // Adjust the font size as needed
  },
});

export default styles;
