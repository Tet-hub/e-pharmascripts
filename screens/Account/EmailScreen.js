import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Iconify } from "react-native-iconify";

const EmailScreen = () => {
    

    const handleVerifyEmail = () => {
        
    };

    const handleChangeEmail = () => {
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>My Account</Text>
            <View style={styles.line} />
            
            
            <Text style={{marginTop: 20, marginBottom: 20, marginLeft: 5, fontSize: 15, color: '#4E4E4E'}}>
                ROMS Technologies will use this personal details to verify your identity. 
                You can decide what changes you will make in your personal details.
            </Text>
            
            <TouchableOpacity style={styles.passContainer} onPress={handleVerifyEmail}>
                <View>
                    <Text style={{ fontWeight: 500, fontSize: 15}}>Verify Email</Text>
                </View>
                
                <Iconify icon="iconoir:nav-arrow-right" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.passContainer} onPress={handleChangeEmail}>
                <View>
                    <Text style={{ fontWeight: 500, fontSize: 15}}>Change Email</Text>
                </View>
                
                <Iconify icon="iconoir:nav-arrow-right" size={24} />
            </TouchableOpacity>
            <View>
                
            </View>
        </View>
    )
}

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
  passContainer: {
    marginTop: 10,
    width: "100%",
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginLeft: 'auto', // Push to the center horizontally
    marginRight: 'auto',
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 20,
    fontWeight: '500'
  },
  line: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#8E8E8E",
    marginTop: 20,
  },
  
})
export default EmailScreen;