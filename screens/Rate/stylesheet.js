import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  productName: {
    fontWeight: "600",
    fontSize: 20,
    marginTop: 5,
  },
  rateInstruction: {
    fontWeight: "300",
    fontSize: 14,
    marginTop: 10,
  },
  containerRate: {
    marginTop: 20,
    width: "85%",
    alignSelf: "center",
    height: "100%",
  },
  starContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starRating: {
    flexDirection: "row",
    marginTop: 10,
  },
  star: {
    marginRight: 18,
    alignItems: "center",
  },
  rateText: {
    fontSize: 14,
    fontWeight: 300,
  },
  submitContainer: {
    backgroundColor: "#EC6F56",
    alignSelf: "center",
    width: "85%",
    padding: 15,
    borderRadius: 30,
    zIndex: 1,
    position: "absolute",
    bottom: 40,
  },
  submitText: {
    textAlign: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: "100%",
    backgroundColor: "#D9D9D9",
    alignSelf: "center",
  },
});

export default styles;
