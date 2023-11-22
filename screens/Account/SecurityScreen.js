import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from "@react-navigation/native";
import { Iconify } from "react-native-iconify";

const SecurityScreen = () => {
    const navigation = useNavigation();

    const handleChangePass = () => {
        navigation.navigate("ChangePasswordScreen");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Password and Security</Text>
            <View style={styles.line} />
            
            <Text style={{marginTop: 20, fontWeight: 600, fontSize: 15}}>Login account</Text>
            <Text style={{marginTop: 10, fontSize: 15, color: '#4E4E4E'}}>
                Manage your password for security and account safety.
            </Text>
            <TouchableOpacity style={styles.passContainer} onPress={handleChangePass}>
                <Text style={{ fontWeight: 400, fontSize: 15}}>Change password</Text>
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
    marginTop: 20,
    width: "100%",
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginLeft: 'auto', // Push to the center horizontally
    marginRight: 'auto',
    marginBottom: 10,
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
export default SecurityScreen