import React from "react";
import { View, Modal, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";

const ConfirmationDialog = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.confirmModalContainer}>
        <View style={styles.confirmModalContent}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text>Are you sure you want to delete this customer?</Text>
          <View style={styles.confirmButtonContainer}>
            <Button mode="outlined" onPress={onCancel}>
              Cancel
            </Button>
            <Button mode="contained" onPress={onConfirm}>
              Confirm
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  confirmModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  confirmButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ConfirmationDialog;
