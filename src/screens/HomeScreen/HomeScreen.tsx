import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearUser, selectUserId } from "../../store/features/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import UserItem from "../../components/UserItem/UserItem";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const userId = useAppSelector(selectUserId);

  const [users, setUsers] = useState([]);
  const [friendRequestsList, setFriendRequestList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchFriendRequestList();
    fetchFriendsList();
  }, []);

  const fetchUsers = async () => {
    axios
      .get(`${apiUrl}/users/${userId}`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const fetchFriendRequestList = async () => {
    axios
      .get(`${apiUrl}/friend-requests/sent/${userId}`)
      .then((res) => {
        // console.log(res.data, "/friend-requests/sent/");
        setFriendRequestList(res.data);
      })
      .catch((err) => console.error(err));
  };
  const fetchFriendsList = async () => {
    axios
      .get(`${apiUrl}/friends/${userId}`)
      .then((res) => {
        // console.log(res.data, "/friends/");
        setFriendList(res.data);
      })
      .catch((err) => console.error(err));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <TouchableOpacity onPress={()=> navigation.navigate('FriendsRequestScreen')}>
            <Ionicons name="people-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.length > 0 &&
          users.map((item, index) => {
            return (
              <UserItem
                key={index}
                item={item}
                friendRequestsList={friendRequestsList}
                friendList={friendList}
              />
            );
          })}
      </View>
      <TouchableOpacity
        onPress={() => dispatch(clearUser())}
        style={{
          backgroundColor: "red",
          width: 200,
          alignSelf: "center",
          padding: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
