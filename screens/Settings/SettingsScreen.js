import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";
import styles from "./stylesheet";

const SettingsScreen = () => {
  //const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  // const toggleNotifications = () => {
  //setIsNotificationsEnabled((prevState) => !prevState);
  // };
  const navigation = useNavigation();
  const handleReport = () => {
    navigation.navigate("ReportIssueScreen");
  };
  const handleCommunityRules = () => {
    navigation.navigate("CommunityRulesScreen");
  };
  const handleAbout = () => {
    navigation.navigate("AboutScreen");
  };
  const handleTerms = () => {
    navigation.navigate("TermsAndConditionsScreen");
  };
  const handlePolicies = () => {
    navigation.navigate("PoliciesScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Settings</Text>

      <View style={styles.insideContainer}>
        <View style={styles.supportContainer}>
          <Iconify icon="basil:headset-outline" size={22} color="black" />
          <Text style={styles.supportText}> Support</Text>
        </View>

        <View style={styles.line} />

        <TouchableOpacity onPress={handleReport}>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>Help Center</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCommunityRules}>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>Community Rules</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTerms}>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>Terms & Conditions</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePolicies}>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>E-PharmaScripts Policies</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAbout}>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>About</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
