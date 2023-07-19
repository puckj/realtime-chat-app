import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import React from "react";
import axios from "axios";
import { API_URL } from "@env";
import { useAppSelector } from "../../store/hooks";
import { selectUserId } from "../../store/features/user/userSlice";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const FriendRequestItem = ({
  item,
  friendsRequestList,
  setFriendsRequestList,
}) => {
  const userId = useAppSelector(selectUserId);
  const acceptRequestHandle = async () => {
    try {
      // console.log(userId);
      // console.log(item._id);
      const body = {
        senderId: item._id,
        recepientId: userId,
      };
      const response = await axios.post(
        apiUrl + "/friend-request/accept",
        body
      );
      // console.log(response);
      if (
        response.status === 200 &&
        response.data.message === "Friend Request accepted successfully"
      ) {
        setFriendsRequestList(
          friendsRequestList.filter(
            (request: { _id: string }) => request._id !== item._id
          )
        );
      }
    } catch (error) {
      console.error("error accept friend request", error);
    }
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />
      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item.name} sent you a friend request
      </Text>
      <TouchableOpacity
        onPress={acceptRequestHandle}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FriendRequestItem;
