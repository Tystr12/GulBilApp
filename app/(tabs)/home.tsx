import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { clearUser, userId } from "../store";
const API = "http://10.0.0.10:8080";

export default function Home() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const registerHit = async () => {
    if (!userId) {
      setMessage("Not logged in");
      return;
    }

    try {
      const res = await fetch(
        `${API}/hits?userId=${userId}&groupId=1`,
        { method: "POST" }
      );

      const data = await res.json();
      setMessage(`GUL BIL! Hit #${data.id}`);
    } catch (err) {
      console.error(err);
      setMessage("Failed to register hit");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 32, marginBottom: 30 }}>
        🚗 GUL BIL 💛
      </Text>

      <Button title="GUL BIL!" onPress={registerHit} />

      <Text style={{ marginTop: 20 }}>{message}</Text>
      <Button title="Logout" onPress={() => {
        clearUser();
        router.replace("/login");
}} />
    </View>
    
  );
}