import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Iconify } from 'react-native-iconify';
import { TextInput } from 'react-native-gesture-handler';
import { listenForItem } from '../../database/component/realTimeListenerByCondition';
import styles from './stylesheet';
import buildQueryUrl from '../../src/api/components/conditionalQuery';

const { width, height } = Dimensions.get('window');

// Calculate the image dimensions based on screen size

const cardWidth = (width - 30) / 2;
const ProductScreen = ({ navigation, route }) => {
	const [product, setProductData] = useState([]);
	const sellerId = route.params?.sellerId;

	useEffect(() => {
		// Function to fetch initial data
		const fetchInitialData = async () => {
			try {
				// Define the conditions array as an array of objects
				const conditions = [
					{ fieldName: 'createdBy', operator: '==', value: sellerId },
					{
						fieldName: 'productStatus',
						operator: 'in',
						value: ['Display', 'Test', 'Xyxy'],
					},
				];

				// Generate the API URL with conditions
				const apiUrl = buildQueryUrl('products', conditions);

				// Make a GET request to the apiUrl
				const response = await fetch(apiUrl, {
					method: 'GET', // Set the request method to GET
				});

				if (response.ok) {
					const branchesData = await response.json();
					setProductData(branchesData);
				} else {
					console.log('API request failed with status:', response.status);
				}
			} catch (error) {
				console.log('Error fetching products:', error);
			}
		};

		// // Function to set up real-time listener
		const setUpRealTimeListener = () => {
			const multipleConditions = [
				{
					fieldName: 'createdBy',
					operator: '==',
					value: sellerId,
				},
				{
					fieldName: 'productStatus',
					operator: 'in',
					value: ['Display', 'Test', 'Xyxy'],
				},
			];

			const unsubscribe = listenForItem('products', multipleConditions, (products) => {
				setProductData(products);
			});

			// Cleanup the listener when the component unmounts
			return () => unsubscribe();
		};

		// Fetch initial data and set up real-time listener
		fetchInitialData();
		setUpRealTimeListener();
	}, [sellerId]);

	const renderProducts = ({ item }) => {
		return (
			<View style={[styles.productContainer, { width: cardWidth }]}>
				<View style={styles.productCard}>
					<View style={styles.imageContainer}>
						<Image source={{ uri: item.img }} style={styles.image} />
					</View>
					<Text style={styles.productName}>{item.productName}</Text>

					{item.requiresPrescription == 'Yes' ? (
						<Text style={styles.productReq}> [ Requires Prescription ] </Text>
					) : (
						<Text style={styles.productReq}> </Text>
					)}

					<Text style={styles.productPrice}>₱ {item.price}</Text>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate('ProductDetailScreen', {
								productId: item.id,
								name: route.params?.name,
								branch: route.params?.branch,
							})
						}
					>
						<View style={styles.addtocartButton}>
							<Text style={styles.addtocartText}>View Product</Text>
							<Iconify icon="ic:round-greater-than" size={18} color="white" />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		);
	};
	return (
		<SafeAreaView>
			<ScrollView style={styles.container}>
				<View className="items-center flex-row mt-5 ml-3 mr-3 ">
					<Text style={styles.screenTitle}>
						{route.params?.name} ({route.params?.branch})
					</Text>
				</View>

				<View style={styles.searchFilterCont}>
					<View style={styles.searchCont}>
						<Iconify icon="circum:search" size={22} style={styles.iconSearch} />
						<TextInput placeholder="Search product" />
					</View>

					<TouchableOpacity>
						<View style={styles.iconFilterCont}>
							<Iconify icon="mi:filter" size={25} color="white" />
						</View>
					</TouchableOpacity>
				</View>

				<Text style={styles.productSelectionText}>Product Selection</Text>

				<FlatList
					numColumns={2} // Display two items per row
					scrollEnabled={false}
					data={product}
					keyExtractor={(item) => item.id}
					renderItem={renderProducts}
					// columnWrapperStyle={styles.columnWrapper}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};
export default ProductScreen;
