import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import type { Profile, FriendRequest } from "../../lib/supabase";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
    loadFriendRequests();
  }, []);

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();

    if (data) setProfile(data);
  };

  const loadFriendRequests = async () => {
    const { data } = await supabase
      .from("friend_requests")
      .select(
        `
        *,
        sender:profiles!friend_requests_sender_id_fkey(username),
        receiver:profiles!friend_requests_receiver_id_fkey(username)
      `
      )
      .eq("receiver_id", profile?.id)
      .eq("status", "pending");

    if (data) setFriendRequests(data);
  };

  const searchUsers = async () => {
    if (searchUsername.length < 3) return;

    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select()
      .ilike("username", `%${searchUsername}%`)
      .neq("id", profile?.id)
      .limit(5);

    setSearchResults(data || []);
    setLoading(false);
  };

  const sendFriendRequest = async (receiverId: string) => {
    await supabase.from("friend_requests").insert({
      sender_id: profile?.id,
      receiver_id: receiverId,
    });

    setSearchResults([]);
    setSearchUsername("");
  };

  const handleFriendRequest = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    await supabase
      .from("friend_requests")
      .update({ status })
      .eq("id", requestId);

    loadFriendRequests();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/sign-in");
  };

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{profile.username}</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Find Friends</Text>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username"
            value={searchUsername}
            onChangeText={setSearchUsername}
            onSubmitEditing={searchUsers}
          />
          <TouchableOpacity onPress={searchUsers} disabled={loading}>
            <Ionicons name="search" size={24} color="#1B1464" />
          </TouchableOpacity>
        </View>

        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.searchResult}>
                <Text>{item.username}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => sendFriendRequest(item.id)}
                >
                  <Text style={styles.addButtonText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.requestsSection}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text>{item.sender.username}</Text>
              <View style={styles.requestButtons}>
                <TouchableOpacity
                  style={[styles.requestButton, styles.acceptButton]}
                  onPress={() => handleFriendRequest(item.id, "accepted")}
                >
                  <Text style={styles.requestButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.requestButton, styles.rejectButton]}
                  onPress={() => handleFriendRequest(item.id, "rejected")}
                >
                  <Text style={styles.requestButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pending friend requests</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1B1464",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  signOutButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  signOutText: {
    color: "#1B1464",
    fontWeight: "bold",
  },
  searchSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  searchResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#1B1464",
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  requestsSection: {
    padding: 20,
    flex: 1,
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    marginBottom: 5,
  },
  requestButtons: {
    flexDirection: "row",
    gap: 10,
  },
  requestButton: {
    padding: 8,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
