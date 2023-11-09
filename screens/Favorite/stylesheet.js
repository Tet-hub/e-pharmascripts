import { StyleSheet, Dimensions } from "react-native";
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  productCard: {
    borderRadius: 15,
    backgroundColor: "white",
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    height: "100%",
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
  image: {
    height: (deviceWidth * 2) / 9,
    width: "100%",
  },
  productName: {
    fontWeight: 600,
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  productReq: {
    fontWeight: 300,
    fontSize: 7,
    color: "#0CB669",
    textAlign: "center",
    marginTop: 5,
  },
  productPrice: {
    fontWeight: 600,
    fontSize: 15,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#EC6F56",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  addText: {
    color: "white",
    fontWeight: 600,
    fontSize: 12,
  },
  imageContainer: {
    width: "100%",
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  xButton: {
    backgroundColor: "#8E8E8E",
    borderRadius: 50,
    padding: 3,
  },
  xButtonContainer: {
    flexDirection: "row",
    marginLeft: 5,
    marginTop: 5,
    marginBottom: -10,
  },
  noFavoritesText: {
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
    color: "#8E8E8E",
    marginTop: 20,
  },
});

export default styles;
