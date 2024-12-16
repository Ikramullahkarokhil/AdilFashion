import React, { useState, useEffect } from "react";
import { Modal, View, StyleSheet, Text } from "react-native";
import { Button, Title, Divider, Checkbox } from "react-native-paper";
import UpdateCustomerModel from "../UpdateCustomerModel/UpdateCustomerModel";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";

const CustomerDetailsModal = ({ visible, customer, onClose }) => {
  const [jeebTunban, setJeebTunban] = useState(false);
  const [yakhanBinValue, setYakhanBinValue] = useState("");
  const [timeSinceRegistration, setTimeSinceRegistration] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    if (customer) {
      setJeebTunban(customer.jeebTunban === 1);
      if (customer.yakhanBin === 1) {
        setYakhanBinValue("بن دار ,");
      } else {
        setYakhanBinValue("");
      }
      const currentDate = new Date();
      const diffInDays = differenceInDays(
        currentDate,
        customer.regestrationDate
      );
      const diffInMonths = differenceInMonths(
        currentDate,
        customer.regestrationDate
      );
      const diffInYears = differenceInYears(
        currentDate,
        customer.regestrationDate
      );

      let timeElapsed;
      if (diffInYears > 0) {
        // Years
        timeElapsed =
          format(customer.regestrationDate, "yyyy-MM-dd") +
          " (" +
          diffInYears +
          " year" +
          (diffInYears > 1 ? "s" : "") +
          " ago)";
      } else if (diffInMonths > 0) {
        // Months
        timeElapsed =
          format(customer.regestrationDate, "yyyy-MM-dd") +
          " (" +
          diffInMonths +
          " month" +
          (diffInMonths > 1 ? "s" : "") +
          " ago)";
      } else {
        // Days
        timeElapsed =
          format(customer.regestrationDate, "yyyy-MM-dd") +
          " (" +
          diffInDays +
          " day" +
          (diffInDays > 1 ? "s" : "") +
          " ago)";
      }

      setTimeSinceRegistration(timeElapsed);
    }
  }, [customer]);

  const handleUpdate = () => {
    setUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {customer && (
            <>
              <Title style={styles.modalTitle}>
                قد اندام : {customer.name}
              </Title>
              <View style={styles.detailsContainer}>
                <DetailRow label="شماره مسلسل" value={customer.id} />
                <Divider />
                <DetailRow label="نام مشتری" value={customer.name} />
                <Divider />
                <DetailRow
                  label="شماره تلفن"
                  value={`${customer.phoneNumber}`}
                />
                <Divider />
                <DetailRow label="قد" value={customer.qad} />
                <Divider />
                <DetailRow label="بر دامن" value={customer.barDaman} />
                <Divider />
                <DetailRow label="بغل" value={customer.baghal} />
                <Divider />
                <DetailRow label="شانه" value={customer.shana} />
                <Divider />
                <DetailRow label="آستین" value={customer.astin} />
                <Divider />
                <DetailRow
                  label="تنبان"
                  value={`${customer.tunbanStyle} (${customer.tunban})`}
                />

                <Divider />
                <DetailRow label="پاچه" value={customer.pacha} />
                <Divider />

                <DetailRow
                  label="یخن"
                  value={`${yakhanBinValue} ${customer.yakhan} (${customer.yakhanValue})`}
                />

                <Divider />
                <DetailRow label="دامن" value={customer.daman} />
                <Divider />
                <DetailRow
                  label="نوع آستین"
                  value={`${customer.caff} (${customer.caffValue})`}
                />

                <Divider />
                <DetailRow label="جیب" value={customer.jeeb} />
                <Divider />

                <DetailRow
                  label="جیب تنبان"
                  value={
                    <Checkbox
                      status={jeebTunban ? "checked" : "unchecked"}
                      color="#0083D0"
                    />
                  }
                />
                <Divider />
                <DetailRow label="فرمایشات" value={customer.farmaish} />

                <Divider />

                <DetailRow
                  label="تاریخ ثبت نام"
                  value={timeSinceRegistration}
                />
                <Divider />
              </View>
              <View style={styles.confirmButtonContainer}>
                <Button
                  mode="contained"
                  onPress={handleUpdate}
                  style={{ width: "48%" }}
                >
                  Update
                </Button>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={{ width: "48%" }}
                >
                  Close
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
      {/* Confirmation dialog */}

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
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label} numberOfLines={null}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    maxWidth: "95%",
    width: "95%",
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },

  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    width: "40%",
    fontSize: 15,
  },
  valueContainer: {
    flex: 1,
    marginLeft: 10,
    alignItems: "flex-start",
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
  },
  confirmButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default CustomerDetailsModal;
