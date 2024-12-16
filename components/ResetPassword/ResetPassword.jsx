import React from "react";
import { View, Text, Modal, StyleSheet, ToastAndroid } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import db from "../../Database";
import * as Yup from "yup";

const DynamicInputField = ({
  label,
  name,
  handleChange,
  handleBlur,
  value,
  errors,
  keyboard,
}) => {
  const handleInputChange = (inputValue) => {
    handleChange(name)(inputValue);
  };

  return (
    <View style={styles.fieldContainer}>
      <TextInput
        label={label}
        onChangeText={handleInputChange}
        onBlur={handleBlur(name)}
        value={value}
        style={styles.input}
        error={errors[name] ? true : false}
        keyboardType={keyboard}
        multiline={true}
      />
    </View>
  );
};

const ResetPassword = ({ isVisible, onClose }) => {
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .required("Confirm new password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleResetPassword = (values, { resetForm, setFieldError }) => {
    const { currentPassword, newPassword } = values;
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM admin WHERE password = ?",
          [currentPassword],
          (_, { rows }) => {
            if (rows.length > 0) {
              tx.executeSql(
                "UPDATE admin SET password = ? WHERE password = ?",
                [newPassword, currentPassword],
                (_, { rowsAffected }) => {
                  if (rowsAffected > 0) {
                    ToastAndroid.show(
                      "Password changed successfully!",
                      ToastAndroid.SHORT
                    );
                    resetForm(); // Reset form values
                    onClose(); // Close the modal
                  } else {
                    console.log("Failed to update password");
                  }
                }
              );
            } else {
              setFieldError("currentPassword", "Incorrect password");
            }
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
      }
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Change Password</Text>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            onSubmit={handleResetPassword}
            validationSchema={validationSchema}
          >
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <DynamicInputField
                  label="Current Password"
                  name="currentPassword"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.currentPassword}
                  errors={errors}
                />
                {touched.currentPassword && errors.currentPassword && (
                  <Text style={styles.errorText}>{errors.currentPassword}</Text>
                )}
                <DynamicInputField
                  label="New Password"
                  name="newPassword"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.newPassword}
                  errors={errors}
                />
                {touched.newPassword && errors.newPassword && (
                  <Text style={styles.errorText}>{errors.newPassword}</Text>
                )}
                <DynamicInputField
                  label="Confirm Password"
                  name="confirmPassword"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.confirmPassword}
                  errors={errors}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="elevated"
                    buttonColor="white"
                    onPress={handleSubmit}
                  >
                    Change Password
                  </Button>
                  <Button mode="elevated" onPress={onClose}>
                    Cancel
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#F2F5F3",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "95%",
    maxWidth: "95%",
    elevation: 10,
  },
  formContainer: {
    width: "90%",
    maxWidth: "90%",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "white",
    borderColor: "black",
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default ResetPassword;
