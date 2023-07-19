import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUserId } from "../../store/features/user/userSlice";
import axios from "axios";
import { API_URL } from "@env";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const UserItem = ({ item, friendRequestsList, friendList }) => {
  const userId = useAppSelector(selectUserId);
  const [isRequestSent, setIsRequestSent] = useState(false);

  //   useEffect(() => {
  //     console.log(friendRequestsList, " friendRequestsList");
  //     // console.log(friendList, " friendList");
  //   }, [friendRequestsList]);

  const addFriendHandle = () => {
    console.log(userId, "currentUserId");
    console.log(item._id, "selectedUserId");
    const body = {
      currentUserId: userId,
      selectedUserId: item._id,
    };
    axios
      .post(apiUrl + "/friend-request", body)
      .then((res) => {
        console.log(res.data, "/friend-request");
        if (res.data === "OK") {
          setIsRequestSent(true);
        }
      })
      .catch((err) => console.error("error message", err));
  };

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item.email}</Text>
      </View>

      {friendList.includes(item._id) ? (
        <TouchableOpacity
          // onPress={addFriendHandle}
          disabled
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Friend
          </Text>
        </TouchableOpacity>
      ) : isRequestSent ||
        friendRequestsList.some((friend: any) => friend._id === item._id) ? (
        <TouchableOpacity
          disabled
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={addFriendHandle}
          style={{
            backgroundColor: "#567189",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add Friend
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserItem;
