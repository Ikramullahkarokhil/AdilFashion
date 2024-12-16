import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Backup from "../BackupAndRestore/Backup";
import ResetPassword from "../ResetPassword/ResetPassword";
import { Button, Switch } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ onLogout }) => {
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("isFingerprintEnabled").then((value) => {
      setIsFingerprintEnabled(value === 'true');
    });
  }, []);

  const toggleResetPasswordModal = () => {
    setIsResetPasswordVisible(!isResetPasswordVisible);
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleFingerprintToggle = async () => {
    const newValue = !isFingerprintEnabled;
    setIsFingerprintEnabled(newValue);
    await AsyncStorage.setItem("isFingerprintEnabled", newValue.toString());
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
            color="#3498db" // Customize the switch color
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
  fingerprintToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 2,
    marginVertical: 20,
  },
  fingerprintLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  logout: {
    marginBottom: 20,
  },
});
