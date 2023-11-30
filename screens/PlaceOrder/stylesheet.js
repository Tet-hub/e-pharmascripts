import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: "center",
    width: "100%",
  },
  delAddressContainer: {
    width: "80%",
    flexDirection: "row",
    marginTop: 30,
    alignSelf: "center",
  },
  delInfoContainer: {
    marginLeft: 15,
    width: "85%",
  },
  deliveryTitle: {
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 10,
  },
  customerName: {
    fontWeight: 300,
    fontSize: 13,
  },
  customerNumber: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
  },
  customerAddress: {
    fontWeight: 300,
    fontSize: 13,
    marginTop: 3,
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
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "80%",
    height: 120,
    alignSelf: "center",
  },
  imageContainer: {
    height: "80%",
    width: "35%",
    marginRight: 15,
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
  },
  productImage: {
    flex: 1,
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
  },
  productInfoContainer: {
    flex: 1,
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
  pmentDetailsContainer: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  pmentDetailsText: {
    fontWeight: 500,
    fontSize: 14,
  },
  subtotalContainer: {
    width: "80%",
    marginLeft: 50,
    marginTop: 10,
  },
  psSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  pdTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  ttCont: {
    justifyContent: "flex-end",
  },
  pdTotalText: {
    fontWeight: 600,
    fontSize: 15,
  },
  pdTotalAmountText: {
    fontWeight: 600,
    fontSize: 15,
    textAlign: "right",
  },
  psSubtotalText: {
    fontSize: 15,
    fontWeight: 300,
  },
  totalContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
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
    fontSize: 16,
    marginRight: 11,
  },
  delArrowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "60%",
  },
  bottomContainer: {
    justifyContent: "flex-end",
    bottom: 15,
  },
  reminderText: {
    fontSize: 10,
    fontWeight: 200,
    fontStyle: "italic",
  },
  methodContainer: {
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 0.5,
    borderRadius: 12,
    width: "40%",
    padding: 12,
  },
  paymentMethodContainer: {
    width: "97%",
    alignSelf: "center",
    marginTop: 10,
    marginLeft: -22,
  },
  pmText: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 4,
    marginLeft: 30,
  },
  pmOptions: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    flexDirection: "row",
  },
  methodSeparator: {
    marginTop: 8,
    height: 1,
    width: "90%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  methodsIcon: {
    color: "black",
  },
  methodsText: {
    fontWeight: 400,
    marginLeft: 12,
  },
  selectedMethod: {
    backgroundColor: "#EC6F56",
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
  },
  selectedText: {
    color: "white",
    fontWeight: 700,
    fontSize: 15,
  },
  selectedIcon: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
});

export default styles;
