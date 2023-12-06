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
  EtExt: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  pharma: {
    color: "#EC6F56",
    fontSize: 18,
    fontWeight: "600",
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  version: {
    color: "#3C3C3C",
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
  },
  content: {
    marginTop: 15,
    flexDirection: "row",
    width: "95%",
  },
  textContent: {
    fontSize: 13,
    color: "#3C3C3C",
  },
  boldText: {
    fontWeight: "bold",
    color: "#3C3C3C",
  },
  titleContainer: {
    marginBottom: 15,
  },
  aboutDiv: {
    marginTop: 35,
    padding: 25,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 15,
  },
  aboutContent: {
    fontSize: 13,
    color: "#3C3C3C",
  },
  groupName: {
    color: "black",
    fontSize: 15,
    fontWeight: 700,
    marginTop: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "contain",
  },
});

export default styles;
