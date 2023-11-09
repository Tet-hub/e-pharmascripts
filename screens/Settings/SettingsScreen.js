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

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Settings</Text>

      <View style={styles.insideContainer}>
        <View style={styles.supportContainer}>
          <Iconify icon="basil:headset-outline" size={22} color="black" />
          <Text style={styles.supportText}> Support</Text>
        </View>

        <View style={styles.line} />

        <TouchableOpacity>
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

        <TouchableOpacity>
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

        <TouchableOpacity>
          <View style={styles.touchableCont}>
            <Text style={styles.touchableText}>E-Pharmascripts Policies</Text>
            <View style={styles.arrowIcon}>
              <Iconify
                icon="iconoir:nav-arrow-right"
                size={22}
                color="#3A3A3A"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
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

      {/*
            <Text className="text-base font-semibold border-b border-gray-200 pb-4 pt-6">  
            <Ionicons name="notifications-outline" size={23} color="black"/> Notifications</Text>
            <View className="flex flex-row items-center justify-between mr-3 mt-3 ml-3">
                <Text className="mr-2 text-base">Notifications</Text>
                <Switch
                    value={isNotificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ true: 'red', false: 'gray' }}
                    thumbColor={isNotificationsEnabled ? 'red' : 'white'}
                />
            </View>
            */}
    </View>
  );
};

export default SettingsScreen;
