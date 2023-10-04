import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderTopLeftRadius: 20, // Apply a border radius to the top left corner
    borderTopRightRadius: 20, // Apply a border radius to the top right corner
    flex: 1,
  },
  insideContainer: {
    width: "85%",
  },
  supportContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 32,
  },
  supportText: {
    fontWeight: 600,
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center",
    marginTop: 20,
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginLeft: 30,
    marginBottom: 15,
  },
  touchableCont: {
    flexDirection: "row", // Arrange icons and text horizontally
    alignItems: "center", // Align items vertically within the container
    justifyContent: "flex-start", // Spread elements apart
    marginBottom: 10,
    marginLeft: 35,
  },
  touchableText: {
    color: "#4E4E4E",
    fontWeight: 400,
    fontSize: 16,
  },
  arrowIcon: {
    flex: 1, // Distribute remaining space
    alignItems: "flex-end", // Align icon to the end of the flex container
    marginLeft: "auto",
    marginRight: -30,
  },
});

export default styles;
