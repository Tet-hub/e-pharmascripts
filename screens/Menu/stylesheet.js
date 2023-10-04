import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderRadius: 20,
    flex: 1,
  },
  insideContainer: {
    width: "85%",
  },
  line: {
    height: 0.5,
    width: "105%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    marginLeft: 20,
  },
  pic_cont: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginRight: 20,
  },
  profileCont: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Center children vertically
    justifyContent: "center",
  },
  name: {
    color: "#3A3A3A",
    fontWeight: 600,
    fontSize: 15,
  },
  menuText: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 20,
    marginTop: 25,
  },
  viewCont: {
    flexDirection: "row", // Arrange icons and text horizontally
    alignItems: "center", // Align items vertically within the container
    justifyContent: "flex-start", // Spread elements apart
    paddingHorizontal: 10, // Add some horizontal spacing
    marginBottom: 5,
  },
  viewContText: {
    fontWeight: 600,
    fontSize: 16,
    marginLeft: 13,
    marginVertical: 15,
  },
  iconsBG: {
    backgroundColor: "#F5F5F5",
    marginLeft: 25,
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  logoutButton: {
    fontWeight: 600,
    fontSize: 17,
    color: "white",
    alignItems: "center", // Center children vertically
  },
  logoutCont: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Align children horizontally
    marginLeft: 50,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
  },
  arrowIcon: {
    flex: 1, // Distribute remaining space
    alignItems: "flex-end", // Align icon to the end of the flex container
    marginLeft: "auto",
    marginRight: -30,
  },
});

export default styles;
