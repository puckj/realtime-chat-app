import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "../../navigation/types";
import { Encryption } from "../../helpers/encryption";
import axios from "axios";
import { API_URL } from "@env";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "../../store/features/user/userSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("5555");
  const navigation = useNavigation<RootStackNavigationProp>();

  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    const user = {
      email,
      password: await Encryption(password),
    };
    axios
      .post(API_URL + "/login", user)
      .then((res) => {
        const token = res.data.token;
        console.log(token);
        
        //ทำต่อตรงนี้ ใช้ redux toolkit + AsyncStorage
        dispatch(setUser({authToken:token}))
      })
      .catch((err) => {
        console.error(err.response);
        Alert.alert("Login Error", "Invalid email or password");
      });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Sign In
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "600", marginTop: 15 }}>
            Sign In to Your Account
          </Text>
        </View>
        <View style={{ marginTop: 50 }}>
          <View>
            <Text>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              // placeholderTextColor={"black"}
              placeholder="Enter your email"
            />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              // placeholderTextColor={"black"}
              placeholder="Enter your password"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#4A55A2",
            padding: 15,
            marginTop: 50,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
