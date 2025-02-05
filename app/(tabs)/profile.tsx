import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getUser, deleteUser, updateUser, verifyPassword } from "../../api/user";

interface User {
  _id: string;
  email: string;
  name: string;
  username: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editable, setEditable] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = await AsyncStorage.getItem("uid");
        if (uid) {
          const response = await getUser(uid);
          const userData = response.data;
          setUser(userData);
          setNewEmail(userData.email);
          setNewName(userData.name);
          setNewUsername(userData.username);
        } else {
          router.replace("/welcome");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [refreshing]);

  const handleEditToggle = () => {
    setEditable(!editable);
  };

  const handleUpdate = async () => {
    if (!newEmail || !newName || !newUsername) {
      return Alert.alert("Error", "Please fill in all required fields.");
    }

    try {
      if (user) {
        let updateData: any = {
          email: newEmail !== user.email ? newEmail : undefined,
          name: newName !== user.name ? newName : undefined,
          username: newUsername !== user.username ? newUsername : undefined,
        };

        if (newPassword) {
          if (!currentPassword) {
            return Alert.alert("Error", "Please enter your current password.");
          }

          const verifyResponse = await verifyPassword(user._id, currentPassword);
          if (!verifyResponse.data.valid) {
            return Alert.alert("Error", "Current password is incorrect.");
          }

          updateData.password = newPassword;
        }

        await updateUser(user._id, updateData.name, updateData.username, updateData.email, updateData.password);
        Alert.alert("Success", "Your profile has been updated.");
        setEditable(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              if (user) {
                await deleteUser(user._id);
                await AsyncStorage.removeItem("uid");
                router.replace("/welcome");
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "Could not delete account.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("uid");
    router.replace("/welcome");
  };

  if (!user) {
    return <Text style={styles.loadingText}>Loading...</Text>; 
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.profileContainer}>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          {editable ? (
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{user.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          {editable ? (
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username:</Text>
          {editable ? (
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              style={styles.input}
            />
          ) : (
            <Text style={styles.value}>{user.username}</Text>
          )}
        </View>

        {editable && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password:</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password:</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </>
        )}
      <TouchableOpacity style={styles.button} onPress={editable ? handleUpdate : handleEditToggle}>
                <Text style={styles.buttonText}>{editable ? "Save Changes" : "Edit Profile"}</Text>
              </TouchableOpacity>
        {editable ? (
          <>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditable(false)}>
              <Text style={styles.buttonText}>Cancel Edit</Text>
              </TouchableOpacity>
          </>
        ):null}

        
        {
          !editable ? (
            <>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
            </>
          ) :
          null
        }
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
    elevation: 3,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
});
