import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "white",
  //   borderTopRightRadius: 20,
  //   borderTopLeftRadius: 20,
  //   alignSelf: "center",
  //   width: "100%",
  //   marginTop: 20,
  //   height: "100%",
  //   paddingBottom: 20,
  // },
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignSelf: "center",
    width: "100%",
    height: "100%",
    paddingBottom: 40,
    marginTop: 20,
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
  separator3: {
    flex: 1,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  productContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    width: "80%",
    height: 120,
    alignSelf: "center",
    justifyContent: "center",
  },
  imageContainer: {
    height: "60%",
    width: "30%",
    marginRight: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  productImage: {
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
  },
  productReq: {
    fontWeight: "normal",
    fontSize: 7,
    color: "#0CB669",
    marginTop: 5,
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
    flex: 1,
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
  pdTotalText: {
    fontWeight: 600,
    fontSize: 15,
  },
  pdTotalAmountText: {
    fontWeight: 600,
    fontSize: 15,
  },
  psSubtotalText: {
    fontSize: 15,
    fontWeight: 300,
  },
  totalContainer: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
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
    flex: 1,
    flexDirection: "column", // Display children in a column
    alignItems: "center", // Center children horizontally
    justifyContent: "flex-start", // Align content to the top
  },
  uploadPresCont: {
    flex: 1,
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
    height: "100%",
    marginBottom: 10,
    paddingBottom: 10,
  },
  reminderText: {
    fontSize: 12,
    fontWeight: 200,
    fontStyle: "italic",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: "70%",
    justifyContent: "space-between",
  },
  uploadText: {
    fontSize: 14,
    fontWeight: 400,
  },
  addStyle: {
    fontSize: 20,
    fontWeight: 600,
    color: "white",
    alignSelf: "center",
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#EC6F56",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
  },
  prescriptionImageCont: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: "100%",
    marginBottom: 10,
  },
  imageAndNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
  },
  selectedImageName: {
    fontSize: 15,
    alignSelf: "center",
    overflow: "hidden",
    maxWidth: "65%",
    marginLeft: 10,
  },
  selectedImageCont: {
    height: "60%",
    width: "20%",
  },
  selectedImage: {
    resizeMode: "stretch",
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  // selectedImageName: {
  //   fontSize: 14,
  //   color: "red",
  //   maxWidth: 20,
  //   overflow: "hidden",
  //   whiteSpace: "nowrap",
  //   textOverflow: "ellipsis",
  // },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  xButtonWrapper: {
    marginRight: 15,
  },
});

export default styles;
