import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  searchFilterCont: {
    flexDirection: "row",
    alignItems: "center",
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
  inputSearch: {
    flex: 1,
  },
  iconFilterCont: {
    backgroundColor: "black",
    padding: 10,
    marginLeft: 15,
    borderRadius: 15,
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
    height: 200,
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
});

export default styles;
