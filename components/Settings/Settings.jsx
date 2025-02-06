import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Backup from "../BackupAndRestore/Backup";
import ResetPassword from "../ResetPassword/ResetPassword";
import { Button, Switch } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Settings = ({ onLogout }) => {
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fingerprintValue = await AsyncStorage.getItem("isFingerprintEnabled");
        setIsFingerprintEnabled(fingerprintValue === "true");
      } catch (error) {
        console.error("Error loading initial data:", error);
        setErrorMessage("Failed to load settings. Please try again.");
      }
    };

    loadInitialData();
  }, []);

  const toggleResetPasswordModal = () => {
    setIsResetPasswordVisible((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      onLogout();
    } catch (error) {
      console.error("Error logging out:", error);
      setErrorMessage("Failed to log out. Please try again.");
    }
  };

  const handleFingerprintToggle = async () => {
    try {
      const newValue = !isFingerprintEnabled;
      setIsFingerprintEnabled(newValue);
      await AsyncStorage.setItem("isFingerprintEnabled", newValue.toString());
    } catch (error) {
      console.error("Error saving fingerprint setting:", error);
      setErrorMessage("Failed to save fingerprint setting. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button
          mode="elevated"
          buttonColor="white"
          onPress={toggleResetPasswordModal}
          style={styles.button}
        >
          Change Password
        </Button>
        <ResetPassword
          onClose={toggleResetPasswordModal}
          isVisible={isResetPasswordVisible}
        />

        <Backup />

        <View style={styles.fingerprintToggleContainer}>
          <Text style={styles.fingerprintLabel}>Enable Fingerprint Unlock</Text>
          <Switch
            value={isFingerprintEnabled}
            onValueChange={handleFingerprintToggle}
            color="#3498db"
          />
        </View>
      </View>

      <View style={styles.logout}>
        <Button
          icon="logout"
          mode="elevated"
          buttonColor="white"
          style={styles.button}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#F2F5F3",
  },
  content: {
    flex: 1,
  },
  button: {
    marginBottom: 10,
  },
  accountSelection: {
    marginVertical: 20,
  },
  fingerprintToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 30,
    marginVertical: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fingerprintLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  logout: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
