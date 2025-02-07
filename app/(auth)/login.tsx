import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#021F59", padding: 20 }}>
      <Ionicons
              name="arrow-back"
              size={30}
              color="black"
              style={{ position: "absolute",
                top: 20, 
                left: 20,
                zIndex: 1,
                backgroundColor: "#F2AD94",
                borderRadius: 20,
                padding: 5, 
                marginTop: 20,}}
              onPress={() => router.replace('./welcome')}
            />
      <Text style={{ marginBottom: 30, fontSize: 26, fontWeight: "bold", color: "#F2AD94" }}>
        Login
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 45,
          borderColor: "#F2AD94",
          borderWidth: 2,
          borderRadius: 10,
          marginBottom: 15,
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
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
            height: 45,
            borderColor: "#F2AD94",
            borderWidth: 2,
            borderRadius: 10,
            marginBottom: 20,
            width: "100%",
            paddingHorizontal: 15,
            backgroundColor: "#FFF",
          }}
          autoCapitalize="none"
        />
        
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 15,
            top: "50%",
            transform: [{ translateY: -18 }],
          }}
          onPress={() => setPasswordVisible((prevState) => !prevState)} 
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"} 
            size={24}
            color="#F2AD94"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#3D90D9",
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Login
        </Text>
      </TouchableOpacity>
      
      {loading && (
        <ActivityIndicator size="large" color="#3D90D9" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}
