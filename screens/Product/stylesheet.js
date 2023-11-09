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
  },
  searchCont: {
    padding: 10,
    borderRadius: 15,
    width: "80%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1.5,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
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
    color: "black",
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
  searchTexInputView: {
    width: "90%",
  },
  searchTextInput: {
    marginLeft: 5,
  },
  //MODAL
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    width: "80%",
    height: "100%",
  },
  //DRAWER
  drawerContainer: {
    width: "75%",
    alignSelf: "center",
  },
  drawerTitle: {
    fontWeight: 600,
    fontSize: 18,
    color: "#EC6F56",
    marginTop: 30,
  },
  locationView: {
    marginTop: 30,
  },
  locationText: {
    fontWeight: 600,
    fontSize: 14,
  },
  locationTO: {
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
  },
  searchlocationText: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
  },
  separator: {
    marginTop: 40,
    height: 1,
    width: "100%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
  priceView: {
    marginTop: 30,
  },
  priceText: {
    fontWeight: 600,
    fontSize: 14,
  },
  lowToHighTO: {
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    padding: 10,
    marginTop: 30,
  },
  highToLowTO: {
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    padding: 10,
    marginTop: 25,
  },
  lowToHighTOText: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
  },
  highToLowTOText: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
  },
  resetApplyView: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closeText: {
    fontWeight: 600,
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  resetText: {
    fontWeight: 600,
    fontSize: 13,
    color: "#8E8E8E",
    textAlign: "center",
  },
  applyText: {
    color: "white",
    fontWeight: 600,
    fontSize: 13,
    textAlign: "center",
  },
  resetTO: {
    borderWidth: 1,
    borderColor: "#8E8E8E",
    padding: 10,
    borderRadius: 5,
    width: "30%",
  },
  closeTO: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    width: "30%",
  },
  applyTO: {
    backgroundColor: "#EC6F56",
    padding: 10,
    borderRadius: 5,
    width: "30%",
  },
  categoryView: {
    marginTop: 30,
  },
  categoryText: {
    fontWeight: 600,
    fontSize: 14,
  },
  searchCategoryText: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
  },
  categoryTO: {
    borderWidth: 1.5,
    borderColor: "#D9D9D9",
    borderRadius: 5,
    marginTop: 30,
  },
  noResultsText: {
    color: "#3A3A3A",
    marginLeft: 15,
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "50%",

    // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  noOrdersCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "50%",
  },
  noOrders: {
    fontSize: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersIcon: {
    marginBottom: 5,
    color: "#36454F",
  },
  noOrdersText: {
    fontWeight: 300,
  },
});

export default styles;
