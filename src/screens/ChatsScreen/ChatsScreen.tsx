import { Platform, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserId } from "../../store/features/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";
import { API_URL } from "@env";
import axios from "axios";
import UserChatItem from "../../components/UserChatItem/UserChatItem";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const ChatsScreen = () => {
  const userId = useAppSelector(selectUserId);
  const navigation = useNavigation<RootStackNavigationProp>();
  const [acceptedFriendsList, setAcceptedFriendsList] = useState([]);
  useEffect(() => {
    fetchAcceptedFriendsList();
  }, []);

  const fetchAcceptedFriendsList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/accepted-friends/${userId}`);
      if (response.status === 200) {
        // console.log(response.data);
        setAcceptedFriendsList(response.data);
      }
    } catch (error) {
      console.error("error showing the accepted friend", error);
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {acceptedFriendsList.map((item, index) => (
        <UserChatItem key={index} item={item} />
      ))}
    </ScrollView>
  );
};

export default ChatsScreen;
