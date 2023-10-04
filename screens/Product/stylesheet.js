import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 10,
    color: "#3C3C3C",
  },
  container: {
    width: "95%",
    alignSelf: "center",
  },
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    alignSelf: "center",
    marginTop: 15,
  },
  searchCont: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    width: "82%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1.5,
    marginVertical: 10,
  },
  iconSearch: {
    marginRight: 10,
    color: "black",
  },
  iconFilterCont: {
    backgroundColor: "black",
    padding: 10,
    marginLeft: 15,
    borderRadius: 15,
  },
  productSelectionText: {
    color: "#3A3A3A",
    fontSize: 16,
    fontWeight: 600,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 12,
  },

  //Product Container/Card

  productContainer: {
    width: "45%",
    alignSelf: "center",
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  productCard: {
    backgroundColor: "white",
    height: 250,
    borderRadius: 15,
    padding: 17,
    width: 180,
    elevation: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 15,
  },
  productReq: {
    fontWeight: 400,
    fontSize: 8,
    color: "#0CB669",
    marginTop: 8,
    textAlign: "center",
  },
  productPrice: {
    fontWeight: 600,
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  addtocartButton: {
    backgroundColor: "#EC6F56",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 10,
    width: "90%",
    marginTop: 3,
  },
  addtocartText: {
    color: "white",
    marginRight: 10,
    fontSize: 12,
    fontWeight: 500,
  },
  image: {
    width: "100%",
    height: 90,
  },
  imageContainer: {
    width: "100%",
    borderRadius: 2,
  },
});

export default styles;
