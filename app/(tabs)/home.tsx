import { View, Text, RefreshControl, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/api/post";
import { useFocusEffect } from "@react-navigation/native";

export default function Home() {
  const [posts, setPosts] = useState<{ prompt: string; platforms: string[]; createdAt: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); 

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
    } , []));

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {posts
        .slice()
        .reverse()
        .map((post, index) => (
          <PostCard key={index} prompt={post.prompt} platforms={post.platforms} createdAt={post.createdAt} />
        ))}
    </ScrollView>
  );
}
