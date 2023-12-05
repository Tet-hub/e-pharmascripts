import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchTexInputView: {
    width: "90%",
  },
  xButton: {
    backgroundColor: "black",
    borderRadius: 50,
    padding: 3,
    marginLeft: 5,
  },
  searchButtonIcon: {},
  searchCont: {
    height: "80%",
    padding: 10,
    borderRadius: 15,
    width: "100%",
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
    color: "gray",
  },
  inputSearch: {
    flex: 1,
  },
  //Flatlist Styles
  container: {
    flex: 1,
  },
  pharmacyContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  pharmacyCard: {
    height: 205,
    borderRadius: 15,
    backgroundColor: "white",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 90,
    borderRadius: 15,
    marginTop: 5,
  },
  pharmacyName: {
    textAlign: "center",
    color: "#3C3C3C",
    fontWeight: "600",
    fontSize: 14,
    paddingTop: 5,
    height: 40,
  },
  viewButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EC6F56",
    borderRadius: 15,
    alignSelf: "center",
  },
  viewButtonText: {
    color: "#EC6F56",
    fontSize: 11,
    fontWeight: "500",
    marginRight: 3,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 100, // backgroundColor: "rgba(0, 0, 0, 0.1)", // Semi-transparent background
  },
  noOrdersCont: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 90,
  },
  noOrders: {
    fontSize: 20,
    alignSelf: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  noOrdersIcon: {
    alignSelf: "center",
    marginBottom: 5,
    color: "#36454F",
  },
  noOrdersText: {
    fontWeight: 300,
  },
});

export default styles;
