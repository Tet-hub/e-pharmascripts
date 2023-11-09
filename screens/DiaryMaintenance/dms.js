import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  screenTitle: {
    fontWeight: 500,
    fontSize: 18,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  trackerContainerMT: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 20,
  },
  trackerContainerSelected: {
    //removed
    borderColor: "#EC6F56",
    borderWidth: 1,
    borderRadius: 20,
  },
  columnContainer: {
    backgroundColor: "white",
    flexDirection: "column",
    borderRadius: 20,
    padding: 5,
  },
  reminderNameContainer: {
    backgroundColor: "#8E8E8E",
    borderRadius: 20,
  },
  maintenanceName: {
    fontSize: 15,
    fontWeight: 500,
    marginTop: 15,
    marginLeft: 30,
    marginBottom: 10,
    color: "white",
  },
  maintenanceNameST: {
    fontSize: 15,
    fontWeight: 500,
    marginTop: 21,
    marginLeft: 30,
    color: "black",
  },
  timeText: {
    fontWeight: 400,
    fontSize: 18,
    marginLeft: 40,
    marginTop: 5,
    marginBottom: 5,
  },
  whenText: {
    fontWeight: 400,
    fontSize: 12,
    marginLeft: 30,
    marginBottom: 10,
    color: "white",
  },
  addButton: {
    backgroundColor: "#EC6F56",
    alignSelf: "center",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
  },
  trackerContainerST: {
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    height: 148,
    elevation: 2,
    marginBottom: 20,
  },
  rowContainer: {
    marginTop: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 50, // Adjust the minimum width as needed
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  //
  reminderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  emptyMessage: {
    color: "#8E8E8E",
    fontWeight: 400,
    fontSize: 18,
    textAlign: "center",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  switchContainer: {
    marginRight: 25,
  },
  xButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  xButton: {
    marginRight: 15,
    backgroundColor: "#EC6F56",
    borderRadius: 50,
    padding: 5,
  },
  //MODAL
  modalTitle: {
    fontSize: 17,
    fontWeight: 500,
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    zIndex: -1,
  },
  modalText: {
    fontSize: 15,
    marginLeft: 20,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 160,
  },
});

export default styles;
