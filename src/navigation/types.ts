import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;
