import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import { RootStackParamList } from "./types";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectIsAuthenticated,
  setUser,
} from "../store/features/user/userSlice";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendsRequestScreen from "../screens/FriendsRequestScreen/FriendsRequestScreen";
import ChatsScreen from "../screens/ChatsScreen/ChatsScreen";
import ChatMessagesScreen from "../screens/ChatMessagesScreen/ChatMessagesScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authTokenFromStorage = await AsyncStorage.getItem("authToken");
      console.log(authTokenFromStorage, "<< authTokenFromStorage");
      if (authTokenFromStorage !== null) {
        dispatch(setUser({ authToken: authTokenFromStorage }));
      }
      setIsLoading(false);
    };
    checkAuthentication();
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" color="#4A55A2" style={{ flex: 1 }} />
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Group>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
              name="FriendsRequestScreen"
              component={FriendsRequestScreen}
              options={{ headerTitle: "Friends Request" }}
            />
            <Stack.Screen
              name="ChatsScreen"
              component={ChatsScreen}
              options={{ headerTitle: "Chats" }}
            />
            <Stack.Screen
              name="ChatMessagesScreen"
              component={ChatMessagesScreen}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigator;
