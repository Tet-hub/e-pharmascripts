import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  upperContainer: {
    backgroundColor: "#EC6F56",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 180,
  },
  screenTitle: {
    fontWeight: 600,
    fontSize: 20,
    color: "white",
    marginTop: 20,
    marginLeft: 20,
  },
  uptoText: {
    color: "white",
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    fontWeight: 400,
  },
  amountText: {
    color: "white",
    fontSize: 32,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 20,
  },
  lowerContainer: {
    backgroundColor: "white",
    height: height,
  },
  line: {
    height: 0.5,
    width: "90%",
    backgroundColor: "black",
    marginTop: 20,
    marginBottom: 15,
    marginLeft: 20,
  },
  activateText: {
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    textAlign: "center",
  },
  activateButton: {
    backgroundColor: "#EC6F56",
    marginTop: 20,
    paddingTop: 15,
    borderRadius: 30,
    paddingBottom: 15,
    width: 160, // Add a fixed width to control the button size
    alignSelf: "center", // Center the button horizontally
  },
  benefitsText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 20,
  },
  boldTitle: {
    color: "#3A3A3A",
    fontWeight: 600,
    fontSize: 16,
    marginTop: 15,
  },
  lightInfo: {
    fontWeight: 300,
    fontSize: 14,
    marginTop: 15,
  },
  benefitsInfoContainer: {
    width: "80%",
    marginLeft: 40,
  },
  howText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 5,
  },
  calendarBillingContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 30,
    alignItems: "center", // Center vertical
    width: "80%",
  },
  billingText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 20,
    color: "#3A3A3A",
  },
  monthText: {
    fontSize: 16,
    fontWeight: 300,
    marginLeft: 38,
  },
  verticalLine: {
    height: "200%",
    width: 2,
    backgroundColor: "black",
    marginLeft: 15,
  },
});

export default styles;
