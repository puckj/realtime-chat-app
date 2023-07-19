import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";

const UserChatItem = ({ item }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
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
        <Text style={{ marginTop: 5, color: "gray", fontWeight: "500" }}>
          last message...
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: "400", color: "#585858" }}>
          3:00 pm
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserChatItem;
