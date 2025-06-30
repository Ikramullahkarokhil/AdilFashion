import React from "react";
import { View, Modal, StyleSheet, Text, Animated } from "react-native";
import { Button } from "react-native-paper";

const ConfirmationDialog = ({ visible, onCancel, onConfirm }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.confirmModalContainer}>
        <Animated.View
          style={[
            styles.confirmModalContent,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.modalTitle}>Delete Customer</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </Text>
          <View style={styles.confirmButtonContainer}>
            <Button
              mode="outlined"
              onPress={onCancel}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              buttonColor="white"
              textColor="black"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
              buttonColor="#dc3545"
              textColor="white"
            >
              Delete
            </Button>
          </View>
        </Animated.View>
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
    padding: 20,
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  confirmButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1a1a1a",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  confirmButton: {
    borderColor: "#dc3545",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonContent: {
    height: 48,
  },
});

export default ConfirmationDialog;
