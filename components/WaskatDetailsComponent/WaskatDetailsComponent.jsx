import {
  Modal,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Divider, IconButton } from "react-native-paper";
import UpdateWaskatModel from "../UpdateWaskatModel/UpdateWaskatModel";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import db, { deleteCustomer } from "../../Database";

const { width, height } = Dimensions.get("window");

const WaskatDetailsComponent = ({ visible, customer, onClose }) => {
  const [timeSinceRegistration, setTimeSinceRegistration] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    if (customer) {
      const currentDate = new Date();
      const registrationDate = new Date(customer.regestrationDate);

      const diffTime = Math.abs(currentDate - registrationDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffMonths = Math.floor(diffDays / 30);
      const diffYears = Math.floor(diffMonths / 12);

      let timeElapsed;
      if (diffYears > 0) {
        timeElapsed = `${
          registrationDate.toISOString().split("T")[0]
        } (${diffYears} year${diffYears > 1 ? "s" : ""} ago)`;
      } else if (diffMonths > 0) {
        timeElapsed = `${
          registrationDate.toISOString().split("T")[0]
        } (${diffMonths} month${diffMonths > 1 ? "s" : ""} ago)`;
      } else {
        timeElapsed = `${
          registrationDate.toISOString().split("T")[0]
        } (${diffDays} day${diffDays > 1 ? "s" : ""} ago)`;
      }

      setTimeSinceRegistration(timeElapsed);
    }
  }, [customer]);

  const handleUpdate = () => {
    setUpdateModalVisible(true);
  };

  const handleDelete = useCallback(() => {
    const { id } = customer;
    deleteCustomer({ id: id, table: "waskat" });
    ToastAndroid.show("Customer deleted successfully!", ToastAndroid.SHORT);
    onClose();
  });

  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {customer ? (
            <>
              <View style={styles.headerContainer}>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={onClose}
                  style={styles.closeButton}
                />
                <View style={styles.headerContent}>
                  <Text style={styles.modalTitle}>
                    قد اندام : {customer.name}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon="tshirt-crew"
                    size={28}
                    iconColor="#0083D0"
                    style={styles.waskatIcon}
                  />
                </View>
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
                  <DetailRow
                    label="شماره تلفن"
                    value={`${customer.phoneNumber}`}
                  />
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
                    value={`(${customer.yakhan}) (${customer.yakhanValue})`}
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
                  onPress={() => setConfirmationVisible(true)}
                  style={styles.updateButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor="#0083D0"
                  textColor="white"
                >
                  Update
                </Button>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={styles.closeModalButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  buttonColor="white"
                  textColor="black"
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

      <UpdateWaskatModel
        visible={updateModalVisible}
        customerData={customer}
        onClose={handleCloseUpdateModal}
      />
      <ConfirmationDialog
        visible={confirmationVisible}
        onCancel={() => setConfirmationVisible(false)}
        onConfirm={handleDelete}
      />
    </Modal>
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
  modalContainer: {
    flex: 1,
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#F2F5F3",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    left: 8,
    top: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 16,
    top: 8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  waskatIcon: {
    margin: 0,
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
    paddingVertical: 6,
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
    backgroundColor: "#F2F5F3",
  },
  updateButton: {
    flex: 1,
    marginRight: 8,
  },
  closeModalButton: {
    flex: 1,
    marginLeft: 8,
  },
  buttonContent: {
    height: 44,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
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

export default WaskatDetailsComponent;
