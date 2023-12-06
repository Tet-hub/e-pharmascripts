import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  insideContainer: {
    width: "85%",
    alignSelf: "center",
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 15,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 20,
    color: "black",
  },
  line: {
    height: 0.5,
    width: "85%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 15,
  },
  titleText: {
    color: "#3C3C3C",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  contentText: {
    color: "#3C3C3C",
    fontWeight: "normal",
    fontSize: 13,
  },
  contentDiv: {
    marginTop: 20,
  },
  contentTitle: {
    color: "#3C3C3C",
    fontWeight: "bold",
    fontSize: 14,
  },
  contentDesc: {
    color: "#3C3C3C",
    fontWeight: "normal",
    fontSize: 13,
  },
  boldText: {
    fontWeight: "600",
    color: "#3C3C3C",
  },
});

export default styles;
