import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ToastAndroid,
  TouchableOpacity,
  Share,
  Animated,
} from "react-native";
import { Button, Divider, IconButton } from "react-native-paper";
import UpdateWaskatModel from "../../components/ui/UpdateWaskatModel";
import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import { deleteCustomer } from "../../database";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const WaskatDetails = () => {
  const [timeSinceRegistration, setTimeSinceRegistration] = React.useState("");
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [confirmationVisible, setConfirmationVisible] = React.useState(false);
  const [menuModalVisible, setMenuModalVisible] = React.useState(false);
  const { waskat: customerParam } = useLocalSearchParams();

  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  let customer = customerParam;
  if (typeof customer === "string") {
    try {
      customer = JSON.parse(customer);
    } catch {
      customer = {};
    }
  }

  useEffect(() => {
    if (customer) {
      const registrationDate = new Date(customer.registrationDate);
      const diffDays = Math.floor(
        (Date.now() - registrationDate) / (1000 * 60 * 60 * 24)
      );
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffMonths / 12);

      const dateStr = registrationDate.toISOString().split("T")[0];
      let timeElapsed = `${dateStr} (${
        diffYears > 0
          ? `${diffYears} year${diffYears > 1 ? "s" : ""}`
          : diffMonths > 0
          ? `${diffMonths} month${diffMonths > 1 ? "s" : ""}`
          : `${diffDays} day${diffDays > 1 ? "s" : ""}`
      } ago)`;

      setTimeSinceRegistration(timeElapsed);
    }
  }, [customer]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: menuModalVisible ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [menuModalVisible, scaleAnim]);

  const handleMenuOpen = () => setMenuModalVisible(true);
  const handleMenuClose = () => setMenuModalVisible(false);
  const handleUpdate = () => {
    setMenuModalVisible(false);
    setUpdateModalVisible(true);
  };
  const handleDelete = () => {
    setMenuModalVisible(false);
    setConfirmationVisible(true);
  };

  const handleShare = async () => {
    setMenuModalVisible(false);
    try {
      // Enhanced share content with branding and better formatting
      let shareTitle = `خیاطی عادل فیشن`;
      let customerInfo = `${shareTitle}\n`;
      customerInfo += `• نام مشتری: ${customer.name || "—"}\n`;
      customerInfo += `• شماره تلفن: ${customer.phoneNumber || "—"}\n`;
      customerInfo += `• قد: ${customer.qad || "—"}\n`;
      customerInfo += `• بغل: ${customer.baghal || "—"}\n`;
      customerInfo += `• کمر: ${customer.kamar || "—"}\n`;
      customerInfo += `• شانه: ${customer.shana || "—"}\n`;
      customerInfo += `• استین: ${customer.soreen || "—"}\n`;
      customerInfo += `• نوع یخن: ${
        customer?.yakhan || customer?.yakhanValue
          ? `${customer?.yakhan ? `(${customer.yakhan})` : ""} ${
              customer?.yakhanValue ? `(${customer.yakhanValue})` : ""
            }`.trim()
          : "—"
      }\n`;
      customerInfo += `• فرمایشات: ${customer.farmaish || "—"}\n`;
      customerInfo += `• تاریخ ثبت: ${customer.registrationDate || "—"}\n`;
      await Share.share({
        title: `جزئیات واسکت: ${customer.name}`,
        message: customerInfo.trim(),
      });
    } catch (error) {
      console.error("Error sharing text:", error);
      ToastAndroid.show("خطا در اشتراک‌گذاری اطلاعات", ToastAndroid.SHORT);
    }
  };

  const handleDeleteConfirm = () => {
    deleteCustomer({ id: customer.id, table: "waskat" });
    setConfirmationVisible(false);
    router.back();
    ToastAndroid.show("Customer deleted successfully!", ToastAndroid.SHORT);
  };

  if (!customer) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No customer data available</Text>
              <Button
                mode="contained"
                onPress={() => router.back()}
                style={styles.errorButton}
              >
                Close
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.detailsContainer}>
              <DetailRow label="نام مشتری" value={customer.name} />
              <Divider style={styles.divider} />
              <DetailRow label="شماره تلفن" value={`${customer.phoneNumber}`} />
              <Divider style={styles.divider} />
              <DetailRow label="قد" value={customer.qad} />
              <Divider style={styles.divider} />
              <DetailRow label="بغل" value={customer.baghal} />
              <Divider style={styles.divider} />
              <DetailRow label="کمر" value={customer.kamar} />
              <Divider style={styles.divider} />
              <DetailRow label="شانه" value={customer.shana} />
              <Divider style={styles.divider} />
              <DetailRow label="استین" value={customer.soreen} />
              <Divider style={styles.divider} />
              <DetailRow
                label="نوع یخن"
                value={
                  customer?.yakhan || customer?.yakhanValue
                    ? `${customer?.yakhan ? `(${customer.yakhan})` : ""} ${
                        customer?.yakhanValue ? `(${customer.yakhanValue})` : ""
                      }`.trim()
                    : "—"
                }
              />

              <Divider style={styles.divider} />
              <DetailRow label="سورین" value={customer.soreen} />
              <Divider style={styles.divider} />
              <DetailRow label="فرمایشات" value={customer.farmaish} />
              <Divider style={styles.divider} />
              <DetailRow label="تاریخ ثبت" value={timeSinceRegistration} />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleMenuOpen}
              style={styles.updateButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor="#0083D0"
              textColor="white"
            >
              Actions
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.closeModalButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor="white"
              textColor="black"
            >
              Back
            </Button>
          </View>
        </View>
      </View>

      <Modal
        visible={menuModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleMenuClose}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={handleMenuClose}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.menuItem} onPress={handleUpdate}>
                <IconButton
                  icon="pencil"
                  size={24}
                  iconColor="#0083D0"
                  style={styles.menuIcon}
                />
                <Text style={styles.menuItemText}>Update</Text>
              </TouchableOpacity>
              <Divider style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                <IconButton
                  icon="delete"
                  size={24}
                  iconColor="#FF5252"
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuItemText, { color: "#FF5252" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
              <Divider style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <IconButton
                  icon="share-variant"
                  size={24}
                  iconColor="#2196F3"
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuItemText, { color: "#2196F3" }]}>
                  Share Waskat
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <UpdateWaskatModel
        visible={updateModalVisible}
        customerData={customer}
        onClose={() => setUpdateModalVisible(false)}
      />
      <ConfirmationDialog
        visible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.valueContainer}>
      <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
        {value}
      </Text>
    </View>
    <Text style={styles.label} numberOfLines={2}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    width,
    height,
  },

  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 20 },
  detailsContainer: { padding: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    width: "100%",
  },
  divider: { marginVertical: 4 },
  label: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "right",
    color: "#555",
    width: "40%",
    paddingLeft: 8,
  },
  valueContainer: { flex: 1, alignItems: "flex-start" },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    elevation: 20,
  },
  updateButton: { flex: 1, marginRight: 8 },
  closeModalButton: { flex: 1, marginLeft: 8 },
  buttonContent: { height: 44 },
  buttonLabel: { fontSize: 16, fontWeight: "bold" },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: { marginBottom: 16, fontSize: 16, color: "#555" },
  errorButton: { marginTop: 16, backgroundColor: "#0083D0" },
  menuOverlay: { flex: 1 },
  menuContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    width: width * 0.6,
    maxWidth: 300,
  },
  menuContent: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 56,
  },
  menuIcon: { margin: 0, marginRight: 12 },
  menuItemText: { fontSize: 16, fontWeight: "500", color: "#333", flex: 1 },
  menuDivider: { marginHorizontal: 20 },
});

export default WaskatDetails;
