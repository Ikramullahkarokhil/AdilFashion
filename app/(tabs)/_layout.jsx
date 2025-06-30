import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ICONS = {
  index: { focused: "home", unfocused: "home-outline" },
  addCustomer: { focused: "person-add", unfocused: "person-add-outline" },
  settings: { focused: "settings", unfocused: "settings-outline" },
};

const _layout = () => {
  return (
    <>
      <Text style={styles.AppTitle}>
        <Text style={styles.AppTitle2}>0747826587</Text> / خیاطی عادل فیشن
      </Text>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            const iconSet = ICONS[route.name] || {};
            const iconName = focused ? iconSet.focused : iconSet.unfocused;
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0083D0",
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="addCustomer" options={{ title: "Add Customer" }} />
        <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      </Tabs>
    </>
  );
};

export default _layout;

const styles = StyleSheet.create({
  AppTitle: {
    textAlign: "center",
    fontSize: 24,
    paddingTop: 30,
    fontStyle: "italic",
    color: "#0083D0",
    backgroundColor: "white",
  },
  AppTitle2: {
    fontSize: 15,
    fontStyle: "italic",
  },
});
