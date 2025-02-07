import { View, Text, RefreshControl, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/api/post";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Main() {
  const [posts, setPosts] = useState<{[x: string]: any; prompt: string; platforms: string[]; createdAt: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Posts</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {posts
          .slice()
          .reverse()
          .map((post, index) => (
            <TouchableOpacity onPress={() => router.push(`./${post._id}`)} key={index}>
              <PostCard prompt={post.prompt} platforms={post.platforms} createdAt={post.createdAt} />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
