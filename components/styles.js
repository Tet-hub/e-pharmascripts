import styled from "styled-components";
import { View, Text, Image, TextInput } from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;

// colors
export const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tertiary: "#1F2937",
  darkLight: "#9CA3AF",
  light: "#F6F6F6",
  brand: "#808080",
  red: "#EB3F3F",
  black: "#000000",
  dark: "#222222",
  // dark: "#424242",
  gray: "#D9D9D9",
  orange: "#EC6F56",
  bodyGray: "#F5F5F5",
};

const {
  primary,
  secondary,
  tertiary,
  darkLight,
  light,
  brand,
  red,
  black,
  dark,
  gray,
  orange,
  bodyGray,
} = Colors;

//register and login styles
export const StyledContainer = styled.View`
  flex: 1;
  padding: ${StatusBarHeight + 5}px 25px 25px 25px;
  background-color: ${primary};
`;

export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  margin-top: 20px;
`;

export const PageLogo = styled.Image`
  width: 200px;
  height: 150px;
  align-self: center; /* Add this line to center the image horizontally */
  margin-vertical: 20px; /* Add margin to adjust the vertical position if needed */
`;
export const SignupPageLogo = styled.Image`
  width: 150px;
  height: 100px;
  align-self: center; /* Add this line to center the image horizontally */
  margin-vertical: 20px; /* Add margin to adjust the vertical position if needed */
`;
export const SignupPageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${red};
  padding: 8px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${red};
  padding: 10px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  text-align: center;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${dark};
`;

export const StyledFormArea = styled.View`
  width: 100%;
  padding: 0 16px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${primary};
  padding-left: 30px;
  border-radius: 18px;
  font-size: 16px;
  font-weight: 300;
  height: 55px;
  width: 100%;
  color: ${dark};
  border-width: 2px;
  border-color: rgba(0, 0, 0, 0.5);
  /*border-color: black;*/
  margin-left: 0;
  text-align: left;
  margin-vertical: 8px;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 20px;
  top: 42px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${orange};
  justify-content: center;
  align-items: center;
  border-radius: 26px;
  margin-vertical: 5px;
  height: 60px;
  width: 100%; /* Use a percentage of the screen width */
  margin-left: auto;
  margin-right: auto;
`;

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 20px;
  font-weight: 600; /* Semi-bold font weight */
  margin-top: -4px;
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${red};
  padding: 8px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  margin-top: 30px;
`;

export const Extratext = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${black};
  font-size: 17px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${orange};
  font-size: 17px;
  font-weight: 700;
`;

//google
export const GoogleButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${gray};
  border-radius: 23px;
  margin-vertical: 5px;
  flex-direction: row;
  height: 60px;
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Align items vertically */
  width: 100%; /* Use a percentage of the screen width */
  margin-left: auto;
  margin-right: auto;
`;

export const GoogleImage = styled.Image`
  width: 10%;
  height: 100%;
  margin-right: 10px;
`;

export const GoogleText = styled.Text`
  color: ${dark};
  font-weight: 400; /*Regular font weight*/
  font-size: 16px;
`;
export const Box = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${dark};
  padding: 8px;
`;

//register login styles end
