import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAP_KEY } from "../../constants/googleMapKey";

const AddressPickup = ({ placeholderText, fetchAddress }) => {
  const [fullAddress, setFullAddress] = useState("");

  const onPressAddress = (data, details) => {
    let zipCode = "";
    let cityText = "";

    // Extract zip code and city
    details.address_components.forEach((val) => {
      if (val.types.includes("locality") || val.types.includes("sublocality")) {
        cityText = val.long_name;
      }
      if (val.types.includes("postal_code")) {
        zipCode = val.long_name;
      }
    });

    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    const formattedAddress = details.formatted_address;

    // Set the full address in the state
    setFullAddress(formattedAddress);

    // Fetch address with all details
    fetchAddress(lat, lng, zipCode, cityText, formattedAddress);
  };

  const EmptyListMessage = () => {
    return (
      <View>
        <Text>No results found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholderText}
        onPress={onPressAddress}
        fetchDetails={true}
        isRowScrollable={true}
        disableScroll={true}
        query={{
          key: GOOGLE_MAP_KEY,
          language: "en",
        }}
        listEmptyComponent={<EmptyListMessage />}
        styles={{
          textInputContainer: styles.containerStyle,
          textInput: styles.textInputStyle,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // containerStyle: {
  //   backgroundColor: "white",
  //   borderTopEndRadius: 50
  // },
  textInputStyle: {
    color: "black",
    fontSize: 16,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    margin: 1,
  },
});

export default AddressPickup;
