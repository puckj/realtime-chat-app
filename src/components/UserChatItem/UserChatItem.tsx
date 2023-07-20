import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";
import axios from "axios";
import { API_URL } from "@env";
import { useAppSelector } from "../../store/hooks";
import { selectUserId } from "../../store/features/user/userSlice";
import { formatTime } from "../../helpers/formatTime";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const UserChatItem = ({ item }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const userId = useAppSelector(selectUserId);
  const [lastMessages, setLastMessages] = useState<any>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/messages/${userId}/${item._id}`
      );
      if (response.status === 200) {
        // console.log(response.data);
        const userMessages = response.data.filter(
          (message: any) => message.messageType === "text"
        );
        const n = userMessages.length;
        setLastMessages(userMessages[n - 1]);
      }
    } catch (error) {
      console.error("error fetching messages", error);
    }
  };

  console.log(lastMessages);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatMessagesScreen", { recepientId: item._id })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderWidth: 0.7,
        borderColor: "#d0d0d0",
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: item.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "500" }}>{item.name}</Text>
        {lastMessages && (
          <Text style={{ marginTop: 5, color: "gray", fontWeight: "500" }}>
            {lastMessages.message}
          </Text>
        )}
      </View>
      <View>
        {lastMessages && (
          <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
            {formatTime(lastMessages.timeStamp)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UserChatItem;
