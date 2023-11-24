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
import { sendEmailVerification } from 'firebase/auth';
import { authentication } from '../../firebase/firebase';
import Toast from 'react-native-root-toast';
import { useNavigation } from "@react-navigation/native";

const VerifyEmailScreen = () => {

    const navigation = useNavigation();

    const ChangeEmail = () => {
        navigation.navigate("ChangeEmailScreen");
    };
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
            marginTop: 45,
        },
        textStyle: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        });
    };
  
  const handleVerifyEmail = async () => {
    try {
    // Send email verification
        await sendEmailVerification(authentication.currentUser);
        showToast("Verification email sent. Please check your email.");
        } catch (error) {
        console.error("Error sending verification email:", error);
        showToast("Failed to send verification email. Please try again later.");
    }
    
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.text}>Change Email</Text>
        <View style={styles.line} />
        <Text style={{ marginTop: 20, marginBottom: 20, fontSize: 15, color: '#4E4E4E' }}>
        After pressing verify, click on the verification link sent 
        to your inbox. This step helps us confirm your identity and protect your information.
        </Text>
        <View>
          <Text style={styles.label}>Current Email</Text>
          <View style={styles.input}>
            <Text>{authentication.currentUser.email}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={ChangeEmail}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
              Change Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleVerifyEmail}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
              Verify Email
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
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    fontSize: 14,
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 2,
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
  },
  btn: {
    marginTop: 15,
    height: 48,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
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

export default VerifyEmailScreen;
