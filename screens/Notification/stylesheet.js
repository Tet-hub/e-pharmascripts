import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
  },
  insideContainer: {
    width: "85%",
  },
  textTitle: {
    fontWeight: 600,
    fontSize: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  textTime: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 15,
    fontWeight: 200,
  },
  line: {
    height: 0.5,
    width: "105%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
    color: "#8E8E8E",
    marginLeft: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  notificationImage: {
    width: "28%",
    height: 80,
    resizeMode: "contain",
  },
  notificationTextContainer: {
    marginLeft: 10,
    marginRight: 20,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 14,
  },
});

export default styles;
