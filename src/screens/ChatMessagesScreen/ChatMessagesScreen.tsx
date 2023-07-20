import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChatMessagesScreenRouteProp,
  RootStackNavigationProp,
} from "../../navigation/types";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { selectUserId } from "../../store/features/user/userSlice";
import { useAppSelector } from "../../store/hooks";
import axios from "axios";
import { API_URL, SERVER_FILE_PATH } from "@env";
import { formatTime } from "../../helpers/formatTime";
import * as ImagePicker from "expo-image-picker";

const apiUrl = Platform.OS === "android" ? "http://10.0.2.2:8080" : API_URL;

const ChatMessagesScreen = () => {
  const { params } = useRoute<ChatMessagesScreenRouteProp>();
  const userId = useAppSelector(selectUserId);
  const navigation = useNavigation<RootStackNavigationProp>();
  const [recepientData, setRecepientData] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [showEmojiSelector, setShowEmojiSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    // console.log(userId, "userId");
    // console.log(params.recepientId, "recepientId");
    fetchRecepientDetail();
    fetchMessages();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          {recepientData && (
            <>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
                source={{ uri: recepientData.image }}
              />
              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold" }}>
                {recepientData.name}
              </Text>
            </>
          )}
        </View>
      ),
    });
  }, [recepientData]);

  const fetchRecepientDetail = async () => {
    try {
      const response = await axios.get(apiUrl + "/user/" + params.recepientId);
      // console.log(response);
      if (response.status === 200) {
        // console.log(response.data);
        setRecepientData(response.data);
      }
    } catch (error) {
      console.log("error retrieving details", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/messages/${userId}/${params.recepientId}`
      );
      if (response.status === 200) {
        // console.log(response.data);
        setMessages(response.data);
      }
    } catch (error) {
      console.error("error fetching messages", error);
    }
  };

  const sendMessageHandle = async (messageType: string, imageUri?: any) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId!);
      formData.append("recepientId", params.recepientId);

      //if the message type id image or a normal text
      if (messageType === "image") {
        formData.append("messageType", "image");
        formData.append("imageFile", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text");
        formData.append("messageText", message);
      }
      const response = await axios.post(apiUrl + "/messages", formData);
      console.log(response, " send messageResponse");

      if (response.status === 200) {
        setMessage("");
        setSelectedImage("");
        fetchMessages();
      }
    } catch (error) {
      console.log("error in sending the message", error);
    }
  };

  const pickImageHandle = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      sendMessageHandle("image", result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <ScrollView>
        {messages.map((item: any, index) => {
          if (item.messageType === "text") {
            return (
              <Pressable
                key={index}
                style={[
                  item.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#dcf8c6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                ]}
              >
                <Text style={{ fontSize: 14, textAlign: "left" }}>
                  {item.message}
                </Text>
                <Text
                  style={{
                    textAlign: "right",
                    fontSize: 9,
                    color: "gray",
                    marginTop: 5,
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl = SERVER_FILE_PATH;
            const imageUrl = item.imageUrl;
            const fileName = imageUrl.split("/").pop();
            const source = { uri: baseUrl + "/files/" + fileName };
            // console.log(source);
            return (
              <Pressable
                key={index}
                style={[
                  item.senderId._id === userId
                    ? {
                        alignSelf: "flex-end",
                        backgroundColor: "#dcf8c6",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        backgroundColor: "white",
                        padding: 8,
                        maxWidth: "60%",
                        borderRadius: 7,
                        margin: 10,
                      },
                ]}
              >
                <View>
                  <Image
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    source={source}
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      fontSize: 9,
                      position: "absolute",
                      color: "white",
                      marginTop: 5,
                      right: 10,
                      bottom: 7,
                    }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: showEmojiSelector ? 0 : 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowEmojiSelector(!showEmojiSelector)}
          style={{ marginRight: 5 }}
        >
          <Entypo name="emoji-happy" size={24} color="gray" />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type Your message..."
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            marginHorizontal: 8,
          }}
        >
          <TouchableOpacity onPress={pickImageHandle}>
            <Entypo name="camera" size={24} color="gray" />
          </TouchableOpacity>
          <Feather name="mic" size={23} color="gray" />
        </View>

        <TouchableOpacity
          onPress={() => sendMessageHandle("text")}
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setMessage((prevMessage) => prevMessage + emoji)
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;
