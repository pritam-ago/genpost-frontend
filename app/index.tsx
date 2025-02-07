import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { ThemeProvider } from "./context/ThemeContext";

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
      <ThemeProvider>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="blue" />
          </View>
      </ThemeProvider>
      
    );
  }

  return(
    <ThemeProvider>
      <Redirect href={initialRoute as "/home" | "/welcome"} />
    </ThemeProvider>

  ); 
}
