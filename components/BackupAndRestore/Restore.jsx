import React, { useState } from "react";
import { View, ToastAndroid, Alert, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "react-native-paper";
import db from "../../Database";
import * as Haptic from "expo-haptics";

export default function Restore() {
  const [loading, setLoading] = useState(false);

  const insertCustomerData = (jsonData) => {
    db.transaction((tx) => {
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
                ],
                (_, result) =>
                  console.log("Inserted item with ID:", result.insertId),
                (_, error) => console.error("Error inserting item:", error)
              );
            } else {
              console.log(`Record with ID ${id} already exists.`);
            }
          },
          (_, error) => console.error("Error checking existing record:", error)
        );
      });
    }, null);
  };

  const insertWaskatData = (jsonData) => {
    db.transaction((tx) => {
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
          regestrationDate,
        } = item;

        tx.executeSql(
          `SELECT * FROM waskat WHERE id = ?`,
          [id],
          (_, result) => {
            if (result.rows.length === 0) {
              // If the record doesn't exist, insert it
              tx.executeSql(
                `INSERT INTO waskat 
                (id,
                  name,
                  phoneNumber,
                  qad,
                  yakhan,
                  shana,
                  baghal,
                  kamar,
                  soreen,
                  regestrationDate) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  id,
                  name,
                  phoneNumber,
                  qad,
                  yakhan,
                  shana,
                  baghal,
                  kamar,
                  soreen,
                  regestrationDate,
                ],
                (_, result) =>
                  console.log("Inserted item with ID:", result.insertId),
                (_, error) => console.error("Error inserting item:", error)
              );
            } else {
              console.log(`Record with ID ${id} already exists.`);
            }
          },
          (_, error) => console.error("Error checking existing record:", error)
        );
      });
    }, null);
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        multiple: false,
      });

      if (result.canceled) {
        console.log("User canceled the document picker.");
        return;
      }

      const { uri } = result.assets[0];
      const jsonData = await FileSystem.readAsStringAsync(uri);
      if (jsonData) {
        setLoading(true); // Set loading to true while restoring data
        Alert.alert(
          "Restore Confirmation",
          "Are you sure you want to restore data?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => setLoading(false), // If canceled, set loading to false
            },
            {
              text: "Restore",
              onPress: () => handleRestore(jsonData),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error picking or reading file:", error);
    }
  };

  const handleRestore = (jsonData) => {
    if (!jsonData) {
      console.error("JSON data is undefined");
      return;
    }

    const parsedData = JSON.parse(jsonData);
    console.log(parsedData); // Log parsedData to inspect its structure

    if (parsedData.customers) {
      insertCustomerData(parsedData.customers);
    } else {
      console.error("Customer data is missing in JSON");
    }

    if (parsedData.waskat) {
      insertWaskatData(parsedData.waskat);
    } else {
      console.error("Waskat data is missing in JSON");
    }

    ToastAndroid.show("Data restored successfully", ToastAndroid.SHORT);
    setLoading(false);
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
  };

  return (
    <View>
      <Button
        icon="file-restore"
        mode="elevated"
        buttonColor="white"
        onPress={pickFile}
      >
        Restore Data
      </Button>
      {loading && <ActivityIndicator color="blue" size={40} />}
    </View>
  );
}
