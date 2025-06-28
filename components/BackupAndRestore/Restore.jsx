import { useState, useCallback } from "react";
import {
  View,
  ToastAndroid,
  Alert,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { Button, ProgressBar, Portal, Dialog } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { executeSql } from "../../Database"; // Importing the executeSql function

export default function Restore() {
  // State variables for managing UI and restore process
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [restoreStats, setRestoreStats] = useState({ customers: 0, waskat: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  // Trigger haptic feedback for user interaction
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

  // Show toast notifications based on platform
  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notification", message); // Alternative for iOS
    }
  };

  // Validate the structure of the backup data
  const validateBackupData = (data) => {
    if (!data) return false;
    if (!data.customers || !Array.isArray(data.customers)) return false;
    if (!data.waskat || !Array.isArray(data.waskat)) return false;
    return true;
  };

  // Insert customer data into the database
  const insertCustomerData = useCallback(async (jsonData) => {
    let insertedCount = 0;
    let errorCount = 0;

    for (const item of jsonData) {
      const {
        id,
        name,
        phoneNumber,
        qad,
        barDaman,
        baghal,
        shana,
        astin,
        tunban,
        pacha,
        yakhan,
        yakhanValue,
        farmaish,
        daman,
        caff,
        caffValue,
        jeeb,
        tunbanStyle,
        jeebTunban,
        regestrationDate,
      } = item;

      try {
        // Check if the customer record already exists
        const selectResult = await executeSql(
          "SELECT * FROM customer WHERE id = ?",
          [id]
        );
        if (selectResult.rows.length === 0) {
          // Insert new record if it doesn’t exist
          const insertSql = `INSERT INTO customer 
            (id, name, phoneNumber, qad, barDaman, baghal, shana, astin, tunban, pacha, yakhan, yakhanValue, farmaish, daman, caff, caffValue, jeeb, tunbanStyle, jeebTunban, regestrationDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const params = [
            id,
            name || "",
            phoneNumber || "",
            qad || "",
            barDaman || "",
            baghal || "",
            shana || "",
            astin || "",
            tunban || "",
            pacha || "",
            yakhan || "",
            yakhanValue || "",
            farmaish || "",
            daman || "",
            caff || "",
            caffValue || "",
            jeeb || "",
            tunbanStyle || "",
            jeebTunban || "",
            regestrationDate || "",
          ];
          await executeSql(insertSql, params);
          insertedCount++;
        }
      } catch (error) {
        console.error("Error processing customer:", error);
        errorCount++;
      }
    }

    return { inserted: insertedCount, errors: errorCount };
  }, []);

  // Insert waskat data into the database
  const insertWaskatData = useCallback(async (jsonData) => {
    let insertedCount = 0;
    let errorCount = 0;

    for (const item of jsonData) {
      const {
        id,
        name,
        phoneNumber,
        qad,
        yakhan,
        shana,
        baghal,
        kamar,
        soreen,
        astin,
        farmaish,
        regestrationDate,
      } = item;

      try {
        // Check if the waskat record already exists
        const selectResult = await executeSql(
          "SELECT * FROM waskat WHERE id = ?",
          [id]
        );
        if (selectResult.rows.length === 0) {
          // Insert new record if it doesn’t exist
          const insertSql = `INSERT INTO waskat 
            (id, name, phoneNumber, qad, yakhan, shana, baghal, kamar, soreen, astin, farmaish, regestrationDate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const params = [
            id,
            name || "",
            phoneNumber || "",
            qad || "",
            yakhan || "",
            shana || "",
            baghal || "",
            kamar || "",
            soreen || "",
            astin || "",
            farmaish || "",
            regestrationDate || "",
          ];
          await executeSql(insertSql, params);
          insertedCount++;
        }
      } catch (error) {
        console.error("Error processing waskat:", error);
        errorCount++;
      }
    }

    return { inserted: insertedCount, errors: errorCount };
  }, []);

  // Handle file picking for the backup file
  const pickFile = async () => {
    try {
      setErrorMessage("");
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        multiple: false,
      });

      if (result.canceled) {
        console.log("User canceled the document picker.");
        return;
      }

      const { uri, name, size } = result.assets[0];

      // Store selected file details
      setSelectedFile({
        uri,
        name,
        size: Math.round(size / 1024), // Convert to KB
      });

      // Read and validate file content
      const jsonData = await FileSystem.readAsStringAsync(uri);
      if (jsonData) {
        const parsedData = JSON.parse(jsonData);
        if (!validateBackupData(parsedData)) {
          setErrorMessage(
            "Invalid backup file format. Please select a valid backup file."
          );
          setSelectedFile(null);
          return;
        }
        setConfirmDialogVisible(true); // Show confirmation dialog
      }
    } catch (error) {
      console.error("Error picking or reading file:", error);
      setErrorMessage("Error reading file: " + error.message);
      triggerHapticFeedback("error");
    }
  };

  // Handle the restore process
  const handleRestore = async () => {
    try {
      setConfirmDialogVisible(false);
      setLoading(true);
      setProgress(0.1);

      // Read and parse the file content
      const jsonData = await FileSystem.readAsStringAsync(selectedFile.uri);
      const parsedData = JSON.parse(jsonData);

      setProgress(0.3);

      // Restore customer data
      let customerStats = { inserted: 0, errors: 0 };
      if (parsedData.customers && parsedData.customers.length > 0) {
        customerStats = await insertCustomerData(parsedData.customers);
      }

      setProgress(0.6);

      // Restore waskat data
      let waskatStats = { inserted: 0, errors: 0 };
      if (parsedData.waskat && parsedData.waskat.length > 0) {
        waskatStats = await insertWaskatData(parsedData.waskat);
      }

      setProgress(0.9);

      // Update stats for feedback
      setRestoreStats({
        customers: customerStats.inserted,
        waskat: waskatStats.inserted,
      });

      setProgress(1);

      // Notify user of success
      showToast(
        `Restore completed: ${customerStats.inserted} customers, ${waskatStats.inserted} waskat records`
      );
      triggerHapticFeedback("success");

      // Reset state after completion
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setSelectedFile(null);
      }, 2000);
    } catch (error) {
      console.error("Restore error:", error);
      setErrorMessage("Error during restore: " + error.message);
      setLoading(false);
      triggerHapticFeedback("error");
    }
  };

  // Cancel the restore process
  const cancelRestore = () => {
    setConfirmDialogVisible(false);
    setSelectedFile(null);
  };

  // Render the UI
  return (
    <View style={styles.container}>
      <Button
        icon="file-restore"
        mode="elevated"
        onPress={pickFile}
        disabled={loading}
        buttonColor="white"
        textColor="black"
      >
        Restore Data
      </Button>

      {selectedFile && !loading && (
        <Text style={styles.fileInfo}>
          Selected: {selectedFile.name} ({selectedFile.size} KB)
        </Text>
      )}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {loading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progress < 1 ? "Restoring data..." : "Restore complete!"}
          </Text>
          <ProgressBar progress={progress} style={styles.progressBar} />

          {progress === 1 && (
            <Text style={styles.statsText}>
              Restored {restoreStats.customers} customers and{" "}
              {restoreStats.waskat} waskat records
            </Text>
          )}
        </View>
      )}

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={confirmDialogVisible} onDismiss={cancelRestore}>
          <Dialog.Title>Restore Confirmation</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to restore data from {selectedFile?.name}?
              This will add any missing records to your database.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelRestore}>Cancel</Button>
            <Button onPress={handleRestore}>Restore</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fileInfo: {
    fontSize: 14,
    color: "#666",
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
  statsText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginBottom: 16,
  },
});
