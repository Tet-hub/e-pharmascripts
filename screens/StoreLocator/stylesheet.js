import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20, // Apply a border radius to the top left corner
    borderTopRightRadius: 20, // Apply a border radius to the top right corner
    flex: 1,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 20,
    textAlign: "center",
  },
  upperContainer: {
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    padding: 10,
    borderRadius: 15,
    width: "82%",
    backgroundColor: "#F5F5F5",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1.5,
  },
  iconSearch: {
    marginRight: 10,
    color: "#EC6F56",
  },
  placeholderSearch: {
    fontSize: 13,
    flex: 1,
    marginLeft: 10,
  },
  locationText: {
    fontWeight: 600,
    fontSize: 16,
    marginTop: 25,
    marginLeft: 40,
  },
});

export default styles;
