import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ToastAndroid,
  Animated,
  TouchableOpacity,
  Share, // <-- Add Share import
} from "react-native";
import { Button, Divider, Checkbox, IconButton } from "react-native-paper";
import UpdateCustomerModel from "../../components/ui/UpdateCustomerModel";
import { deleteCustomer } from "../../database";
import ConfirmationDialog from "../../components/ui/ConfirmationDialog";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const CustomerDetailsModal = () => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { customer: customerParam } = useLocalSearchParams();

  let customer = customerParam;
  if (typeof customer === "string") {
    try {
      customer = JSON.parse(customer);
    } catch {
      customer = {};
    }
  }

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

  // Add share handler
  const handleShare = async () => {
    setMenuModalVisible(false);
    try {
      // Build a string with all customer fields, no icons
      const customerInfo = `
جزئیات کامل مشتری:

نام: ${customer.name || "—"}
شماره تلفن: ${customer.phoneNumber || "—"}
قد: ${customer.qad || "—"}
بر دامن: ${customer.barDaman || "—"}
بغل: ${customer.baghal || "—"}
شانه: ${customer.shana || "—"}
آستین: ${customer.astin || "—"}
تنبان: ${
        customer.tunbanStyle
          ? customer.tunban
            ? `${customer.tunbanStyle} (${customer.tunban})`
            : customer.tunbanStyle
          : customer.tunban || "—"
      }
پاچه: ${customer.pacha || "—"}
یخن: ${
        customerDetails.yakhanBinValue && customer.yakhan
          ? `${customerDetails.yakhanBinValue} ${customer.yakhan}${
              customer.yakhanValue ? ` (${customer.yakhanValue})` : ""
            }`
          : customer.yakhan || "—"
      }
دامن: ${customer.daman || "—"}
نوع آستین: ${
        customer.caff
          ? customer.caffValue
            ? `${customer.caff} (${customer.caffValue})`
            : customer.caff
          : customer.caffValue || "—"
      }
جیب: ${customer.jeeb || "—"}
جیب تنبان: ${customerDetails.jeebTunban ? "دارد" : "ندارد"}
فرمایشات: ${customer.farmaish || "—"}
تاریخ ثبت نام: ${customer.registrationDate || "—"}
`;
      await Share.share({
        title: `جزئیات مشتری: ${customer.name}`,
        message: customerInfo.trim(),
      });
    } catch (error) {
      console.error("Error sharing text:", error);
      ToastAndroid.show("خطا در اشتراک‌گذاری اطلاعات", ToastAndroid.SHORT);
    }
  };

  // Memoize expensive calculations
  const customerDetails = useMemo(() => {
    if (!customer) return null;

    // Treat jeebTunban and yakhanBin as true if 1, "1", true, or any non-falsy value
    const jeebTunban =
      customer.jeebTunban === 1 ||
      customer.jeebTunban === "1" ||
      customer.jeebTunban === true;
    const yakhanBinValue =
      customer.yakhanBin === 1 ||
      customer.yakhanBin === "1" ||
      customer.yakhanBin === true
        ? "بن دار ,"
        : "";

    // Calculate time since registration using native JavaScript Date
    const currentDate = new Date();
    const registrationDate = new Date(customer.registrationDate);
    const diffInTime = currentDate - registrationDate;
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30); // Approximation
    const diffInYears = Math.floor(diffInDays / 365);

    // Format date to yyyy-MM-dd
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let timeSinceRegistration;
    if (diffInYears > 0) {
      timeSinceRegistration = `${formatDate(
        registrationDate
      )} (${diffInYears} year${diffInYears > 1 ? "s" : ""} ago)`;
    } else if (diffInMonths > 0) {
      timeSinceRegistration = `${formatDate(
        registrationDate
      )} (${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago)`;
    } else {
      timeSinceRegistration = `${formatDate(
        registrationDate
      )} (${diffInDays} day${diffInDays > 1 ? "s" : ""} ago)`;
    }

    return {
      jeebTunban,
      yakhanBinValue,
      timeSinceRegistration,
    };
  }, [customer]);

  if (!customer || !customerDetails) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Text style={{ color: "#888", fontSize: 18 }}>
          No customer data available.
        </Text>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          Back
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              bounces={true}
              alwaysBounceVertical={true}
            >
              <View style={styles.detailsContainer}>
                <DetailRow label="نام مشتری" value={customer.name} />
                <Divider style={styles.divider} />
                <DetailRow label="شماره تلفن" value={customer.phoneNumber} />
                <Divider style={styles.divider} />
                <DetailRow label="قد" value={customer.qad} />
                <Divider style={styles.divider} />
                <DetailRow label="بر دامن" value={customer.barDaman} />
                <Divider style={styles.divider} />
                <DetailRow label="بغل" value={customer.baghal} />
                <Divider style={styles.divider} />
                <DetailRow label="شانه" value={customer.shana} />
                <Divider style={styles.divider} />
                <DetailRow label="آستین" value={customer.astin} />
                <Divider style={styles.divider} />
                <DetailRow
                  label="تنبان"
                  value={
                    customer.tunbanStyle
                      ? customer.tunban
                        ? `${customer.tunbanStyle} (${customer.tunban})`
                        : customer.tunbanStyle
                      : customer.tunban || ""
                  }
                />
                <Divider style={styles.divider} />
                <DetailRow label="پاچه" value={customer.pacha} />
                <Divider style={styles.divider} />
                <DetailRow
                  label="یخن"
                  value={
                    customerDetails.yakhanBinValue && customer.yakhan
                      ? `${customerDetails.yakhanBinValue} ${customer.yakhan}${
                          customer.yakhanValue
                            ? ` (${customer.yakhanValue})`
                            : ""
                        }`
                      : customer.yakhan || ""
                  }
                />
                <Divider style={styles.divider} />
                <DetailRow label="دامن" value={customer.daman} />
                <Divider style={styles.divider} />
                <DetailRow
                  label="نوع آستین"
                  value={
                    customer.caff
                      ? customer.caffValue
                        ? `${customer.caff} (${customer.caffValue})`
                        : customer.caff
                      : customer.caffValue || ""
                  }
                />
                <Divider style={styles.divider} />
                <DetailRow label="جیب" value={customer.jeeb} />
                <Divider style={styles.divider} />
                <DetailRow
                  label="جیب تنبان"
                  value={
                    <Checkbox
                      status={
                        customerDetails.jeebTunban ? "checked" : "unchecked"
                      }
                      color="#0083D0"
                    />
                  }
                />
                <Divider style={styles.divider} />
                <DetailRow label="فرمایشات" value={customer.farmaish} />
                <Divider style={styles.divider} />
                <DetailRow
                  label="تاریخ ثبت نام"
                  value={customerDetails.timeSinceRegistration}
                />
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
                style={styles.closeModalButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                buttonColor="white"
                textColor="black"
                onPress={() => {
                  router.back();
                }}
              >
                Back
              </Button>
            </View>
          </>
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
              {/* Share option */}
              <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
                <IconButton
                  icon="share"
                  size={24}
                  iconColor="#4CAF50"
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuItemText, { color: "#4CAF50" }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <UpdateCustomerModel
        visible={updateModalVisible}
        customerData={customer}
        onClose={() => setUpdateModalVisible(false)}
      />
      <ConfirmationDialog
        visible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        onConfirm={() => {
          deleteCustomer({ id: customer.id, table: "customer" });

          setConfirmationVisible(false);
          router.back();
          ToastAndroid.show(
            "Customer deleted successfully!",
            ToastAndroid.SHORT
          );
        }}
      />
    </View>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.valueContainer}>
      {typeof value === "string" || typeof value === "number" ? (
        <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
    <Text style={styles.label} numberOfLines={2}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  modalContent: { flex: 1, backgroundColor: "white", width, height },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#F2F5F3",
  },
  closeButton: { position: "absolute", left: 8, top: 8 },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
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
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "white",
    paddingBottom: 24,
    paddingTop: 8,
    elevation: 20,
  },
  updateButton: { flex: 1, marginRight: 8 },
  closeModalButton: { flex: 1, marginLeft: 8 },
  buttonContent: { height: 44 },
  buttonLabel: { fontSize: 16, fontWeight: "bold" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 16, fontSize: 16, color: "#555" },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
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

export default React.memo(CustomerDetailsModal);
