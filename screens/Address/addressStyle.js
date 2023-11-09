import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 20,
    marginLeft: 30,
    color: "#3A3A3A",
  },
  line: {
    height: 0.5,
    width: "90%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 20,
  },
  addressView: {
    width: "90%",
    alignSelf: "center",
  },
  addressButton: {
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "center",
    padding: 15,
    width: "100%",
  },
  displayAddressView: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 11,
    width: "100%",
    fontSize: 14,
    fontWeight: 400,
    color: "#3C3C3C",
  },
  addText: {
    fontSize: 14,
    fontWeight: 400,
    color: "white",
  },
  currentTitleView: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 5,
  },
  currentText: {
    fontSize: 14,
    fontWeight: 400,
    color: "#3C3C3C",
  },
});

export default styles;
