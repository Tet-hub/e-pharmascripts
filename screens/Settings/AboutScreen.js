import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Iconify } from "react-native-iconify";
import styles from "./as";
import { ScrollView } from "react-native-gesture-handler";
import Logo from "../../assets/Logo.png";

const AboutScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <Text style={styles.screenTitle}>ABOUT</Text>
      <View style={styles.line} />
      <View style={styles.insideContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.imageContainer}>
            <Image source={Logo} style={styles.image} />
          </View>
          <View style={styles.titleView}>
            <Text style={styles.EtExt}>E-</Text>
            <Text style={styles.pharma}>PharmaScripts</Text>
          </View>
          <Text style={styles.version}>v1.0.1</Text>
        </View>
        <View style={styles.content}>
          <Iconify
            icon="material-symbols:circle"
            size={6}
            color="#3C3C3C"
            style={{ marginTop: 7, marginRight: 5 }}
          />
          <Text style={styles.textContent}>
            <Text style={styles.boldText}>Convenience:</Text> Order medicines
            anytime, anywhere, at your convenience.
          </Text>
        </View>
        <View style={styles.content}>
          <Iconify
            icon="material-symbols:circle"
            size={6}
            color="#3C3C3C"
            style={{ marginTop: 7, marginRight: 5 }}
          />
          <Text style={styles.textContent}>
            <Text style={styles.boldText}>Reliability:</Text> Trust in the
            quality of our partnered pharmacies and the authenticity of the
            medications.
          </Text>
        </View>
        <View style={styles.content}>
          <Iconify
            icon="material-symbols:circle"
            size={6}
            color="#3C3C3C"
            style={{ marginTop: 7, marginRight: 5 }}
          />
          <Text style={styles.textContent}>
            <Text style={styles.boldText}>Safety:</Text> Secure online
            transactions and adherence to data protection standards ensure a
            safe experience.
          </Text>
        </View>
        <View style={styles.content}>
          <Iconify
            icon="material-symbols:circle"
            size={6}
            color="#3C3C3C"
            style={{ marginTop: 7, marginRight: 5 }}
          />
          <Text style={styles.textContent}>
            <Text style={styles.boldText}>Customer Care:</Text> Our dedicated
            customer support team is ready to assist you with any queries or
            concerns.
          </Text>
        </View>
        <View style={styles.aboutDiv}>
          <Text style={styles.aboutContent}>
            A go-to mobile application for a seamless and hassle-free pharmacy
            experience. We understand the importance of timely and efficient
            access to medicines, and we've designed our app to revolutionize the
            way you buy and manage your medications.
          </Text>
          <Text style={styles.groupName}>By ROMS TECH</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
