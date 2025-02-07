import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Welcome() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#021F59" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: "#F2B705", marginBottom: 30 }}>
        Welcome
      </Text>

      <Link href="./login" asChild>
        <TouchableOpacity style={{ backgroundColor: "#3D90D9", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, marginBottom: 15 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Login</Text>
        </TouchableOpacity>
      </Link>

      <Link href="./signup" asChild>
        <TouchableOpacity style={{ backgroundColor: "#3D90D9", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Signup</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
