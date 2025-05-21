import React, { useState, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Button,
  Title,
  Divider,
  Checkbox,
  IconButton,
} from "react-native-paper";
import UpdateCustomerModel from "../UpdateCustomerModel/UpdateCustomerModel";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";

const { width, height } = Dimensions.get("window");

const CustomerDetailsModal = ({
  visible,
  customer,
  onClose,
  isLoading = false,
}) => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // Memoize expensive calculations to improve performance
  const customerDetails = useMemo(() => {
    if (!customer) return null;

    const jeebTunban = customer.jeebTunban === 1;
    const yakhanBinValue = customer.yakhanBin === 1 ? "بن دار ," : "";

    // Calculate time since registration once
    const currentDate = new Date();
    const registrationDate = new Date(customer.regestrationDate);
    const diffInDays = differenceInDays(currentDate, registrationDate);
    const diffInMonths = differenceInMonths(currentDate, registrationDate);
    const diffInYears = differenceInYears(currentDate, registrationDate);

    let timeSinceRegistration;
    if (diffInYears > 0) {
      timeSinceRegistration = `${format(
        registrationDate,
        "yyyy-MM-dd"
      )} (${diffInYears} year${diffInYears > 1 ? "s" : ""} ago)`;
    } else if (diffInMonths > 0) {
      timeSinceRegistration = `${format(
        registrationDate,
        "yyyy-MM-dd"
      )} (${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago)`;
    } else {
      timeSinceRegistration = `${format(
        registrationDate,
        "yyyy-MM-dd"
      )} (${diffInDays} day${diffInDays > 1 ? "s" : ""} ago)`;
    }

    return {
      jeebTunban,
      yakhanBinValue,
      timeSinceRegistration,
    };
  }, [customer]);

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handleUpdate = useCallback(() => {
    setUpdateModalVisible(true);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setUpdateModalVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0083D0" />
              <Text style={styles.loadingText}>
                Loading customer details...
              </Text>
            </View>
          ) : customer && customerDetails ? (
            <>
              <View style={styles.headerContainer}>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onClose}
                  style={styles.closeButton}
                />
                <Title style={styles.modalTitle}>
                  قد اندام : {customer.name}
                </Title>
              </View>

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
                    value={`${customer.tunbanStyle} (${customer.tunban})`}
                  />
                  <Divider style={styles.divider} />
                  <DetailRow label="پاچه" value={customer.pacha} />
                  <Divider style={styles.divider} />
                  <DetailRow
                    label="یخن"
                    value={`${customerDetails.yakhanBinValue} ${customer.yakhan} (${customer.yakhanValue})`}
                  />
                  <Divider style={styles.divider} />
                  <DetailRow label="دامن" value={customer.daman} />
                  <Divider style={styles.divider} />
                  <DetailRow
                    label="نوع آستین"
                    value={`${customer.caff} (${customer.caffValue})`}
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
                        disabled
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
                  onPress={handleUpdate}
                  style={styles.updateButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Update
                </Button>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={styles.closeModalButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  Close
                </Button>
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No customer data available</Text>
              <Button
                mode="contained"
                onPress={onClose}
                style={styles.errorButton}
              >
                Close
              </Button>
            </View>
          )}
        </View>
      </View>

      <UpdateCustomerModel
        visible={updateModalVisible}
        customerData={customer}
        onClose={handleCloseUpdateModal}
      />
    </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    width: width,
    height: height,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  closeButton: {
    position: "absolute",
    left: 8,
    top: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    width: "100%",
  },
  divider: {
    marginVertical: 4,
  },
  label: {
    fontWeight: "700",
    fontSize: 16,
    textAlign: "right",
    color: "#555",
    width: "40%",
    paddingLeft: 8,
  },
  valueContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#f9f9f9",
  },
  updateButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#0083D0",
  },
  closeModalButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: "#0083D0",
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: "#555",
  },
  errorButton: {
    marginTop: 16,
    backgroundColor: "#0083D0",
  },
});

export default React.memo(CustomerDetailsModal);
