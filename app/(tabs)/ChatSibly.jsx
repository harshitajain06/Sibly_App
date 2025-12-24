import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { createCompletion } from "./openaiService";
import { useRoute } from "@react-navigation/native";

const ChatSibly = () => {
  const route = useRoute();
  const { selectedAvatar } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchAvatarDetails = async () => {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "No user is logged in.");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          console.log("User Data:", userData);

          if (!userData.avatars || Object.keys(userData.avatars).length === 0) {
            Alert.alert("Error", "No avatars found.");
            return;
          }

          const selectedAvatarDetails = userData.avatars[selectedAvatar];
          if (!selectedAvatarDetails) {
            Alert.alert("Error", "Selected avatar details not found.");
            return;
          }

          const systemMessage = {
            role: "system",
            content: `Here are the details of the selected avatar (${selectedAvatar}):\n\nName: ${selectedAvatarDetails.name}\nQualities: ${selectedAvatarDetails.qualities.join(", ")}\n\nRespond like a sibling.`,
          };

          setMessages([systemMessage]);
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Failed to fetch user details.");
      }
    };

    fetchAvatarDetails();
  }, [selectedAvatar]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const aiResponse = await createCompletion(newMessages);
      setMessages([...newMessages, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      Alert.alert("Error", "Failed to get a response from the AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[styles.messagesContainer, { paddingBottom: 10 }]}
          keyboardShouldPersistTaps="handled"
        >
          {messages.slice(1).map((msg, index) => (
            <View
              key={index}
              style={[
                msg.role === "user" ? styles.userMessage : styles.assistantMessage,
                index % 2 === 0 ? styles.messageColorEven : styles.messageColorOdd,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
            </View>
          ))}
          {loading && <ActivityIndicator size="large" color="#007BFF" />}
        </ScrollView>
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            editable={!loading}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    padding: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageColorEven: {
    backgroundColor: '#d1e7dd',
  },
  messageColorOdd: {
    backgroundColor: '#f8d7da',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatSibly;
