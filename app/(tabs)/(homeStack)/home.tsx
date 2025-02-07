import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useState } from "react";
import PostView from "@/components/PostView";

function Main() {
  const [activeTab, setActiveTab] = useState(0); 

  const handleTabPress = (index: number) => {
    setActiveTab(index); 
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#021F59" }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>POSTS</Text>
      </View>
      <View style={styles.tabBar}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {["Instagram", "X", "Linkedin", "Facebook"].map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tabButton, activeTab === index && styles.activeTab]}
              onPress={() => handleTabPress(index)}
            >
              <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <PostView />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#021F59",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F2AD94",
    marginTop: 25,
    fontFamily: "Roboto-Bold",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    backgroundColor: "#021F59",
    marginBottom: 0,
  },
  tabButton: {
    alignItems: "center",
    backgroundColor: "#3D90D9",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
    marginLeft: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  activeTab: {
    backgroundColor: "#F2B705",
    transform: [{ scale: 1.1 }],
  },
  activeTabText: {
    color: "#021F59", 
  },
});

export default Main;
