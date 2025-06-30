import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import Backup from "../../components/ui/Backup";
import ResetPassword from "../../components/ui/ResetPassword";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Settings = () => {
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const toggleResetPasswordModal = useCallback(() => {
    setIsResetPasswordVisible((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("isLoggedIn");
            router.replace("/screens/Login");
          } catch (error) {
            console.error("Error logging out:", error);
            setErrorMessage("Failed to log out. Please try again.");
          }
        },
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button
          mode="elevated"
          buttonColor="white"
          onPress={toggleResetPasswordModal}
          accessibilityLabel="Change Password"
          textColor="black"
          icon={() => (
            <MaterialCommunityIcons name="lock-reset" size={18} color="black" />
          )}
        >
          Change Password
        </Button>
        <ResetPassword
          onClose={toggleResetPasswordModal}
          isVisible={isResetPasswordVisible}
        />
        <Backup />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>

      <View style={styles.logout}>
        <Button
          icon="logout"
          mode="elevated"
          buttonColor="white"
          onPress={handleLogout}
          accessibilityLabel="Logout"
          textColor="black"
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default React.memo(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  logout: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
