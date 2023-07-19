import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  FriendsRequestScreen: undefined;
  ChatsScreen: undefined;
  ChatMessagesScreen: { recepientId: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;

export type ChatMessagesScreenRouteProp = RouteProp<
  RootStackParamList,
  "ChatMessagesScreen"
>;
