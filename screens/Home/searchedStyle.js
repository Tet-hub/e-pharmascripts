import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const styles = StyleSheet.create({
  containerView: {
    width: "90%",
    flex: 1,
    alignSelf: "center",
  },
  ePharmaScriptsView: {
    marginLeft: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  eText: {
    color: "black",
    fontSize: 22,
    fontWeight: 600,
  },
  PharmaScriptsText: {
    color: "#EC6F56",
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
  searchIconView: {
    backgroundColor: "white",
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 3,
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 1,
    borderRadius: 10,
  },
  searchTextInput: {
    marginLeft: 5,
  },
  searchTexInputView: {
    width: "90%",
  },
  iconSearch: {
    color: "black",
  },
  iconFilterCont: {
    backgroundColor: "black",
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
    marginLeft: 10,
    borderRadius: 15,
  },
  productSelectionText: {
    fontSize: 15,
    fontWeight: 400,
    color: "#3A3A3A",
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  noResultsText: {
    color: "#3A3A3A",
    marginLeft: 15,
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 400,
  },
  productBorder: {
    marginTop: 7,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 5,
  },
  insideBorder: {
    flexDirection: "row",
    width: "100f%",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  productNameText: {
    fontWeight: 600,
    fontSize: 13,
  },
  locationTextDisplay: {
    fontWeight: 300,
    fontSize: 8,
    marginTop: 5,
  },
  priceText: {
    fontWeight: 600,
    fontSize: 17,
    color: "#3C3C3C",
    marginRight: 10,
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
  resetText: {
    fontWeight: 700,
    fontSize: 14,
    color: "#8E8E8E",
    textAlign: "center",
  },
  applyText: {
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    textAlign: "center",
  },
  resetTO: {
    borderWidth: 1,
    borderColor: "#8E8E8E",
    padding: 10,
    borderRadius: 5,
    width: "45%",
  },
  applyTO: {
    backgroundColor: "#EC6F56",
    padding: 10,
    borderRadius: 5,
    width: "45%",
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
});

export default styles;
