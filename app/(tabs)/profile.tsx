import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, Button, Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getUser, deleteUser, updateUser, verifyPassword } from "../../api/user";
import { Ionicons } from "@expo/vector-icons";
import PostView from "@/components/PostView";

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
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [personalInfoView, setPersonalInfoView] = useState<boolean>(false);
  const [postView, setPostView] = useState<boolean>(true);

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
    if(personalInfoView){
      setEditable(true);
    }else{
      setPostView(false);
      setPersonalInfoView(true);
    }
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); 
  };

  const hideDropdown = () => {
    setDropdownVisible(false); 
  };
  const handlePersonalInfoView = () => {
    setPersonalInfoView(true);
    setPostView(false);
  }

  const handlePostView = () => {
    setPostView(true);
    setPersonalInfoView(false);
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.profileHeader}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.name}>{user.name}</Text>
        <TouchableOpacity style={styles.editButton} onPress={toggleDropdown}>
          <Ionicons name="settings" size={30} color="#000" />
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdownMenu}>

            {!editable && (<TouchableOpacity style={styles.dropdownItem} onPress={() => { handleEditToggle(); hideDropdown(); }}>
              <Text style={styles.dropdownText}>Edit Profile</Text>
            </TouchableOpacity>)}
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { handleDeleteAccount(); hideDropdown(); }}>
              <Text style={styles.dropdownText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => { handleLogout(); hideDropdown(); }}>
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={handlePostView}>
          <Text style={styles.tabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={handlePersonalInfoView}>
          <Text style={styles.tabText}>Personal Info</Text>
        </TouchableOpacity>
      </View>
    <View style={{paddingHorizontal: 20, width: "100%",}}>
        {postView && (<PostView />)}
      </View>
      

      {personalInfoView &&
        (<View style={styles.profileInfo}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          {editable ? (
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              style={styles.input}
              placeholder="Email"
            />
          ) : (
            <Text style={styles.value}>{user.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          {editable ? (
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholder="Name"
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          {editable ? (
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              style={styles.input}
              placeholder="Username"
            />
          ) : (
            <Text style={styles.value}>{user.username}</Text>
          )}
        </View>

        {editable && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                style={styles.input}
                placeholder="Current password"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.input}
                placeholder="New password"
              />
            </View>
          </>
        )}

        <View style={styles.buttonsContainer}>

          {editable && (<TouchableOpacity style={styles.button} onPress={editable ? handleUpdate : handleEditToggle}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>)}

          {editable && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditable(false)}>
              <Text style={styles.cancelButtonText}>Cancel Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#021F59",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#021F59",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  profileHeader: {
    backgroundColor: "#66BCF2",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: 30,
    marginTop: 40,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  name: {
    fontSize: 14,
    color: "#000",
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tabButton: {
    alignItems: "center",
    width : "50%"
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  profileInfo: {
    paddingHorizontal: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  value: {
    fontSize: 16,
    padding: 12,
    backgroundColor: "#3D90D9",
    borderRadius: 8,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    width: "60%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 14,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});
