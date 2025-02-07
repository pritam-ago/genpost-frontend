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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <View style={[styles.card, isWeb ? styles.webCard : styles.mobileCard]}>
      <Text style={styles.title}>{prompt.length > 50 ? `${prompt.substring(0, 50)}...` : prompt}</Text>
      <View style={styles.footer}>
        <View style={styles.platforms}>
          {platforms.map((platform, index) => (
            <Text
              key={index}
              style={[styles.platformBadge, styles[platform]]}
            >
              {platformIcons[platform] || "🔗"}
            </Text>
          ))}
        </View>
        <Text style={styles.date}>{formatDate(createdAt)}</Text>
      </View>
    </View>
  );
};

const styles: { [key: string]: any } = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#021F59",
  },
  webCard: {
    width: "50%",
    alignSelf: "center",
     backgroundColor: "#3D90D9"
  },
  mobileCard: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#3D90D9"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
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
    fontSize: 18,
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  date: {
    fontSize: 12,
    color: "#fff",
  },
  instagram: {
    backgroundColor: "#024873",
  },
  x: {
    backgroundColor: "#024873",
  },
  facebook: {
    backgroundColor: "#024873",
  },
  linkedin: {
    backgroundColor: "#024873",
  },
});

export default PostCard;
