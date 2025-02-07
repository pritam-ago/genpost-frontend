import { View, Text, RefreshControl, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/api/post";
import { useRouter } from "expo-router";

interface Post {
  _id: string;
  prompt: string;
  platforms: string[];
  createdAt: string;
}

const PostView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#024873" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchPosts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {posts
        .slice()
        .reverse()
        .map((post) => (
          <TouchableOpacity onPress={() => router.push(`./${post._id}`)} key={post._id}>
            <PostCard prompt={post.prompt} platforms={post.platforms} createdAt={post.createdAt} />
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021F59",  
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#F2B705",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#024873",
    borderRadius: 5,
  },
  retryButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#021F59",  
  },
});

export default PostView;
