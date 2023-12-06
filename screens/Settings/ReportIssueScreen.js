import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { db } from "../../firebase/firebase";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import Toast from "react-native-root-toast";
import { getCurrentUserId } from "../../src/authToken";
import { getCurrentCustomerName } from "../../src/authToken";
import { useNavigation } from "@react-navigation/native";

const ReportIssueScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      containerStyle: {
        backgroundColor: "#000",
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      },
      textStyle: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
      },
    });
  };

  const submitReport = async () => {
    try {
      setLoading(true);
      const senderId = await getCurrentUserId();
      const senderName = await getCurrentCustomerName();
      const reportsCollectionRef = collection(db, "reports");

      const data = {
        reportMessage: content,
        reportedAt: serverTimestamp(),
        senderId: senderId,
        senderName: senderName,
        title: title,
      };

      await addDoc(reportsCollectionRef, data);
      showToast("Report Submitted Successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting report: ", error);
      showToast("Failed to submit report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Report Issue</Text>
        <View style={styles.line} />
        <Text
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 15,
            color: "#4E4E4E",
          }}
        >
          When reporting an issue, it's important to provide clear and detailed
          information to help the us understand the problem and troubleshoot
          effectively.
        </Text>
        <View>
          <Text style={styles.label}>Report Title/Name</Text>
          <TextInput
            style={styles.input}
            placeholder="..."
            keyboardType="email-address"
            autoCapitalize="none"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
          <Text style={styles.label}>Issue/Concern</Text>
          <TextInput
            style={styles.body}
            placeholder="Describe the issue..."
            multiline={true}
            maxLength={500}
            value={content}
            onChangeText={(text) => setContent(text)}
          />
          <View>
            <Text style={styles.countCharactersInput}>
              {content.length}/500
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={submitReport}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
              >
                Submit Report
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingRight: 25,
    paddingLeft: 25,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
  },
  input: {
    height: 43,
    width: "100%",
    marginBottom: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 15,
    backgroundColor: "#F5F5F5",
    borderColor: "#D9D9D9",
  },
  body: {
    height: 200,
    width: "100%",
    marginBottom: 15,
    borderWidth: 0.5,
    borderRadius: 10,
    fontSize: 15,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#F5F5F5",
    borderColor: "#D9D9D9",
    textAlignVertical: "top", // Add this line
  },

  label: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 2,
    fontWeight: "500",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    marginTop: 30,
    marginBottom: 10,
    height: 50,
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
  },
  countCharactersInput: {
    fontSize: 13,
    fontWeight: 400,
    textAlign: "right",
    color: "#3A3A3A",
    marginRight: 10,
  },
});

export default ReportIssueScreen;
