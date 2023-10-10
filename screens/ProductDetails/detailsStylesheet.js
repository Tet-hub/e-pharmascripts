import { StyleSheet, Dimensions } from "react-native";

const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollableContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 15,
    paddingHorizontal: 15,
  },
  image: {
    height: (deviceWidth * 2) / 3,
    width: "100%",
  },
  productContentContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  insideContentContainer: {
    width: "85%",
    alignSelf: "center",
  },
  productNameView: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productNameText: {
    fontWeight: 600,
    fontSize: 20,
  },
  productReq: {
    fontWeight: 400,
    fontSize: 10,
    color: "#0CB669",
    marginTop: 10,
  },
  productPrice: {
    fontWeight: 600,
    fontSize: 24,
    textAlign: "right",
    marginTop: 10,
  },
  categoriesText: {
    color: "#8E8E8E",
    fontSize: 11,
    fontWeight: 400,
    marginTop: 10,
  },
  productInformationText: {
    fontSize: 11,
    fontWeight: 600,
    color: "white",
    textAlign: "center",
  },
  productInformationView: {
    backgroundColor: "black",
    borderRadius: 20,
    padding: 15,
    marginTop: 30,
    width: "50%",
  },
  informationView: {
    backgroundColor: "#F5F5F5",
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
  },
  informationContent: {
    fontSize: 10,
    fontWeight: 400,
    color: "#4E4E4E",
    textAlign: "justify",
    lineHeight: 16,
  },
  quantityButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#F5F5F5",
    width: "30%",
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 300,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 5,
  },
  stockText: {
    color: "#8E8E8E",
    fontWeight: 400,
    fontSize: 12,
  },
  quantityStockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  chatnowView: {
    borderColor: "#EC6F56",
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    padding: 10,
    marginRight: 10,
  },
  chatnowText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#EC6F56",
  },
  addtocartView: {
    borderColor: "#EC6F56",
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "38%",
    marginRight: 10,
  },
  addtocartText: {
    fontSize: 12,
    fontWeight: 600,
    color: "#EC6F56",
  },
  buynowView: {
    backgroundColor: "#DC3642",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width: "40%",
  },
  buynowText: {
    color: "white",
    fontSize: 14,
    fontWeight: 600,
  },
  threeButtonsRow: {
    flexDirection: "row",
    padding: 15,
    width: "85%",
    justifyContent: "space-between",
  },
});

export default styles;
