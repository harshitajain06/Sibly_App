import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Checkbox, Menu } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { auth, usersRef } from "../../config/firebase";


const AvatarDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { avatarName } = route.params;

  const [name, setName] = useState("");
  const [qualities, setQualities] = useState({
    fun: false,
    caring: false,
    responsive: false,
    others: false,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [otherCharacteristics, setOtherCharacteristics] = useState([]);

  const exampleCharacteristics = [
    "Supportive",
    "Understanding",
    "Adventurous",
    "Empathetic",
    "Humorous",
  ];

  const toggleQuality = (key) => {
    setQualities({ ...qualities, [key]: !qualities[key] });
  };

  const handleSelectCharacteristic = (characteristic) => {
    setOtherCharacteristics((prev) =>
      prev.includes(characteristic)
        ? prev.filter((item) => item !== characteristic)
        : [...prev, characteristic]
    );
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      const userRef = doc(usersRef, user.uid);
      const selectedQualities = Object.keys(qualities).filter(
        (key) => qualities[key]
      );

      if (qualities.others) {
        selectedQualities.push(...otherCharacteristics);
      }

      const avatarData = {
        [avatarName]: { name, qualities: selectedQualities },
      };

      console.log("User UID:", user.uid);
      console.log("Avatar Data:", avatarData);

      await setDoc(
        userRef,
        {
          avatars: avatarData,
        },
        { merge: true }
      );

      Alert.alert("Success", `${avatarName} has been updated.`);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", `Failed to save data: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        {avatarName} Details
      </Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Text variant="titleMedium" style={styles.subtitle}>
        Choose Qualities
      </Text>
      {Object.keys(qualities).map((key) => (
        <Checkbox.Item
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          status={qualities[key] ? "checked" : "unchecked"}
          onPress={() => toggleQuality(key)}
        />
      ))}
      {qualities.others && (
        <Menu
          visible={dropdownVisible}
          onDismiss={() => setDropdownVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setDropdownVisible(true)}
              style={styles.dropdownButton}
            >
              Select Characteristics
            </Button>
          }
        >
          {exampleCharacteristics.map((item) => (
            <Menu.Item
              key={item}
              title={item}
              onPress={() => handleSelectCharacteristic(item)}
            />
          ))}
        </Menu>
      )}
      <Text variant="bodyMedium" style={styles.selectedCharacteristics}>
        Selected Characteristics: {otherCharacteristics.join(", ")}
      </Text>
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Save Avatar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    marginBottom: 20,
  },
  subtitle: {
    marginBottom: 10,
  },
  dropdownButton: {
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedCharacteristics: {
    marginVertical: 10,
    fontStyle: "italic",
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 10,
  },
});

export default AvatarDetailsScreen;
