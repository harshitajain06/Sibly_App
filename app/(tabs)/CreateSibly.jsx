import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const CreateAvatarScreen = () => {
  const navigation = useNavigation();

  const navigateToDetails = (avatarName) => {
    navigation.navigate("AvatarDetails", { avatarName });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Choose Your Avatar
      </Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Select Avatar
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigateToDetails("Avatar1")}
            >
              Avatar1
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigateToDetails("Avatar2")}
            >
              Avatar2
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigateToDetails("Avatar3")}
            >
              Avatar3
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    elevation: 5,
  },
  cardTitle: {
    textAlign: "center",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 10,
  },
  button: {
    marginVertical: 5,
    borderRadius: 25,
    paddingVertical: 8,
  },
});

export default CreateAvatarScreen;
