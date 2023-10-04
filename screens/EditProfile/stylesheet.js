import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  wholeContainer: {
    backgroundColor: "white",
    paddingBottom: 400,
    borderRadius: 20,
  },
  upperContainer: {
    alignItems: "center", // Align items vertically
    justifyContent: "center", // Center items horizontally
  },
  lowerContainer: {
    width: "80%",
    marginTop: 30,
    marginLeft: 40,
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    marginTop: 20,
  },
  pic_cont: {
    width: 120,
    height: 120,
    marginTop: 7,
  },
  camera: {
    backgroundColor: "#EC6F56",
    padding: 7,
    borderRadius: 24,
    marginVertical: -33,
    marginLeft: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 6,
  },
  infoCont: {
    backgroundColor: "#F5F2F2",
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    fontWeight: 400,
    marginLeft: 10,
  },
  labelInfoCont: {
    marginVertical: 4,
  },

  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Add this line
  },
});

export default styles;
