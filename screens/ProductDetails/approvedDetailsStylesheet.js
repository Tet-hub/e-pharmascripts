import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },
  imageContainer: {
    width: "70%",
    alignSelf: "center",
    marginTop: 15,
  },
  image: {
    width: "100%",
    resizeMode: "contain",
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

  quantityText: {
    color: "#8E8E8E",
    fontWeight: 400,
    fontSize: 12,
    textAlign: "right",
    marginTop: 20,
  },
  removerOrderButton: {
    backgroundColor: "#DC3642",
    borderRadius: 30,
    padding: 20,
    position: "absolute",
    bottom: -100,
    width: "100%",
  },
  removerOrderText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    textAlign: "center",
  },
});

export default styles;
