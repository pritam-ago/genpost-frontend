import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
    <StatusBar
            hidden={false}
            style="light"
            translucent={true} 
            backgroundColor="transparent" 
          />
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1F305C", 
          borderTopWidth: 0, 
        },
        tabBarActiveTintColor: "#F2AD94",
        tabBarInactiveTintColor: "#66BCF2", 
      }}
    >
      <Tabs.Screen
        name="(homeStack)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "GenPost",
          tabBarIcon: ({ color }) => <Ionicons name="add" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs></>
  );
}
