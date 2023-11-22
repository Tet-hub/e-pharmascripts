import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  messageContainer: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    maxWidth: "80%",
    marginRight: 4,
  },
  yourMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8E8E8E",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#A8A8A8",
    marginLeft: 5,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  timestampText: {
    color: "#fff",
    fontSize: 12,
    alignSelf: "flex-end",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "flex-end", // Push content to the bottom
    alignItems: "center",
    // Adjust the margin as needed
  },
  sendMessageCont: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20, // Adjust the margin as needed
  },

  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 1.5,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: "70%",
    marginLeft: 20,
  },
  icons: {
    marginRight: 10,
    color: "black",
  },
  sendButtonContainer: {
    padding: 10,
    marginLeft: 2,
  },
  sendButton: {
    backgroundColor: "#EC6F56",
    borderRadius: 50, // Make it a circle
    width: 50,
    height: 50,
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
  },

  dateDivider: {
    backgroundColor: "#eee",
    padding: 5,
    alignSelf: "center",
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  imageStyle: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  fullscreenImage: {
    width: "100%",
    height: "80%",
  },

  closeButton: {
    color: "white",
    fontSize: 18,
    margin: 20,
  },
});

export default styles;
