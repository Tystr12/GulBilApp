import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { validateUser } from "./store";

const API = "http://10.0.0.10:8080";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    validateUser(API).then(ok => {
      setValid(ok);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!valid) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}