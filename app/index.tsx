import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const uid = await AsyncStorage.getItem("uid");
      setInitialRoute(uid ? "/home" : "/welcome");
    };

    checkAuth();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{backgroundColor: "#021F59"}}>
      <Redirect href={initialRoute as "/home" | "/welcome"} />
    </View>
      
);
}
