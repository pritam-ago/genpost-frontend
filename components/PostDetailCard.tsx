import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Clipboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PostDetailCardProps {
  platform: string;
  content: string;
  hashtags: string[];
}

const PostDetailCard: React.FC<PostDetailCardProps> = ({ platform, content, hashtags }) => {
  const [isOpen, setIsOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    alert("Copied to clipboard!");
  };

  const copyHashtags = () => {
    const hashtagString = hashtags.map((hashtag) => `#${hashtag}`).join(" ");
    copyToClipboard(hashtagString);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.platform}>{platform}</Text>
        <Text style={styles.button}>...</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <View style={styles.copyContainer}>
            <Text style={styles.text}>{content}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(content)}>
              <Ionicons name="copy-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.hashtagContainer}>
            <View style={styles.hashtagsWrapper}>
              {hashtags.map((hashtag, index) => (
                <Text key={index} style={styles.hashtag}>#{hashtag}</Text>
              ))}
            </View>
            <TouchableOpacity onPress={copyHashtags}>
              <Ionicons name="copy-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3D90D9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  platform: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    fontSize: 26,
    color: "#000",
    fontWeight: "bold",
  },
  content: {
    marginTop: 10,
  },
  copyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  hashtagContainer: {
    flexDirection: "row", 
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  hashtagsWrapper: {
    flexDirection: "row", 
    flexWrap: "wrap",    
    alignItems: "center",
  },
  hashtag: {
    fontSize: 14,
    color: "#fff",
    marginRight: 0,
    fontFamily: "monospace",
  },
});

export default PostDetailCard;
