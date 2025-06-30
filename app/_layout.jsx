import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import initializeDatabase from "../database";
import Login from "./screens/Login";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const _layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { customerName } = useGlobalSearchParams();

  useEffect(() => {
    const setupApp = async () => {
      try {
        // Check if database is already initialized
        const isDatabaseInitialized = await AsyncStorage.getItem(
          "isDatabaseInitialized"
        );
        if (isDatabaseInitialized !== "true") {
          await initializeDatabase(); // Assumes this is or can be made async
          await AsyncStorage.setItem("isDatabaseInitialized", "true");
        }

        // Check login status
        const loginStatus = await AsyncStorage.getItem("isLoggedIn");
        setIsLoggedIn(loginStatus === "true");
      } catch (error) {
        console.error("Error setting up app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setupApp();
  }, []);

  if (isLoading) {
    return;
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack screenOptions={{ headerTitleAlign: "center" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/Login" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/CustomerDetails"
            options={{ title: customerName || "Customer Details" }}
          />
          <Stack.Screen
            name="screens/WaskatDetails"
            options={{ title: customerName || "Customer Details" }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});
