import { View, Text, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@env";
import { useAppSelector } from "../../store/hooks";
import { selectUserId } from "../../store/features/user/userSlice";
import FriendRequestItem from "../../components/FriendRequestItem/FriendRequestItem";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const FriendsRequestScreen = () => {
  const userId = useAppSelector(selectUserId);
  const [friendsRequestList, setFriendsRequestList] = useState([]);
  useEffect(() => {
    fetchFriendsRequest();
  }, []);
  const fetchFriendsRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/friend-request/${userId}`);
      //   console.log(response.data);
      if (response.status === 200) {
        setFriendsRequestList(response.data);
      }
    } catch (error) {
      console.error("error message >> ", error);
    }
  };
  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendsRequestList.length > 0 && (
        <>
          <Text>Your Friend Requests!</Text>
          {friendsRequestList.map((item, index) => (
            <FriendRequestItem
              key={index}
              item={item}
              friendsRequestList={friendsRequestList}
              setFriendsRequestList={setFriendsRequestList}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default FriendsRequestScreen;
