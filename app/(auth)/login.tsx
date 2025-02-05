import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { login } from "../../api/auth";
import { Ionicons } from "@expo/vector-icons"; 

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const uid = await AsyncStorage.getItem("uid");
      if (uid) {
        router.replace("/home"); 
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in both fields");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    if (password.length < 6) {
      return Alert.alert("Password Too Short", "Password must be at least 6 characters long.");
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      const uid = response.data.user._id;
      await AsyncStorage.setItem("uid", uid);
      alert("Login successful");
      router.replace("/home");
    } catch (error) {
      setLoading(false); 
      alert("Login failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ marginBottom: 30, fontSize: 25, fontWeight: "bold" }}>Login Screen</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          width: "100%",
          paddingHorizontal: 10,
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 20,
            width: "100%",
            paddingHorizontal: 10,
          }}
          autoCapitalize="none"
        />
        
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -20 }],
          }}
          onPress={() => setPasswordVisible((prevState) => !prevState)} 
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"} 
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Button title="Login" onPress={handleLogin} />
      
      {loading && (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}
