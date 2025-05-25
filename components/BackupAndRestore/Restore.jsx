"use client";

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
import {
  Button,
  ProgressBar,
  Surface,
  Portal,
  Dialog,
} from "react-native-paper";
import * as Haptics from "expo-haptics";
import db from "../../Database";

export default function Restore() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [restoreStats, setRestoreStats] = useState({ customers: 0, waskat: 0 });
  const [errorMessage, setErrorMessage] = useState("");

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
      // For iOS, we could use an alternative
      Alert.alert("Notification", message);
    }
  };

  // Validate backup data structure
  const validateBackupData = (data) => {
    if (!data) return false;
    if (!data.customers || !Array.isArray(data.customers)) return false;
    if (!data.waskat || !Array.isArray(data.waskat)) return false;
    return true;
  };

  // Insert customer data with proper error handling and transaction management
  const insertCustomerData = useCallback(async (jsonData) => {
    return new Promise((resolve, reject) => {
      let insertedCount = 0;
      let errorCount = 0;

      db.transaction(
        (tx) => {
          jsonData.forEach((item) => {
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

            // First check if record exists
            tx.executeSql(
              `SELECT * FROM customer WHERE id = ?`,
              [id],
              (_, result) => {
                if (result.rows.length === 0) {
                  // If the record doesn't exist, insert it
                  tx.executeSql(
                    `INSERT INTO customer 
                    (id, name, phoneNumber, qad, barDaman, baghal, shana, astin, tunban, pacha, yakhan, yakhanValue, farmaish, daman, caff, caffValue, jeeb, tunbanStyle, jeebTunban, regestrationDate) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
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
                    ],
                    () => {
                      insertedCount++;
                    },
                    (_, error) => {
                      console.error("Error inserting customer:", error);
                      errorCount++;
                    }
                  );
                }
              }
            );
          });
        },
        (error) => {
          console.error("Transaction error:", error);
          reject(error);
        },
        () => {
          resolve({ inserted: insertedCount, errors: errorCount });
        }
      );
    });
  }, []);

  // Insert waskat data with proper error handling and transaction management
  // Fixed the SQL query to match the number of columns and values
  const insertWaskatData = useCallback(async (jsonData) => {
    return new Promise((resolve, reject) => {
      let insertedCount = 0;
      let errorCount = 0;

      db.transaction(
        (tx) => {
          jsonData.forEach((item) => {
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

            // First check if record exists
            tx.executeSql(
              `SELECT * FROM waskat WHERE id = ?`,
              [id],
              (_, result) => {
                if (result.rows.length === 0) {
                  // FIXED: Removed the extra placeholder in VALUES clause
                  tx.executeSql(
                    `INSERT INTO waskat 
                    (id, name, phoneNumber, qad, yakhan, shana, baghal, kamar, soreen, astin, farmaish, regestrationDate) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
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
                    ],
                    () => {
                      insertedCount++;
                    },
                    (_, error) => {
                      console.error("Error inserting waskat:", error);
                      errorCount++;
                    }
                  );
                }
              }
            );
          });
        },
        (error) => {
          console.error("Transaction error:", error);
          reject(error);
        },
        () => {
          resolve({ inserted: insertedCount, errors: errorCount });
        }
      );
    });
  }, []);

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

      // Show file info to user
      setSelectedFile({
        uri,
        name,
        size: Math.round(size / 1024), // Size in KB
      });

      // Read file content
      const jsonData = await FileSystem.readAsStringAsync(uri);

      if (jsonData) {
        // Validate JSON format
        try {
          const parsedData = JSON.parse(jsonData);
          if (!validateBackupData(parsedData)) {
            setErrorMessage(
              "Invalid backup file format. Please select a valid backup file."
            );
            setSelectedFile(null);
            return;
          }

          // Show confirmation dialog
          setConfirmDialogVisible(true);
        } catch (error) {
          setErrorMessage(
            "Could not parse backup file. The file may be corrupted."
          );
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.error("Error picking or reading file:", error);
      setErrorMessage("Error reading file: " + error.message);
      triggerHapticFeedback("error");
    }
  };

  const handleRestore = async () => {
    try {
      setConfirmDialogVisible(false);
      setLoading(true);
      setProgress(0.1);

      // Read file again to ensure we have the latest data
      const jsonData = await FileSystem.readAsStringAsync(selectedFile.uri);
      const parsedData = JSON.parse(jsonData);

      console.log("Parsed data:", parsedData); // For debugging

      setProgress(0.3);

      // Process customer data
      let customerStats = { inserted: 0, errors: 0 };
      if (parsedData.customers && parsedData.customers.length > 0) {
        customerStats = await insertCustomerData(parsedData.customers);
      }

      setProgress(0.6);

      // Process waskat data
      let waskatStats = { inserted: 0, errors: 0 };
      if (parsedData.waskat && parsedData.waskat.length > 0) {
        waskatStats = await insertWaskatData(parsedData.waskat);
      }

      setProgress(0.9);

      // Update stats for user feedback
      setRestoreStats({
        customers: customerStats.inserted,
        waskat: waskatStats.inserted,
      });

      setProgress(1);

      // Show success message
      showToast(
        `Restore completed: ${customerStats.inserted} customers, ${waskatStats.inserted} waskat records`
      );
      triggerHapticFeedback("success");

      // Reset after successful restore
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

  const cancelRestore = () => {
    setConfirmDialogVisible(false);
    setSelectedFile(null);
  };

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
