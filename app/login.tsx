import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { setUser } from "./store";

const API = "http://10.0.0.10:8080";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const res = await fetch(
        `${API}/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const text = await res.text();
      if (!res.ok) {
        setError(text);
        return;
      }

      const user = JSON.parse(text);
      await setUser(user.id);
      router.replace("/");
    } catch (err) {
      setError("Network error");
    }
  };

  const register = async () => {
    try {
      const res = await fetch(
        `${API}/users/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const text = await res.text();
      if (!res.ok) {
        setError(text);
        return;
      }

      const user = JSON.parse(text);
      await setUser(user.id);
      router.replace("/");
    } catch {
      setError("Network error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>GulBil Login 🚗💛</Text>

      <TextInput placeholder="Username" value={username} onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 12, marginBottom: 10 }} />

      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, marginBottom: 20 }} />

      <Button title="Login" onPress={login} />
      <View style={{ height: 10 }} />
      <Button title="Register" onPress={register} />

      {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}
    </View>
  );
}