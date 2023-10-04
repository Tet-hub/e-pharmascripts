import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#f5f5f5",
    },
    header: {
      alignItems: "center",
      marginBottom: 10,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#3A3A3A",
      textAlign: "left",
      alignSelf: "flex-start",
    },
    searchFilterCont: {
      flexDirection: "row",
      alignItems: "center",
    },
    searchCont: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 15,
      width: "100%",
      backgroundColor: "white",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 1.5,
      marginVertical: 10,
    },
    iconSearch: {
      marginRight: 10,
      color: "black",
    },
    inputSearch: {
      flex: 1,
    },
    branchSelectionText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
      marginTop: 16,
    },
  
    pharmacyContainer: {
      paddingHorizontal: 8,
      paddingTop: 10,
    },
    pharmacyCard: {
      borderRadius: 15,
      backgroundColor: "white",
      padding: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
      marginBottom: 16,
    },
    image: {
      width: "80%",
      height: 90,
      borderRadius: 15,
      marginTop: 2,
      marginBottom: 4,
      alignSelf: "center",
    },
    ratingText: {
      textAlign: "left",
      color: "#333",
      fontWeight: "bold",
      fontSize: 14,
    },
    pharmacyName: {
      textAlign: "center",
      color: "#3C3C3C",
      fontWeight: "600",
      fontSize: 14,
      paddingTop: 5,
    },
    branchName: {
      textAlign: "center",
      color: "#3C3C3C",
      fontWeight: "600",
      fontSize: 14,
      paddingTop: 2,
    },
    viewButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#EC6F56",
      borderRadius: 15,
      backgroundColor: "white",
      padding: 10,
      paddingHorizontal: 16,
      alignSelf: "center",
      marginTop: 10,
    },
    viewButtonText: {
      color: "#EC6F56",
      fontWeight: "500",
      fontSize: 13,
    },
  });

export default styles;