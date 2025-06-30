import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ToastAndroid,
  Animated,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import { changePassword } from "../../database";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DynamicInputField = ({
  label,
  name,
  handleChange,
  handleBlur,
  value,
  errors,

  secureTextEntry,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleInputChange = (inputValue) => {
    handleChange(name)(inputValue);
  };

  return (
    <View style={styles.fieldContainer}>
      <TextInput
        label={label}
        onChangeText={handleInputChange}
        onBlur={() => {
          handleBlur(name);
          setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        value={value}
        style={[styles.input, errors[name] && styles.inputError]}
        error={errors[name] ? true : false}
        keyboardType="default"
        secureTextEntry={secureTextEntry}
        outlineColor="#ccc"
        textColor="black"
        cursorColor="#0083D0"
        underlineColor="#0083D0"
        activeUnderlineColor="#0083D0"
        placeholderTextColor="#0083D0"
        activeOutlineColor="#0083D0"
      />
    </View>
  );
};

const ResetPassword = ({ isVisible, onClose }) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isVisible]);

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .required("Confirm new password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleResetPassword = async (values, { resetForm, setFieldError }) => {
    const { currentPassword, newPassword } = values;

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        ToastAndroid.show("Password changed successfully!", ToastAndroid.SHORT);
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      if (error.message === "Current password is incorrect") {
        setFieldError("currentPassword", "Incorrect password");
      } else {
        ToastAndroid.show(
          "Failed to change password. Please try again.",
          ToastAndroid.SHORT
        );
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              name="lock-reset"
              size={32}
              color="#0083D0"
            />
            <Text style={styles.modalText}>Change Password</Text>
          </View>
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
              isSubmitting,
            }) => (
              <View style={styles.formContainer}>
                <DynamicInputField
                  label="Current Password"
                  name="currentPassword"
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  value={values.currentPassword}
                  errors={errors}
                  secureTextEntry={true}
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
                  secureTextEntry={true}
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
                  secureTextEntry={true}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isSubmitting}
                    style={styles.submitButton}
                    contentStyle={styles.buttonContent}
                    buttonColor="#0083D0"
                    textColor="white"
                  >
                    Change Password
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={onClose}
                    style={styles.cancelButton}
                    contentStyle={styles.buttonContent}
                    buttonColor="white"
                    textColor="black"
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  formContainer: {
    width: "100%",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  fieldContainer: {
    marginBottom: 16,
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 10,
  },

  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  submitButton: {
    width: "100%",
    borderRadius: 10,
    elevation: 2,
  },
  cancelButton: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ResetPassword;
