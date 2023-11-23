import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { authentication } from "../../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        showToast("All fields are required.");
        return;
      }
      // Check if the new password and confirm password match
      if (newPassword !== confirmPassword) {
        console.log("New password and confirm password do not match.");
        showToast("New password and confirm password do not match.");
        return;
      }

      // Check if the new password is at least 6 characters long
      if (newPassword.length < 6) {
        console.log("Password must be at least 6 characters long.");
        showToast("Password must be at least 6 characters long.");
        return;
      }

      // Re-authenticate the user before changing the password (requires the user's current password)
      const user = authentication.currentUser;
      if (!user) {
        showToast("not authenticated");
        return;
      }
      console.log("auth user:", user);
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);

      console.log("Password changed successfully!");
      showToast("Password changed successfully!");
      // Clear input fields after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Handle success (you can show a success message or navigate to another screen)
    } catch (error) {
      //
      if (error.code === "auth/wrong-password") {
        console.log("Incorrect current password. Please try again.");
        showToast("Incorrect current password. Please try again.");
      } else {
        showToast("Failed to change password. Please try again later.");
      }
      // Handle errors (you can show an error message to the user)
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Change Password</Text>

        <Text
          style={{
            marginTop: 20,
            marginBottom: 20,
            fontSize: 15,
            color: "#4E4E4E",
          }}
        >
          Password must be at least 6 characters.
        </Text>
        <View>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your current password"
            secureTextEntry
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
          />
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new password"
            secureTextEntry
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your new password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              Change Password
            </Text>
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
    borderRadius: 5,
    padding: 10,
    paddingLeft: 15,
    fontSize: 14,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
    height: 50,
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ChangePasswordScreen;
