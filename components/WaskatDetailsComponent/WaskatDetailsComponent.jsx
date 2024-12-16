import { Modal, View, StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Title, Divider } from "react-native-paper";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";
import UpdateWaskatModel from "../UpdateWaskatModel/UpdateWaskatModel";

const WaskatDetailsComponent = ({ visible, customer, onClose }) => {
  const [timeSinceRegistration, setTimeSinceRegistration] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    // Update jeebTunban state and calculate time since registration
    if (customer) {
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
              <View style={styles.modalSubTitleContainer}>
                <Text style={styles.modalSubTitle}>واسکت</Text>
              </View>
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
                <DetailRow label="بغل" value={customer.baghal} />

                <Divider />
                <DetailRow label="کمر" value={customer.kamar} />
                <Divider />

                <DetailRow label="شانه" value={customer.shana} />
                <Divider />
                <DetailRow label="استین" value={customer.soreen} />
                <Divider />

                <DetailRow
                  label="نوع یخن"
                  value={`(${customer.yakhan}) (${customer.yakhanValue})`}
                />
                <Divider />
                <DetailRow label="سورین" value={customer.soreen} />
                <Divider />

                <DetailRow label="تاریخ ثبت" value={timeSinceRegistration} />
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

      <UpdateWaskatModel
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
    maxWidth: "95%", // Set a maximum width
    width: "95%", // Set a fixed width if needed
  },
  modalTitle: {
    fontSize: 20,
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
    alignItems: "flex-start", // Align the value to the start of the container
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
  modalSubTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubTitle: {
    fontSize: 20,
    color: "red",
  },
});

export default WaskatDetailsComponent;
