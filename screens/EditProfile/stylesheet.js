import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	wholeContainer: {
		backgroundColor: 'white',
		paddingBottom: 400,
		borderRadius: 20,
	},
	upperContainer: {
		alignItems: 'center', // Align items vertically
		justifyContent: 'center', // Center items horizontally
	},
	lowerContainer: {
		width: '80%',
		marginTop: 5,
		marginLeft: 40,
	},
	title: {
		fontWeight: 600,
		fontSize: 18,
		marginTop: 20,
	},
	pic_cont: {
		width: 120,
		height: 120,
		marginTop: 7,
	},
	camera: {
		backgroundColor: '#EC6F56', //black
		padding: 7,
		borderRadius: 24,
		marginVertical: -33,
		marginLeft: 80,
	},
	label: {
		fontSize: 16,
		fontWeight: 600,
		marginLeft: 6,
		marginBottom: 8,
	},
	infoContView: {
		backgroundColor: '#F5F2F2',
		padding: 10,
		borderRadius: 20,
		height: 45,
		justifyContent: 'center',
	},
	infoContViewBirthdate: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F5F2F2',
		padding: 10,
		borderRadius: 20,
		height: 45,
	},
	info: {
		fontSize: 15,
		marginLeft: 10,
	},
	disabledInput: {
		color: 'black',
	},
	infoGender: {
		marginLeft: -5,
	},
	labelInfoCont: {
		marginVertical: 6,
	},

	iconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between', // Add this line
	},

	addButtonView: {
		width: '85%',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 20,
	},
	addButton: {
		backgroundColor: 'black',
		width: '100%',
		padding: 15,
		borderRadius: 25,
	},
	addText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 16,
	},
	chooseFileTouchable: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: '#D9D9D9',
		alignItems: 'center',
		width: '75%',
		borderRadius: 25,
		fontSize: 12,
		fontWeight: 400,
		padding: 10,
	},
	chooseFileText: {
		color: '#4E4E4E',
	},
	fileDisplayText: {
		color: '#4E4E4E',
		marginLeft: 10,
	},
	chooseFileTextView: {
		backgroundColor: '#F5F2F2',
		borderRadius: 25,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 5,
		paddingBottom: 8,
	},
	statusView: {
		marginTop: 15,
	},
	statusText: {
		fontSize: 15,
		color: '#EC6F56',
	},
	disabledEditButton: {
		fontWeight: 'bold',
		fontSize: 16,
		color: 'white',
		textAlign: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
		paddingTop: 15,
		paddingBottom: 15,
		paddingRight: 60,
		paddingLeft: 60,
		borderRadius: 30,
	},
});

export default styles;
