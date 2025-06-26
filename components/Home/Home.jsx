import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  RefreshControl,
  ToastAndroid,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Searchbar, Card, IconButton } from "react-native-paper";
import CustomerDetailsModal from "../CustomerDetailsModal/CustomerDetailsModal";
import SelectDropdown from "react-native-select-dropdown";
import WaskatDetailsComponent from "../WaskatDetailsComponent/WaskatDetailsComponent";
import useStore from "../../store";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";

const Home = () => {
  const {
    searchQuery,
    data,
    selectedOption,
    totalRecords,
    setSearchQuery,
    setSelectedOption,
    fetchData,
    fetchTotalRecords,
    resetStore,
  } = useStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTopOpacity = useRef(new Animated.Value(0)).current;
  const SCROLL_THRESHOLD = 500;

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchData(selectedOption, searchQuery),
          fetchTotalRecords(selectedOption),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        ToastAndroid.show("Failed to load data", ToastAndroid.SHORT);
      }
    };

    loadData();
  }, []);

  // Handle search and option changes
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchData(selectedOption, searchQuery),
          fetchTotalRecords(selectedOption),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
        ToastAndroid.show("Failed to load data", ToastAndroid.SHORT);
      }
    };

    loadData();
  }, [searchQuery, selectedOption]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchData(selectedOption, searchQuery),
        fetchTotalRecords(selectedOption),
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
      ToastAndroid.show("Failed to refresh data", ToastAndroid.SHORT);
    } finally {
      setRefreshing(false);
    }
  }, [selectedOption, searchQuery]);

  const handleOptionChange = (option) => {
    const englishTableName = optionMapping[option];
    setSelectedOption(englishTableName);
  };

  const handleScroll = useCallback(
    (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const isScrollingUpNow = currentScrollY < lastScrollY;
      setLastScrollY(currentScrollY);

      const shouldShowButton =
        currentScrollY > SCROLL_THRESHOLD && isScrollingUpNow;

      if (shouldShowButton !== showScrollTop) {
        setShowScrollTop(shouldShowButton);
        Animated.timing(scrollTopOpacity, {
          toValue: shouldShowButton ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    },
    [lastScrollY, showScrollTop]
  );

  const goToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    setShowScrollTop(false);
    Animated.timing(scrollTopOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleDetails = (item) => {
    setSelectedCustomer(item);
    setModalVisible(true);
  };

  const optionMapping = {
    کالا: "customer",
    واسکت: "waskat",
  };

  // Reset store when component unmounts
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  const ListItem = React.memo(({ item, onPressDetails }) => {
    return (
      <Card
        style={styles.card}
        mode="elevated"
        elevation={3}
        onPress={() => onPressDetails(item)}
      >
        <View style={styles.cardDirection}>
          <View style={styles.cardContent}>
            <Card.Content>
              <View style={styles.contentRow}>
                <Text style={styles.title}>{item.name}</Text>
                <Ionicons name="person" size={16} color="#0083D0" />
              </View>
              {item.phoneNumber && (
                <View style={styles.contentRow}>
                  <Text style={styles.subContent}>{item.phoneNumber}</Text>
                  <Ionicons name="call" size={16} color="#0083D0" />
                </View>
              )}
              <View style={styles.contentRow}>
                <Text style={styles.subContent}>{item.regestrationDate}</Text>
                <Ionicons name="calendar" size={16} color="#0083D0" />
              </View>
            </Card.Content>
          </View>
        </View>
      </Card>
    );
  });

  const renderItem = useCallback(
    ({ item }) => <ListItem item={item} onPressDetails={handleDetails} />,
    []
  );

  const renderListHeader = useCallback(
    () => (
      <View style={styles.totalRecords}>
        <Text>Total Number of records {totalRecords}</Text>
      </View>
    ),
    [totalRecords]
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          style={styles.searchbar}
          elevation={1}
        />
        <SelectDropdown
          data={["کالا", "واسکت"]}
          onSelect={(selectedItem) =>
            handleOptionChange(selectedItem.toLowerCase())
          }
          defaultButtonText={"کالا"}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
          dropdownStyle={styles.dropdown}
          dropdownTextStyle={styles.dropdownItemText}
        />
      </View>

      <FlashList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={renderListHeader}
        estimatedItemSize={139}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <Animated.View
        style={[
          styles.goToTopButton,
          {
            opacity: scrollTopOpacity,
            transform: [
              {
                translateY: scrollTopOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={goToTop}>
          <IconButton icon="arrow-up" iconColor="white" />
        </TouchableOpacity>
      </Animated.View>

      {modalVisible && selectedOption === "customer" && (
        <CustomerDetailsModal
          visible={modalVisible}
          customer={selectedCustomer}
          onClose={() => setModalVisible(false)}
        />
      )}

      {modalVisible && selectedOption === "waskat" && (
        <WaskatDetailsComponent
          visible={modalVisible}
          customer={selectedCustomer}
          onClose={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F5F3",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginHorizontal: 10,
  },
  searchbar: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 15,
    marginTop: 5,
  },
  dropdownButton: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    width: 100,
    height: 55,
    elevation: 3,
    marginTop: 5,
  },
  dropdownButtonText: {
    color: "#333",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  dropdownItemText: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: "#333",
  },
  card: {
    marginVertical: 10,
    borderRadius: 16,
    marginHorizontal: 10,
    backgroundColor: "white",
    justifyContent: "center",
  },
  cardDirection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcons: {
    flexDirection: "column",
    paddingLeft: 8,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 8,
    alignItems: "flex-end",
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 4,
    width: "100%",
  },
  title: {
    fontSize: 18,
    color: "black",
    fontWeight: "500",
    marginRight: 8,
  },
  subContent: {
    color: "black",
    fontWeight: "300",
    marginRight: 8,
  },
  totalRecords: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  goToTopButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0083D0",
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Home;
