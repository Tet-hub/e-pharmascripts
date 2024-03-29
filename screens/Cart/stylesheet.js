import { StyleSheet, Dimensions } from "react-native";
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 2, // Ensure the title is on top
  },
  screenTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 500,
    paddingLeft: 20,
  },
  bodyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  itemsContainer: {
    width: "100%",
    alignSelf: "center",
  },
  cartContainer: {
    width: "90%",
    alignSelf: "center",
    bottom: 69, //brute force padding from the checkout container
  },

  selectedProductContainer: {
    height: "100%",
    paddingTop: "20%",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 100,
    width: "100%",
    alignSelf: "center",
    marginTop: 9,
    marginBottom: 15,
    borderEndWidth: 2,
    borderStartWidth: 2,
    borderRadius: 13,
    borderColor: "#E0E0E0",
  },
  imageContainer: {
    marginLeft: 30,
    height: "70%",
    width: "25%",
  },
  noOrdersCont: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 50,
    marginVertical: "50%",
  },
  noOrders: {
    fontSize: 20,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  noOrdersIcon: {
    alignSelf: "center",
    marginBottom: 5,
    color: "#36454F",
  },
  productImage: {
    flex: 1,
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
    marginLeft: -15,
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
    marginTop: 15,
    marginBottom: 25,
    height: 0.85,
    width: "100%",
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
  },
  productSeparator: {
    marginTop: 15,
    height: 1,
    width: "95%",
    backgroundColor: "#CCCCCC",
    alignSelf: "center",
    elevation: 0.5,
    borderWidth: 1,
  },
  footer: {
    position: "absolute",
    bottom: 73,
    left: 0,
    right: 0,
    // backgroundColor: "#DFFF00",
    // borderTopWidth: 1,
    // borderTopColor: "#E0E0E0",
    zIndex: 2, // Ensure the footer is on top
  },
  //here
  checkoutContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    position: "absolute",
    left: "5%",
    right: "5%",
    borderRadius: 20,
    width: "90%",
    paddingVertical: 10,
    elevation: 5,
    alignItems: "center",
    justifyContent: "flex-end",
    alignSelf: "center",
    padding: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "60%",
    justifyContent: "space-between",
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
  pdTotalAmountText: {
    fontWeight: 600,
    fontSize: 15,
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
    width: "50%",
  },
  sellerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 25,
    borderRadius: 15,
  },
  sellerNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  sellerName: {
    fontWeight: "500",
    fontSize: 18,
    marginLeft: 10, // Add margin for spacing
  },
  checkBoxIcon: {
    alignSelf: "center", // Align the checkbox centrally within its container
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "50%",
    // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  noOrdersText: {
    fontWeight: 300,
  },
  verticalSeparator: {
    width: 3,
    height: "100%",
    backgroundColor: "rgba(217, 217, 217, 0.9) ",
    alignSelf: "center",
    marginLeft: 15,
  },
  disabledbuynowView: {
    flexDirection: "row",
    backgroundColor: "#D1D1D1",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 30,
    width: "60%",
  },
  disabledBuynowText: {
    color: "black",
    fontSize: 14,
    fontWeight: 700,
    marginLeft: 5,
  },
});

export default styles;
