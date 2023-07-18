import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../store/hooks";
import { clearUser } from "../../store/features/user/userSlice";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView>
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
    </SafeAreaView>
  );
};

export default HomeScreen;
