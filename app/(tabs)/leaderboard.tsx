import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { userId, groupId } from "../store";

const API = "http://10.0.0.10:8080";

export default function Leaderboard() {
    const [data, setData] = useState<any[]>([]);
    const [groupName, setGroupName] = useState<string | null>(null);

    const loadLeaderboard = async () => {
        if (!groupId) return;

        try {
            const res = await fetch(`${API}/leaderboard?groupId=${groupId}`);
            if (!res.ok) return;

            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        }
    };

    const loadGroupName = async () => {
        if (!groupId) return;

        try {
            const res = await fetch(`${API}/groups/${groupId}`);
            if (!res.ok) return;

            const group = await res.json();
            setGroupName(group.name);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadLeaderboard();
        loadGroupName();
    }, [groupId]);

    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 80 }}>
            <Text style={{ fontSize: 28, marginBottom: 5 }}>
                🏆 {groupName ?? "Loading group..."}
            </Text>

            <FlatList
                data={data}
                keyExtractor={(item) => item.userId.toString()}
                renderItem={({ item, index }) => {
                    const isMe = item.userId === userId;
                    const isLeader = index === 0;

                    return (
                        <Text
                            style={{
                                fontSize: 18,
                                marginBottom: 10,
                                fontWeight: isMe ? "bold" : "normal",
                            }}
                        >
                            {isLeader ? "👑 " : ""}
                            {index + 1}. {item.username} — {item.hits}
                            {isMe ? " (You)" : ""}
                        </Text>
                    );
                }}
            />
        </View>
    );
}