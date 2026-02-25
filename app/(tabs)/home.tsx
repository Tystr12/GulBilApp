import { Redirect, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import { clearUser, userId, groupId, loadUserGroup } from "../store";

const API = "http://10.0.0.10:8080";



export default function Home() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [cooldown, setCooldown] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (userId && !groupId) {
      loadUserGroup(API).then(gid => {
        if (!mounted) return;

        if (!gid) {
          router.replace("/join");
        } else {
          loadGroupName();
          loadScore();
        }
      });
    } else if (userId && groupId) {
      loadGroupName();
      loadScore();
    }

    return () => {
      mounted = false;
    };
  }, [userId, groupId]);

  const loadScore = async () => {
    if (!groupId || !userId) return;

    try {
      const res = await fetch(`${API}/leaderboard?groupId=${groupId}`);
      if (!res.ok) return;

      const leaderboard = await res.json();
      const me = leaderboard.find((u: any) => u.userId === userId);

      if (me) {
        setScore(me.hits);
      } else {
        setScore(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadGroupName = async () => {
    if (!groupId) return;

    try {
      const res = await fetch(`${API}/groups`);
      if (!res.ok) return;

      const groups = await res.json();
      const g = groups.find((x: any) => x.id === groupId);

      if (g) setGroupName(g.name);
    } catch (err) {
      console.error(err);
    }
  };

  const registerHit = async () => {
    if (!userId) {
      setMessage("Not logged in");
      return;
    }

    if (!groupId) {
      setMessage("No group selected");
      return;
    }

    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 1500); // 1.5 sec cooldown


    try {
      const res = await fetch(
        `${API}/hits?userId=${userId}&groupId=${groupId}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const text = await res.text();
        setMessage(text || "Failed to register hit");
        return;
      }

      const data = await res.json();
      await loadScore();
      setMessage(`Hit registered!`);
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
      <Text style={{ fontSize: 22, marginBottom: 5 }}>
       Group:  {groupName ?? "Loading group..."}
      </Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Your hits: {score ?? "..."}
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