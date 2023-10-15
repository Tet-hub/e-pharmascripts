import { StyleSheet, Dimensions } from 'react-native';
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		paddingBottom: 20,
		borderTopLeftRadius: 20, // Apply a border radius to the top left corner
		borderTopRightRadius: 20, // Apply a border radius to the top right corner
		flex: 1,
	},
	row: {
		flexDirection: 'row',
	},
	productContainer: {
		paddingHorizontal: 8,
		paddingVertical: 10,
		width: '50%', // Use 50% width for two columns
		flex: 1, // Use flex: 1 to evenly distribute products
	},
	productCard: {
		borderRadius: 15,
		backgroundColor: 'white',
		padding: 4,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
		height: '100%',
	},
	screenTitle: {
		fontSize: 18,
		fontWeight: 600,
		marginTop: 20,
		marginLeft: 20,
	},
	line: {
		height: 0.5,
		width: '90%',
		backgroundColor: '#8E8E8E',
		marginTop: 20,
		marginBottom: 5,
		marginLeft: 20,
	},
	image: {
		height: (deviceWidth * 2) / 9,
		width: '100%',
	},
	productName: {
		fontWeight: 600,
		fontSize: 12,
		color: '#3C3C3C',
		textAlign: 'center',
	},
	productReq: {
		fontWeight: 300,
		fontSize: 7,
		color: '#0CB669',
		textAlign: 'center',
		marginTop: 5,
	},
	productPrice: {
		fontWeight: 600,
		fontSize: 15,
		color: 'black',
		textAlign: 'center',
		marginTop: 5,
	},
	addButton: {
		flexDirection: 'row',
		backgroundColor: '#EC6F56',
		justifyContent: 'center',
		borderRadius: 15,
		paddingTop: 10,
		paddingBottom: 10,
		marginRight: 20,
		marginLeft: 20,
		marginTop: 5,
		marginBottom: 10,
	},
	addText: {
		color: 'white',
		fontWeight: 600,
		fontSize: 12,
	},
	imageContainer: {
		width: '100%',
		alignSelf: 'center',
		marginTop: 15,
		marginBottom: 5,
		paddingHorizontal: 15,
	},
	xButton: {
		backgroundColor: '#8E8E8E',
		borderRadius: 50,
		padding: 3,
	},
	xButtonContainer: {
		flexDirection: 'row',
		marginLeft: 5,
		marginTop: 5,
		marginBottom: -10,
	},
});

export default styles;
