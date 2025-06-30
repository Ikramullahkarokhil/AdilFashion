import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ToastAndroid,
  Alert,
  Platform,
  Text,
} from "react-native";
import { Button, ProgressBar, Portal, Dialog } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Haptics from "expo-haptics";
import Restore from "./Restore";
import { fetchCustomers } from "../../database";

// Utility functions moved outside component for better performance
const exportDataToJson = async (tableName) => {
  try {
    const result = await fetchCustomers(tableName);
    return result || [];
  } catch (error) {
    console.error(`Error exporting data from ${tableName}:`, error);
    return [];
  }
};

const saveJsonToFile = async (jsonData) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `backup_${currentDate}.json`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(jsonData));
    return { fileUri, fileName };
  } catch (error) {
    throw new Error(`Error saving backup file: ${error.message}`);
  }
};

const Backup = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [backupDetails, setBackupDetails] = useState({ fileName: "", size: 0 });

  // Show confirmation dialog
  const showConfirmDialog = () => {
    setConfirmVisible(true);
  };

  // Hide confirmation dialog
  const hideConfirmDialog = () => {
    setConfirmVisible(false);
  };

  // Provide haptic feedback based on platform
  const triggerHapticFeedback = async (type = "success") => {
    try {
      if (type === "success") {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      } else if (type === "error") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.log("Haptics not available");
    }
  };

  // Show toast message with platform check
  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS, we could use an alternative like Alert or a custom toast component
      Alert.alert("Notification", message);
    }
  };

  const handleBackup = useCallback(async () => {
    try {
      hideConfirmDialog();
      setLoading(true);
      setProgress(0.1);

      // Get data from tables
      const customerData = await exportDataToJson("customer");
      setProgress(0.4);

      const waskatData = await exportDataToJson("waskat");
      setProgress(0.7);

      // Ensure we have valid arrays
      const allData = {
        customers: Array.isArray(customerData) ? customerData : [],
        waskat: Array.isArray(waskatData) ? waskatData : [],
        backupDate: new Date().toISOString(),
        appVersion: "1.0.0",
      };

      setProgress(0.8);

      // Save to file
      const { fileUri, fileName } = await saveJsonToFile(allData);

      // Get file size for user information
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      setBackupDetails({
        fileName,
        size: fileInfo.size ? Math.round(fileInfo.size / 1024) : 0,
      });

      setProgress(0.9);

      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Save your backup file",
        UTI: "public.json",
      });

      setProgress(1);
      triggerHapticFeedback("success");
      showToast("Backup completed successfully!");
    } catch (error) {
      console.error("Backup error:", error);
      triggerHapticFeedback("error");
      Alert.alert(
        "Backup Failed",
        `There was a problem creating your backup: ${error.message}`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button
        icon="backup-restore"
        mode="contained"
        onPress={showConfirmDialog}
        disabled={loading}
        style={styles.button}
        textColor="white"
        buttonColor="#0083D0"
      >
        Backup Customer Data
      </Button>

      {loading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress < 1 ? "Creating backup..." : "Backup complete!"}
          </Text>
          <ProgressBar progress={progress} style={styles.progressBar} />
          {backupDetails.fileName && (
            <Text
              style={styles.detailsText}
            >{`${backupDetails.fileName} (${backupDetails.size} KB)`}</Text>
          )}
        </View>
      )}

      <Restore />

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={confirmVisible} onDismiss={hideConfirmDialog}>
          <Dialog.Title>Create Backup</Dialog.Title>
          <Dialog.Content>
            <Text>
              This will create a backup of all your customer data and waskat
              records. The backup file will be saved to your device and you can
              share it.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideConfirmDialog}>Cancel</Button>
            <Button onPress={handleBackup}>Continue</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 10,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },

  progressContainer: {
    marginVertical: 16,
  },
  progressText: {
    marginBottom: 8,
    textAlign: "center",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  detailsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});

export default Backup;
