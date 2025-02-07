import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getPost } from "@/api/post";
import PostDetailCard from "@/components/PostDetailCard";
import { Ionicons } from "@expo/vector-icons";

export default function Post() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [post, setPost] = useState<{ prompt: string; platforms: string[]; content: Record<string, { content: string; hashtags: string[] }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPost(Array.isArray(id) ? id[0] : id);
        setPost(response.data);
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchPost();
  }, [id]);

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
      

  );

  if (error) return <Text style={{ color: "red" }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back"
        size={30}
        color="black"
        style={styles.backButton}
        onPress={() => router.back()}
      />
      <Text style={styles.prompt}>{post?.prompt}</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {post?.content &&
          Object.entries(post.content).map(([platform, details]) => (
            <PostDetailCard
              key={platform}
              platform={platform}
              content={details.content}
              hashtags={details.hashtags}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    backgroundColor: "#021F59",
  },
  backButton: {
    position: "absolute",
    top: 20, 
    left: 20,
    zIndex: 1,
    backgroundColor: "#F2B705",
    borderRadius: 20,
    padding: 5, 
    marginTop: 20,
  },
  scrollView: {
    paddingBottom: 50, 
    flexGrow: 1,
  },
  prompt: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 45,
    color: "#fff"
  },
});
