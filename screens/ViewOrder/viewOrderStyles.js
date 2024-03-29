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
    height: "100%",
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
    marginTop: 20,
    height: 1,
    width: "85%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  separator3: {
    marginTop: 10,
    marginBottom: 20,
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
  pmentContainer: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  pImgTxt: {
    fontSize: 15,
    fontWeight: 600,
    color: "gray",
    fontStyle: "italic",
    marginBottom: 5,
  },
  methodText: {
    fontWeight: 500,
    fontSize: 14,
  },
  choseMethodTextContainer: {
    backgroundColor: "#8E8E8E",
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
    width: "auto",
    maxWidth: "40%",
    evelation: 2,
  },
  choseMethodText: {
    fontSize: 12,
    fontWeight: 400,
    color: "white",
    textAlign: "center",
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
    marginVertical: 2,
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
    justifyContent: "space-between",
  },
  totalPmentText: {
    fontSize: 20,
    fontWeight: 600,
  },
  totalAmountText: {
    fontWeight: 700,
    color: "#EC6F56",
    fontSize: 20,
    marginRight: 11,
  },
  removerOrderButton: {
    backgroundColor: "#DC3642",
    borderRadius: 20,
    padding: 15,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  removerOrderText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  destructiveButton: {
    backgroundColor: "red", // Change the background color to red (or any color indicating danger)
    // Add more styles as needed (e.g., padding, border-radius, etc.)
  },
  selectedImageName: {
    fontSize: 15,
    alignSelf: "center",
    overflow: "hidden",
    maxWidth: "65%",
    marginLeft: 10,
  },
  selectedImageCont: {
    height: 100,
    width: 100,
    margin: 5,
  },
  selectedImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },

  fullscreenImage: {
    width: "100%",
    height: "80%",
  },
  reminderText: {
    fontSize: 12,
    fontWeight: 500,
    fontStyle: "italic",
    marginBottom: 5,
  },
  closeButton: {
    color: "white",
    fontSize: 18,
    margin: 20,
  },
});

export default styles;
