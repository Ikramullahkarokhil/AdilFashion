import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Haptic from "expo-haptics";
import Restore from "./Restore";
import db from "../../Database";

const Backup = () => {
  const [loading, setLoading] = useState(false);

  const exportDataToJson = async (tableName) => {
    const query = `SELECT * FROM ${tableName}`;
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (_, { rows }) => {
            const data = rows._array;
            const jsonData = JSON.stringify(data);
            resolve(jsonData);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const saveJsonToFile = async (jsonData) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      const fileUri =
        FileSystem.documentDirectory + `backup_${currentDate}.json`; // Append current date to file name
      await FileSystem.writeAsStringAsync(fileUri, jsonData);
      console.log("JSON data saved to file:", fileUri);
      return fileUri;
    } catch (error) {
      console.error("Error saving JSON data to file:", error);
    }
  };

  const handleBackup = async () => {
    try {
      setLoading(true); // Set loading to true while backing up data
      const customerData = await exportDataToJson("customer");
      const waskat = await exportDataToJson("waskat");
      // Repeat this for each table you want to backup

      // Merge or handle the data as needed
      const allData = {
        customers: JSON.parse(customerData),
        waskat: JSON.parse(waskat),
        // Add more tables here if needed
      };

      const fileUri = await saveJsonToFile(JSON.stringify(allData));

      // Share the file
      await Sharing.shareAsync(fileUri);

      ToastAndroid.show("Backup successful!", ToastAndroid.SHORT);

      // Trigger haptic feedback
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.error("Error backing up data:", error);
    } finally {
      setLoading(false); // Set loading to false after backing up data, whether successful or not
    }
  };

  return (
    <View style={styles.container}>
      <Button
        icon="backup-restore"
        mode="elevated"
        buttonColor="white"
        onPress={handleBackup}
      >
        Backup Customer Data
      </Button>
      {loading && (
        <ActivityIndicator color="blue" size={50} style={styles.loading} />
      )}

      <View style={styles.restoreContainer}>
        <Restore />
      </View>
    </View>
  );
};

export default Backup;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  restoreContainer: {
    marginTop: 20,
  },
  loading: {
    marginTop: 15,
  },
});
