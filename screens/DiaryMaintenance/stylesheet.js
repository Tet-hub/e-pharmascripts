import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenTitle: {
    fontWeight: 500,
    fontSize: 18,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  takeText: {
    textAlign: "center",
    fontWeight: 400,
    fontSize: 14,
    marginTop: 25,
    marginBottom: 25,
  },
  trackerContainerMT: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    height: 120,
    elevation: 3,
  },
  switchButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  maintenanceName: {
    fontSize: 15,
    fontWeight: 400,
    marginTop: 18,
    marginLeft: 30,
  },
  timeText: {
    fontWeight: 600,
    fontSize: 24,
    marginLeft: 30,
    marginTop: 5,
    marginBottom: 5,
  },
  whenText: {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 30,
    color: "rgba(0, 0, 0, 0.7)",
  },
  addButton: {
    backgroundColor: "black",
    alignSelf: "center",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
    position: "absolute",
    bottom: 20,
  },
  trackerContainerST: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    height: 180,
    elevation: 2,
  },
  rowContainer: {
    marginTop: 15,
    width: "80%",
    alignSelf: "center",
    marginLeft: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  numberContainer: {
    backgroundColor: "#F5F2F2",
    justifyContent: "center",
    paddingHorizontal: 10, // Add horizontal padding
    paddingVertical: 5,
    width: 50, // Set a fixed width for the number container
    justifyContent: "center",
    alignItems: "center", // Center the text horizontally and vertically
    borderRadius: 20,
  },
});

export default styles;
