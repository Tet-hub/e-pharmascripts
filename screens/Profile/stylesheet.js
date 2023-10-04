import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderRadius: 20,
    flex: 1,
  },
  insideContainer: {
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Center items horizontally
    width: "100%",
  },
  lowerContainer: {
    width: "80%",
    marginTop: 15,
  },
  pic_cont: {
    width: 100,
    height: 100,
    marginTop: 15,
  },
  save_cont: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    marginTop: 20,
  },
  nameGmailButton: {
    marginTop: 15,
    alignItems: "center",
  },
  name: {
    fontWeight: 600,
    fontSize: 18,
  },
  gmail: {
    fontWeight: 400,
    fontSize: 10,
    color: "#8E8E8E",
  },
  editButton: {
    marginTop: 15,
    fontWeight: 600,
    fontSize: 14,
    color: "white",
    backgroundColor: "#EC6F56",
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 60,
    paddingLeft: 60,
    borderRadius: 30,
  },
  line: {
    height: 0.4,
    width: "80%",
    marginTop: 20,
    backgroundColor: "#8E8E8E",
  },
  line2: {
    height: 0.5,
    width: "100%",
    marginTop: 20,
    backgroundColor: "#8E8E8E",
  },
  viewCont: {
    flexDirection: "row", // Arrange icons and text horizontally
    alignItems: "center", // Align items vertically within the container
    justifyContent: "flex-start", // Spread elements apart
    paddingHorizontal: 10, // Add some horizontal spacing
  },
  viewContText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 13,
    marginVertical: 15,
  },
  arrowIcon: {
    flex: 1, // Distribute remaining space
    alignItems: "flex-end", // Align icon to the end of the flex container
    marginLeft: "auto",
    marginRight: -10,
  },
  iconsBG: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
});

export default styles;
