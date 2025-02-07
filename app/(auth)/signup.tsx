import React, { useEffect, useState } from "react";
import { TextInput, Button, View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { signup } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validateUsername = (username: string) => {
  const regex = /^[a-zA-Z0-9._]+$/;
  return regex.test(username);
};

const validatePasswords = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

const validateLength = (value: string, maxLength: number) => {
  return value.length <= maxLength;
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSignup = async () => {
    setError("");  

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!validateUsername(username)) {
      return setError("Username can only contain letters, numbers, periods, and underscores.");
    }

    if (!validateLength(name, 20)) {
      return setError("Name cannot exceed 20 characters.");
    }

    if (!validateLength(username, 15)) {
      return setError("Username cannot exceed 15 characters.");
    }

    if (!validateLength(password, 20)) {
      return setError("Password cannot exceed 20 characters.");
    }

    if (!validatePasswords(password, confirmPassword)) {
      return setError("Your passwords do not match.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    setLoading(true);

    try {
      await signup(email, password, name, username);
      alert("Signup successful");
      router.push("/login");
    } catch (error) {
      setLoading(false);
      setError(`Signup failed: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#021F59" }}>
      <Ionicons
              name="arrow-back"
              size={30}
              color="black"
              style={{ position: "absolute",
                top: 20, 
                left: 20,
                zIndex: 1,
                backgroundColor: "#F2B705",
                borderRadius: 20,
                padding: 5, 
                marginTop: 20,}}
              onPress={() => router.replace('./welcome')}
            />
      <Text style={{ marginBottom: 30, fontSize: 25, fontWeight: "bold", color: "#F2B705" }}>Signup Screen</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 45,
          borderColor: "#F2B705",
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

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          height: 45,
          borderColor: "#F2B705",
          borderWidth: 2,
          borderRadius: 10,
          marginBottom: 15,
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
        }}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          height: 45,
          borderColor: "#F2B705",
          borderWidth: 2,
          borderRadius: 10,
          marginBottom: 15,
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
        }}
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
          borderColor: "#F2B705",
          borderWidth: 2,
          borderRadius: 10,
          marginBottom: 15,
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: "#FFF",
          }}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: [{ translateY: -16 }],
          }}
          onPress={() => setPasswordVisible((prevState) => !prevState)}
        >
          <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="#66BCF2" />
        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!confirmPasswordVisible}
          style={{
            height: 45,
            borderColor: "#F2B705",
            borderWidth: 2,
            borderRadius: 10,
            marginBottom: 15,
            width: "100%",
            paddingHorizontal: 15,
            backgroundColor: "#FFF",
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
          onPress={() => setConfirmPasswordVisible((prevState) => !prevState)}
        >
          <Ionicons name={confirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#66BCF2" />
        </TouchableOpacity>
      </View>

      {error && <Text style={{ color: "#F2B705", marginBottom: 10, fontSize: 14 }}>{error}</Text>}

      <TouchableOpacity
        onPress={handleSignup}
        style={{
          backgroundColor: "#3D90D9",
          paddingVertical: 12,
          paddingHorizontal: 50,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Signup
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#66BCF2" style={{ marginTop: 20 }} />}

      <Link href="./login" style={{ fontSize: 12, color: "#fff", marginTop: 30 }}>Have an account already? Login here</Link>
    </View>
  );
}
