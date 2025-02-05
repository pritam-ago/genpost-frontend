import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Welcome</Text>
      <Link href="./login" style={{ fontSize: 18, color: "blue", marginBottom: 10 }}>Login</Link>
      <Link href="./signup" style={{ fontSize: 18, color: "blue" }}>Signup</Link>
    </View>
  );
}
