import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 60,
    backgroundColor: "white",
    width: "100%",
    flex: 1,
  },
  centerContainer: {
    width: "80%",
    alignSelf: "center",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 500,
    textAlign: "center",
    color: "#3A3A3A",
  },
  inputStyle1: {
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.5)",
    fontSize: 15,
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    height: 45,
    marginBottom: 13,
    height: 50,
    marginTop: 15,
  },
  inputStyle: {
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.5)",
    fontSize: 15,
    borderRadius: 15,
    paddingLeft: 20,
    paddingRight: 20,
    height: 45,
    marginBottom: 13,
    height: 50,
  },
  termsView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  termsText: {
    color: "#EC6F56",
    fontWeight: "bold",
  },
  checkBox: {
    marginRight: 5,
  },
  registerTO: {
    backgroundColor: "#EC6F56",
    width: "95%",
    padding: 15,
    borderRadius: 20,
    alignSelf: "center",
  },
  registerText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginView: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    marginLeft: 5,
    color: "#EC6F56",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default styles;
