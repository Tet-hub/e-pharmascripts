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
  },
  line: {
    height: 0.5,
    width: "85%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 15,
  },
  topTitle: {
    color: "#3C3C3C",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  titleDesc: {
    color: "#3C3C3C",
    fontSize: 12,
    marginTop: 10,
    textAlign: "justify",
  },
  titleDesc2: {
    color: "#3C3C3C",
    fontSize: 12,
    marginTop: 10,
    textAlign: "justify",
  },
  dosText: {
    color: "#EC6F56",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 15,
  },
  titleTextDos: {
    color: "#3C3C3C",
    fontWeight: "bold",
    fontSize: 12,
  },
  dosContainer: {
    marginTop: 15,
  },
  dosContent: {
    color: "#3C3C3C",
    fontSize: 12,
    marginTop: 8,
  },
  dosContent2: {
    color: "#3C3C3C",
    fontSize: 12,
    marginTop: 2,
  },
  dontsText: {
    color: "#DC3642",
    fontWeight: "bold",
    marginTop: 20,
    fontSize: 15,
  },
  bottomParagraph: {
    fontSize: 12,
    marginTop: 20,
    color: "#3C3C3C",
  },
});

export default styles;
