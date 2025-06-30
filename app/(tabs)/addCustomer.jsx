import React, { useState } from "react";
import { SafeAreaView, StyleSheet, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AddCustomer from "../../components/ui/AddCustomer";
import Waskat from "../../components/ui/Waskat";

const AddPage = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "addCustomer", title: "کالا" },
    { key: "waskat", title: "واسکت" },
  ]);

  const renderScene = SceneMap({
    addCustomer: AddCustomer,
    waskat: Waskat,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      inactiveColor="black"
      activeColor="rgb(20, 123, 182)"
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        lazy={true}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F3",
  },
  tabBar: {
    backgroundColor: "white",
  },
  tabLabel: {
    color: "red",
  },
  indicator: {
    backgroundColor: "#0083D0",
  },
});

export default AddPage;
