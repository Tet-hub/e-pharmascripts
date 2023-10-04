import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20, // Apply a border radius to the top left corner
    borderTopRightRadius: 20, // Apply a border radius to the top right corner
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  productCard: {
    height: 230,
    borderRadius: 15,
    backgroundColor: "white",
    padding: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
    marginBottom: 15,
    marginLeft: 20,
  },
  productImage: {
    width: "90%",
    height: 100,
    marginBottom: -10,
    flex: 1,
    resizeMode: "contain",
    alignSelf: "center",
  },
  productName: {
    fontWeight: 600,
    fontSize: 12,
    color: "#3C3C3C",
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
    marginTop: 10,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#EC6F56",
    justifyContent: "center", // Vertical centering
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginRight: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  addText: {
    color: "white",
    fontWeight: 600,
    fontSize: 12,
  },
  xButton: {
    marginTop: 3,
    marginLeft: 5,
    marginBottom: -15,
  },
});

export default styles;
