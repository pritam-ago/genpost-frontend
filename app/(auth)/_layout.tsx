import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
    <StatusBar
                hidden={false}
                style="light"
                translucent={true}
                backgroundColor="transparent"
              />

      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" , headerShown: false}} />
        <Stack.Screen name="signup" options={{ title: "Signup", headerShown: false }} />
      </Stack>

    </>

  );
}