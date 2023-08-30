import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import { Iconify } from "react-native-iconify";
import ImagePicker from 'react-native-image-picker';



const styles = StyleSheet.create({
    wholeContainer:{
      backgroundColor: 'white',
      paddingBottom: 400,
      borderRadius: 20,
    },
    upperContainer:{
      alignItems: 'center', // Align items vertically
      justifyContent: 'center', // Center items horizontally
    },
    lowerContainer:{
      width: '80%',
      marginTop: 30,
      marginLeft: 40,
    },
    title:{
        fontWeight: 600,
        fontSize: 18,
        marginTop: 20,
    },
    pic_cont:{
        width: 120,
        height: 120,
        marginTop:7,
    },
    camera:{
        backgroundColor: '#EC6F56', 
        padding: 7, 
        borderRadius: 24, 
        marginVertical: -33,
        marginLeft: 80,
    },
    label:{
        fontSize: 16,
        fontWeight: 600,
        marginLeft: 6,
    },
    infoCont:{
        backgroundColor: '#F5F2F2',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
    info:{
        fontSize: 14,
        fontWeight: 400,
        marginLeft: 10,
    },
    labelInfoCont:{
        marginVertical: 4,
    },

    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Add this line
    }
    
  });



const ProfileImage = ({ selectedImage, handleCameraIconClick }) => (
  <View style={styles.upperContainer}>
    <Text style={styles.title}>Edit Profile</Text>
    <View style={styles.pic_cont}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.pic_cont} className="w-full h-full rounded-full"/>
      ) : (
        <Image
          source={require("../assets/img/cymer.jpg")}
          style={styles.pic_cont} className="w-full h-full rounded-full"
        />
      )}
    </View>
    <TouchableOpacity onPress={handleCameraIconClick}>
      <IconSimple style={styles.camera} name="camera" size={22} color="white" />
    </TouchableOpacity>
  </View>
);

const ProfileInfo = ({ label, info, icon, additionalStyle }) => (
    <View style={styles.labelInfoCont}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.infoCont}>
        <View style={styles.iconContainer}>
          <Text style={styles.info}>{info}</Text>
          {icon && <Iconify size={22} icon="mi:calendar" color="#4E4E4E" style={{ marginRight: 20 }}/>}
        </View>
      </View>
    </View>
);

const EditProfileScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCameraIconClick = () => {
    // Your existing code for handling the image picker...
  };

  return (
    <View style={styles.wholeContainer}>
      <ProfileImage selectedImage={selectedImage} handleCameraIconClick={handleCameraIconClick} />

      <View style={styles.lowerContainer}>
        <ProfileInfo label="Name" info="Xyxy Pinakurat" />
        <ProfileInfo label="Phone" info="09876543210" />
        <ProfileInfo label="Gender" info="Male" />
        <ProfileInfo label="Birthdate" info="1/20/23" icon="calendar" /> 
        <ProfileInfo label="Valid ID" info="" />
      </View>
    </View>
  );
};

export default EditProfileScreen;