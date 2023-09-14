import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { TextInput } from "react-native-gesture-handler";

const ProductScreen = ({ navigation, route }) => {

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View className="items-center flex-row mt-5 ml-3 mr-3 ">
          <Text style={styles.screenTitle}>
            Three-Sixty Pharmacy (branch name)
          </Text>
        </View>

        <View style={styles.searchFilterCont}>
            <View style={styles.searchCont}>
            <Iconify
                icon="circum:search"
                size={22}
                style={styles.iconSearch}
            />
            <TextInput placeholder="Search product" />
            </View>

            <TouchableOpacity>
                <View style={styles.iconFilterCont}>
                    <Iconify icon="mi:filter" size={25} color="white" />
                </View>
            </TouchableOpacity>
        </View>

        <Text style={styles.productSelectionText}>Product Selection</Text>

        <View style={styles.productContainer}>
            <View style={styles.productCard}>
                <Image
                    source={require("../assets/img/cymer.jpg")}
                    style={styles.image}
                />
                <Text style={styles.productName}>Zynapse 1G Tablet</Text>
                <Text style={styles.productReq}>[ Requires Prescription ]</Text>
                <Text style={styles.productPrice}>₱102.75</Text>
                <View style={styles.addtocartButton}>
                    <Text style={styles.addtocartText}>Add to cart</Text>
                    <Iconify icon="ion:cart-outline" size={18} color="white" />
                </View>
            </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};
export default ProductScreen;


const styles = StyleSheet.create({
    screenTitle:{
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        color: '#3C3C3C'
    },
    container:{
        width: '95%',
        alignSelf: 'center'
    },
    searchFilterCont: {
        flexDirection: "row",
        alignItems: "center",
        width: '95%',
        alignSelf: 'center',
        marginTop: 15
    },
    searchCont: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 15,
        width: "82%",
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 1.5,
        marginVertical: 10,
    },
    iconSearch: {
        marginRight: 10,
        color: "black",
    },
    iconFilterCont: {
        backgroundColor: "black",
        padding: 10,
        marginLeft: 15,
        borderRadius: 15,
    },
    productSelectionText:{
        color: '#3A3A3A',
        fontSize: 16,
        fontWeight: 600,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 12,
    },

    //Product Container/Card
    productContainer:{
        width: '95%',
        alignSelf: 'center',
        marginTop: 10
    },
    productCard:{
        backgroundColor: 'white',
        height: 250,
        borderRadius: 15,
        padding: 17,
        width: 180,
        elevation: 2
    },
    image: {
        width: "100%",
        height: 90,
        borderRadius: 2,
    },
    productName:{
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
        marginTop: 15,
    },
    productReq:{
        fontWeight: 400,
        fontSize: 8,
        color: '#0CB669',
        marginTop: 8,
        textAlign: 'center',
    },
    productPrice:{
        fontWeight: 600,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    addtocartButton:{
        backgroundColor: '#EC6F56',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 10,
        width: '90%',
        marginTop: 3
    },
    addtocartText:{
        color: 'white',
        marginRight: 10,
        fontSize: 12,
        fontWeight: 500,

    },

 
    
});
