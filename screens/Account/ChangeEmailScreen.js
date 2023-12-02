import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification} from 'firebase/auth';
import { db } from '../../firebase/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import { authentication } from '../../firebase/firebase';
import Toast from 'react-native-root-toast';
import { getCurrentUserId } from "../../src/authToken";


const ChangeEmailScreen = () => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const showToast = (message) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      containerStyle: {
        backgroundColor: '#000',
        borderRadius: 8,
        marginHorizontal: 16,
        marginTop: 40,
      },
      textStyle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    });
  };

  const handleChangeEmail = async () => {
    try {
      if (!newEmail || !password) {
        showToast('All fields are required.');
        return;
      }
      const userToken = await getCurrentUserId();
      // Re-authenticate the user before changing the email (requires the rider's current password)
      const user = authentication.currentUser;
      if (!user) {
        showToast("not authenticated");
        return;
      }
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      if (!user.emailVerified) { // Check the email verification status of the current user
        await sendEmailVerification(user);
        showToast("Verify Your Current Email first. Verification email sent.");
      }
      else {
        // Update the email
        await updateEmail(user, newEmail);
        
        const docRef = doc(db, 'customers', userToken);
        await updateDoc(docRef, {
          email: newEmail,
        });
        console.log('Email changed successfully!');
        showToast('Email changed successfully!');
        setNewEmail(''); // Clear the fields
        setPassword(''); // Clear the fields
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        console.log('Incorrect current password. Please try again.');
        showToast('Incorrect current password. Please try again.');
      } else {
        showToast('Failed to change email. Please try again later.');
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Change Email</Text>
        <View style={styles.line} />
        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 15, color: '#4E4E4E' }}>
          Email must be valid.
        </Text>
        <View>
          <Text style={styles.label}>New Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your new email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
          />
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your current password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              Change Email
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
    backgroundColor: 'white',
  },
  input: {
    height: 43,
    width: '100%',
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
    fontWeight: '500',
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
    height: 50,
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
  },
});

export default ChangeEmailScreen;
