import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { setGroup, userId } from "./store";
import { useRouter } from "expo-router";

const API = "http://10.0.0.10:8080";

export default function Join() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const joinGroup = async () => {
    if (!userId) {
      setError("Not logged in");
      return;
    }

    try {
      const res = await fetch(
        `${API}/groups/join-by-code?userId=${userId}&code=${code}`,
        { method: "POST" }
      );

      const text = await res.text();

      if (!res.ok) {
        setError(text);
        return;
      }

      const membership = JSON.parse(text);

      // Save selected group
      setGroup(membership.group.id);

      router.replace("/(tabs)/home");
    } catch {
      setError("Network error");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Join Group 🚗💛
      </Text>

      <TextInput
        placeholder="Invite Code"
        value={code}
        onChangeText={setCode}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 20,
        }}
      />

      <Button title="Join" onPress={joinGroup} />

      {error ? (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      ) : null}
    </View>
  );
}