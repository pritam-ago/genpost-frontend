import React, { useEffect, useState } from "react";
import { TextInput, Button, View, Text, Alert, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { signup } from '../../api/auth';
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
    if (!validateEmail(email)) {
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    if (!validateUsername(username)) {
      return Alert.alert("Invalid Username", "Username can only contain letters, numbers, periods, and underscores.");
    }

    if (!validateLength(name, 20)) {
      return Alert.alert("Name too long", "Name cannot exceed 20 characters.");
    }

    if (!validateLength(username, 15)) {
      return Alert.alert("Username too long", "Username cannot exceed 15 characters.");
    }

    if (!validateLength(password, 20)) {
      return Alert.alert("Password too long", "Password cannot exceed 20 characters.");
    }

    if (!validatePasswords(password, confirmPassword)) {
      return Alert.alert("Password Mismatch", "Your passwords do not match.");
    }

    if (password.length < 6) {
      return Alert.alert("Weak Password", "Password must be at least 6 characters long.");
    }

    try {
      await signup(email, password, name, username);
      alert("Signup successful");
      router.push("/login");
    } catch (error) {
      alert(`Signup failed: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ marginBottom: 30, fontSize: 25, fontWeight: "bold" }}>Signup Screen</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '100%', paddingHorizontal: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '100%', paddingHorizontal: 10 }}
        autoCapitalize="words" 
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '100%', paddingHorizontal: 10 }}
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
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            width: '100%',
            paddingHorizontal: 10
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
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={{ width: "100%", position: "relative" }}>
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!confirmPasswordVisible} 
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            width: '100%',
            paddingHorizontal: 10
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
          <Ionicons
            name={confirmPasswordVisible ? "eye-off" : "eye"} 
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Button title="Signup" onPress={handleSignup} />
      <Link href="./login" style={{ fontSize: 18, color: "blue", marginTop: 10 }}>Go to Login</Link>
    </View>
  );
}
