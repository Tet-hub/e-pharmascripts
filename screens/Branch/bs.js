import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A3A3A",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchCont: {
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
    flexDirection: "row",
    alignItems: "center",
  },
  searchTexInputView: {
    width: "90%",
  },
  searchTextInput: {
    marginLeft: 5,
  },
  iconFilterCont: {
    backgroundColor: "black",
    padding: 10,
    marginLeft: 15,
    borderRadius: 15,
  },
  iconSearch: {
    marginRight: 10,
    color: "black",
  },
  inputSearch: {
    flex: 1,
  },
  branchSelectionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },

  pharmacyContainer: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  pharmacyCard: {
    borderRadius: 15,
    backgroundColor: "white",
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 16,
  },
  image: {
    width: "80%",
    height: 90,
    borderRadius: 15,
    marginTop: 2,
    marginBottom: 4,
    alignSelf: "center",
  },
  ratingText: {
    textAlign: "left",
    marginLeft: 5,
    color: "#333",
    fontWeight: "500",
    fontSize: 10,
  },
  ratingsRowDiv: {
    flexDirection: "row",
    alignItems: "center",
  },
  pharmacyName: {
    textAlign: "center",
    color: "#3C3C3C",
    fontWeight: "600",
    fontSize: 14,
    paddingTop: 5,
  },
  branchName: {
    textAlign: "center",
    color: "#3C3C3C",
    fontWeight: "600",
    fontSize: 14,
    paddingTop: 2,
  },
  pharmacyDetailsView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#8E8E8E",
    borderRadius: 15,
    backgroundColor: "white",
    padding: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 10,
    width: "80%",
  },
  viewDetailsText: {
    color: "#8E8E8E",
    fontSize: 13,
    fontWeight: 500,
  },
  viewButton: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EC6F56",
    borderRadius: 15,
    backgroundColor: "#EC6F56",
    padding: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    marginTop: 10,
    width: "80%",
    justifyContent: "center",
  },
  viewButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 13,
    textAlign: "center",
  },
  averageStar: {
    fontSize: 10,
    marginLeft: 3,
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

  resetApplyView: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
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
  closeText: {
    fontWeight: 600,
    fontSize: 13,
    color: "white",
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
  distanceText: {
    color: "#4E4E4E",
    fontSize: 10,
    fontWeight: 500,
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
