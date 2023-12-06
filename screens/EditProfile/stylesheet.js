import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wholeContainer: {
    backgroundColor: "white",
    paddingBottom: 400,
    borderRadius: 20,
  },
  upperContainer: {
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Center items horizontally
  },
  lowerContainer: {
    width: "80%",
    marginTop: 5,
    marginLeft: 40,
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    marginTop: 20,
  },
  pic_cont: {
    width: 120,
    height: 120,
    marginTop: 7,
  },
  camera: {
    backgroundColor: "#EC6F56", //black
    padding: 7,
    borderRadius: 24,
    marginVertical: -33,
    marginLeft: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 6,
    marginBottom: 8,
  },
  infoContView: {
    backgroundColor: "#F5F2F2",
    padding: 10,
    borderRadius: 20,
    height: 45,
    justifyContent: "center",
  },
  infoContViewBirthdate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F2F2",
    padding: 10,
    borderRadius: 20,
    height: 45,
  },
  info: {
    fontSize: 15,
    marginLeft: 10,
  },
  disabledInput: {
    color: "black",
  },
  infoGender: {
    marginLeft: -5,
  },
  labelInfoCont: {
    marginVertical: 6,
  },
  labelInfoContValidId: {
    marginTop: 10,
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add this line
  },

  addButtonView: {
    width: "85%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "black",
    width: "100%",
    padding: 15,
    borderRadius: 25,
  },
  addText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  reasonContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F5F2F2",
    padding: 10,
    borderRadius: 20,
    height: "auto",
    justifyContent: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  reasonLabel: {
    fontSize: 16,
    color: "#DC3642",
    fontWeight: 600,
    marginBottom: 5,
    marginLeft: 10,
  },
  rejectedReasonText: {
    fontSize: 16,
    color: "#4E4E4E",
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
    textAlign: "justify",
  },
  chooseFileTouchable: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    width: "100%",
    borderRadius: 25,
    fontSize: 12,
    fontWeight: 400,
    padding: 10,
    marginTop: 5,
    fontSize: 12,
    marginTop: 5,
  },
  chooseFileText: {
    color: "#4E4E4E",
  },
  fileDisplayText: {
    flex: 1,
    color: "#4E4E4E",
    marginLeft: 10,
    overflow: "hidden",
    maxWidth: "80%",
  },
  chooseFileTextView: {
    backgroundColor: "#F5F2F2",
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 8,
  },
  statusView: {
    flexDirection: "row",
    //backgroundColor: "red",
  },
  statusText: {
    fontSize: 15,
    color: "#DC3642",
    marginLeft: 10,
  },
  verifyStatusCont: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountVerificationText: {
    fontSize: 16,
    color: "#4E4E4E",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
  },
  disabledEditButton: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 30,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: {
    flex: 1,
    position: "relative",
  },
});

export default styles;
