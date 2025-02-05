import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";

interface PostCardProps {
  prompt: string;
  platforms: string[];
  createdAt: string;
}

const platformIcons: { [key: string]: string } = {
  instagram: "📷",
  x: "🐦",
  facebook: "📘",
  linkedin: "💼",
};

const PostCard: React.FC<PostCardProps> = ({ prompt, platforms, createdAt }) => {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  return (
    <View style={[styles.card, isWeb ? styles.webCard : styles.mobileCard]}>
      <Text style={styles.title}>{prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt}</Text>
      <View style={styles.footer}>
        <View style={styles.platforms}>
          {platforms.map((platform, index) => (
            <Text key={index} style={styles.platformBadge}>
              {platformIcons[platform] || "🔗"}
            </Text>
          ))}
        </View>
        <Text style={styles.date}>{new Date(createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
  },
  webCard: {
    width: "50%",
    alignSelf: "center",
  },
  mobileCard: {
    width: "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  platforms: {
    flexDirection: "row",
    gap: 8,
  },
  platformBadge: {
    fontSize: 14,
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
});

export default PostCard;
