import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const CustomBottomTabBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === "Home" && styles.activeTabItem]}
        onPress={() => setActiveTab("Home")}
      >
        <AntDesign
          name="home"
          size={24}
          color={activeTab === "Home" ? "#673ab7" : "#777"}
        />
        <Text
          style={[styles.tabText, activeTab === "Home" && styles.activeTabText]}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabItem,
          activeTab === "Add Customer" && styles.activeTabItem,
        ]}
        onPress={() => setActiveTab("Add Customer")}
      >
        <Ionicons
          name="person-add-outline"
          size={24}
          color={activeTab === "Add Customer" ? "#673ab7" : "#777"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "Add Customer" && styles.activeTabText,
          ]}
        >
          Add Customer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabItem,
          activeTab === "Settings" && styles.activeTabItem,
        ]}
        onPress={() => setActiveTab("Settings")}
      >
        <AntDesign
          name="setting"
          size={24}
          color={activeTab === "Settings" ? "#673ab7" : "#777"}
        />
        <Text
          style={[
            styles.tabText,
            activeTab === "Settings" && styles.activeTabText,
          ]}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    height: 60,
  },

  androidTabBar: {},

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  activeTabItem: {
    // backgroundColor: "#f0f0f0",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#777",
  },
  activeTabText: {
    color: "#673ab7",
  },
});

export default CustomBottomTabBar;
