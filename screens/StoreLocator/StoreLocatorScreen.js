import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { GOOGLE_MAP_KEY } from "../../constants/googleMapKey";
import imagePath from "../../constants/imagePath";
import MapViewDirections from "react-native-maps-directions";
import Loader from "../../components/map/Loader";
import {
  locationPermission,
  getCurrentLocation,
  showError,
} from "../../helper/helperFunction";
import * as Location from "expo-location";
import { Iconify } from "react-native-iconify";
import { useNavigation } from "@react-navigation/native";
import AddressPickup from "../../components/map/AddressPickup";
import CustomBtn from "../../components/map/CustomBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PanGesture,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Animated } from "react-native";
import { Easing } from "react-native";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.warn = (...args) => {
  if (
    args.length > 0 &&
    typeof args[0] === "string" &&
    args[0].includes("Possible Unhandled Promise Rejection")
  ) {
    console.log("Filtered warning:", args[0]);
  } else {
    originalConsoleWarn.apply(console, args);
  }
};

console.error = (...args) => {
  if (
    args.length > 0 &&
    typeof args[0] === "string" &&
    args[0].includes("Error getting current location")
  ) {
    console.log("Filtered warning:", args[0]);
  } else {
    originalConsoleError.apply(console, args);
  }
};
const StoreLocatorScreen = ({ route }) => {
  const navigation = useNavigation();
  const mapRef = useRef();
  const markerRef = useRef();
  const [pharmacies, setPharmacies] = useState([]);
  const [bottomCardHeight, setBottomCardHeight] = useState(
    new Animated.Value(200)
  );
  const [isBottomCardExpanded, setIsBottomCardExpanded] = useState(false);
  const [selectedPharmacyDetails, setSelectedPharmacyDetails] = useState(null);

  const onArrowPress = () => {
    const expandedHeight = 500;
    const isExpanded = bottomCardHeight._value === expandedHeight;

    Animated.timing(bottomCardHeight, {
      toValue: isExpanded ? 150 : expandedHeight,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    setIsBottomCardExpanded(!isExpanded);
  };

  useEffect(() => {
    // Fetch pharmacy data from Google Places API
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const { latitude, longitude } = state.curLoc;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=100000&type=pharmacy&key=${GOOGLE_MAP_KEY}`
      );
      const data = await response.json();

      const firebaseResponse = await fetchFirebasePharmacies();

      const combinedPharmacies = [...data.results, ...firebaseResponse];

      if (data.status === "OK") {
        setPharmacies(combinedPharmacies);
      } else {
        console.error("Failed to fetch pharmacies:", data.status);
      }
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
    }
  };

  const fetchFirebasePharmacies = async () => {
    try {
      // Fetch data from Firestore "sellers" collection
      const response = await fetch(
        "https://firestore.googleapis.com/v1/projects/e-pharmascripts/databases/(default)/documents/sellers"
      );

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Firestore pharmacies. Status: ${response.status}`
        );
      }

      const data = await response.json();

      // Convert Firestore data to match the structure of the data you get from the Google Places API
      const firebasePharmacies = await Promise.all(
        data.documents.map(async (document) => {
          const seller = document.fields;
          const address = seller.exactAddress?.stringValue;

          try {
            // Fetch latitude and longitude from Geocoding API
            const geocodingResponse = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
              )}&key=${GOOGLE_MAP_KEY}`
            );

            const geocodingData = await geocodingResponse.json();

            if (geocodingData.status === "OK") {
              const location = geocodingData.results[0].geometry.location;
              const placeId = geocodingData.results[0].place_id;

              return {
                place_id: placeId,
                geometry: {
                  location: {
                    lat: location.lat,
                    lng: location.lng,
                  },
                },
                name: seller.branch.stringValue,
                vicinity: seller.formattedAddress.stringValue,
                isFirebaseMarker: true,
              };
            } else {
              console.error("Geocoding API failed:", geocodingData.status);
              return null;
            }
          } catch (error) {
            console.error("Error fetching Geocoding API:", error);
            return null;
          }
        })
      );

      // Filter out null values (failed geocoding)
      return firebasePharmacies.filter((pharmacy) => pharmacy !== null);
    } catch (error) {
      console.error("Error fetching Firestore pharmacies:", error);
      return [];
    }
  };

  useEffect(() => {
    if (mapRef.current && pharmacies.length > 0) {
      const coordinates = pharmacies.map((pharmacy) => ({
        latitude: pharmacy.geometry.location.lat,
        longitude: pharmacy.geometry.location.lng,
      }));
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [pharmacies]);

  const [state, setState] = useState({
    curLoc: {
      latitude: 10.3156992,
      longitude: 123.8854366,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 10.3156992,
      longitude: 123.8854366,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
    fullAddress: "",
  });

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
    fullAddress,
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission not granted");
      return;
    }
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude, heading } = await getCurrentLocation();
      animate(latitude, longitude);
      updateState({
        heading: heading,
        curLoc: { latitude, longitude },
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };

  const onMarkerLongPress = async (pharmacy) => {
    console.log("Marker long press data:", pharmacy);
    if (pharmacy.isFirebaseMarker) {
      // Handle Firestore marker
      const { place_id } = pharmacy;
      const { lat, lng } = pharmacy.geometry.location;
      const fullAddress = pharmacy.vicinity; // Assuming the vicinity contains the address

      console.log(fullAddress);
      try {
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAP_KEY}`
        );

        const detailsData = await detailsResponse.json();

        console.log("WEEEEE", detailsData);
        if (detailsData.status === "OK") {
          setSelectedPharmacyDetails(detailsData.result);
          console.log(setSelectedPharmacyDetails);
        } else {
          console.error(
            "Failed to fetch pharmacy details:",
            detailsData.status
          );
        }
      } catch (error) {
        console.error("Error fetching pharmacy details:", error);
      }

      // Set the fetched data as fetchDestinationCords
      fetchDestinationCords(lat, lng, null, null, fullAddress);
    } else {
      // Handle Google Places API marker
      console.log("This marker is from Google Places API");
      const { place_id } = pharmacy;

      const { lat, lng } = pharmacy.geometry.location;
      const fullAddress = pharmacy.vicinity; // Assuming the vicinity contains the address
      console.log("Marker coordinates:", lat, lng);
      console.log("Marker full address:", fullAddress);

      try {
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${GOOGLE_MAP_KEY}`
        );

        const detailsData = await detailsResponse.json();

        if (detailsData.status === "OK") {
          setSelectedPharmacyDetails(detailsData.result);
        } else {
          console.error(
            "Failed to fetch pharmacy details:",
            detailsData.status
          );
        }
      } catch (error) {
        console.error("Error fetching pharmacy details:", error);
      }

      // Set the fetched data as fetchDestinationCords
      fetchDestinationCords(lat, lng, null, null, fullAddress);
    }
  };

  const onDirectionsPress = () => {
    // Check if destinationCords is available before proceeding
    if (Object.keys(destinationCords).length > 0) {
      // Implement your logic here for handling directions press
      console.log("Directions pressed for destination:", destinationCords);
    } else {
      showError("Please select a destination before requesting directions");
    }
  };

  const fetchDestinationCords = (lat, lng, zipCode, cityText, fullAddress) => {
    console.log("zip code==>>>", zipCode);
    console.log("city texts", cityText);
    console.log(fullAddress);
    setState((prev) => ({
      ...prev,
      destinationCords: {
        latitude: lat,
        longitude: lng,
      },
      fullAddress: fullAddress,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...curLoc,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {pharmacies.map((pharmacy, index) => (
            <Marker
              key={`${pharmacy.place_id}_${index}`}
              coordinate={{
                latitude: pharmacy.geometry.location.lat,
                longitude: pharmacy.geometry.location.lng,
              }}
              title={pharmacy.name}
              onPress={() => onMarkerLongPress(pharmacy)}
            >
              <Image
                source={
                  pharmacy.isFirebaseMarker
                    ? imagePath.pharmacy
                    : imagePath.icRedMarker
                }
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          ))}
          <Marker.Animated ref={markerRef} coordinate={coordinate}>
            <Image
              source={imagePath.icBike}
              style={{
                width: 50,
                height: 50,
                transform: [{ rotate: `${heading}deg` }],
              }}
              resizeMode="contain"
            />
          </Marker.Animated>

          {Object.keys(destinationCords).length > 0 && (
            <Marker coordinate={destinationCords}>
              <Image
                source={imagePath.icRedMarker}
                style={{ height: 40, width: 40 }}
              />
            </Marker>
          )}

          {Object.keys(destinationCords).length > 0 && (
            <MapViewDirections
              origin={curLoc}
              destination={destinationCords}
              apikey={GOOGLE_MAP_KEY}
              strokeWidth={6}
              strokeColor="#02ccfe"
              optimizeWaypoints={true}
              onStart={(params) => {
                console.log(
                  `Started routing between "${params.origin}" and "${params.destination}"`
                );
              }}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                fetchTime(result.distance, result.duration),
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 30,
                      bottom: 100,
                      left: 30,
                      top: 150,
                    },
                  });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
              onPress={onDirectionsPress}
            />
          )}
        </MapView>
        <View style={styles.addressPickup}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* <View style={{ marginBottom: 16 }} /> */}
            <AddressPickup
              placeholderText="Enter Destination Location"
              fetchAddress={fetchDestinationCords}
            />
          </ScrollView>
        </View>
        <View style={styles.buttonHeader}>
          <View style={styles.headerStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Iconify icon="ep:back" size={30} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          onPress={onCenter}
        >
          <Image source={imagePath.redIndicator} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.bottomCard,
          { height: isBottomCardExpanded ? 400 : 150 },
        ]}
      >
        <PanGestureHandler
          onGestureEvent={({ nativeEvent }) => {
            if (nativeEvent.translationY > 0) {
              bottomCardHeight.setValue(
                bottomCardHeight._value + nativeEvent.translationY
              );
            }
          }}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) {
              const expandedHeight = 400;
              const isExpanded = bottomCardHeight._value === expandedHeight;

              Animated.timing(bottomCardHeight, {
                toValue: isExpanded ? 100 : expandedHeight,
                duration: 300,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
              }).start();

              setIsBottomCardExpanded(!isExpanded);
            }
          }}
        >
          <Animated.View style={[{ height: bottomCardHeight }]}>
            <Text style={styles.address}>
              {state.fullAddress
                ? `${state.fullAddress}`
                : "Where are you going..?"}
            </Text>
            {distance !== 0 && time !== 0 && (
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 10,
                  flexDirection: "row",
                }}
              >
                <Text style={styles.timeText}>{time.toFixed(0)} min</Text>
                <Text style={styles.distanceText}>
                  {distance.toFixed(0)} km
                </Text>
              </View>
            )}
            {/* <TouchableOpacity
              onPress={() => onPressLocation(fetchValue)}
              style={styles.inputStyle}
            >
              <Text>{state.fullAddress
                ? "Choose New Location"
                : "Choose your Location"}</Text>
            </TouchableOpacity> */}
            {/* {selectedPharmacyDatabase && (
              <View style={{ marginTop: 30 }}>
                <Text style={styles.pharmacyName}>
                  {selectedPharmacyDatabase.name}
                </Text>
                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                  {selectedPharmacyDatabase.photos &&
                    selectedPharmacyDatabase.photos.length > 0 && (
                      <Image
                        source={{
                          uri: pharmacy.img.stringValue,
                        }}
                        style={{ width: 150, height: 150, marginRight: 10 }}
                      />
                    )}
                  <View>
                    <Text style={styles.rating}>
                      Status: {selectedPharmacyDatabase.status.stringValue}
                    </Text>
                    <Text style={styles.rating}>
                      Email:{selectedPharmacyDatabase.email.stringValue}
                    </Text>
                  </View>
                </View>
              </View>
            )} */}
            {selectedPharmacyDetails && (
              <View style={{ marginTop: 30 }}>
                <Text style={styles.pharmacyName}>
                  {selectedPharmacyDetails.name}
                </Text>
                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                  {selectedPharmacyDetails.photos &&
                    selectedPharmacyDetails.photos.length > 0 && (
                      <Image
                        source={{
                          uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedPharmacyDetails.photos[0].photo_reference}&key=${GOOGLE_MAP_KEY}`,
                        }}
                        style={{ width: 150, height: 150, marginRight: 10 }}
                      />
                    )}
                  <View>
                    <Text style={styles.rating}>
                      Rating: {selectedPharmacyDetails.rating}⭐
                    </Text>
                    <Text style={styles.rating}>
                      Total Ratings:{" "}
                      {selectedPharmacyDetails.user_ratings_total}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: "45%",
              }}
              onPress={onArrowPress}
            >
              {isBottomCardExpanded ? (
                <Iconify
                  icon="eva:arrowhead-down-fill"
                  size={30}
                  color={"#EC6F56"}
                />
              ) : (
                <Iconify
                  icon="eva:arrowhead-up-fill"
                  size={30}
                  color={"#EC6F56"}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </View>
      <Loader isLoading={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomCard: {
    backgroundColor: "white",
    width: "100%",
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    paddingTop: 10,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inputStyle: {
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    marginTop: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    width: 50,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: "blue",
    opacity: 0.7,
  },
  headerStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    width: 50,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: "blue",
    opacity: 0.7,
  },
  buttonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address: {
    fontSize: 15,
    marginTop: 40,
  },
  timeText: {
    color: "#EC6F56",
    fontWeight: "bold",
    fontSize: 22,
    marginRight: 20,
  },
  distanceText: {
    fontWeight: "bold",
    fontSize: 17,
  },
  addressPickup: {
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 3,
    width: "90%",
    marginLeft: 20,
    marginTop: 50,
    marginRight: 20,
    marginBottom: 10,
  },
  pharmacyName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#EC6F56",
    marginBottom: 20,
  },
  rating: {
    margin: 10,
    marginLeft: 20,
  },
});

export default StoreLocatorScreen;
