import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearUser, selectUserId } from "../../store/features/user/userSlice";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "@env";
import UserItem from "../../components/UserItem/UserItem";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<RootStackNavigationProp>();
  const userId = useAppSelector(selectUserId);
  const [users, setUsers] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chat</Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          <Ionicons name="people-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    console.log(userId, "<< [userId]");
    const fetchUsers = async () => {
      axios
        .get(`${API_URL}/users/${userId}`)
        .then((res) => {
          console.log(res.data);
          setUsers(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUsers();
  }, []);

  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.length > 0 &&
          users.map((item, index) => <UserItem key={index} item={item} />)}
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
