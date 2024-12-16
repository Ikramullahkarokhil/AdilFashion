import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import { StatusBar } from "expo-status-bar";
import * as yup from "yup";
import { executeSql } from "../../Database";
import { TextInput } from "react-native-paper";
import * as NavigationBar from "expo-navigation-bar";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
});

const LoginPage = ({ onLogin }) => {
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isFingerprintPromptVisible, setIsFingerprintPromptVisible] = useState(false);
  NavigationBar.setBackgroundColorAsync("#F2F5F3");

  useEffect(() => {
    const checkFingerprint = async () => {
      const isFingerprintEnabled = await AsyncStorage.getItem("isFingerprintEnabled") === 'true';
      if (isFingerprintEnabled) {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          setIsFingerprintPromptVisible(true);
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate',
          });

          if (result.success) {
            onLogin(true);
            return;
          }
        }
      }
      setShowPasswordInput(true);
    };

    checkFingerprint();
  }, []);

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const inputPassword = values.password;

      const admin = await executeSql("SELECT * FROM admin WHERE id = 1;");
      if (!admin || !admin.rows.length) {
        setIsPasswordIncorrect(true);
        return;
      }

      const storedPassword = admin.rows.item(0).password;

      if (inputPassword === storedPassword) {
        onLogin(true);
      } else {
        setIsPasswordIncorrect(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFingerprint = () => {
    setIsFingerprintPromptVisible(false);
    setShowPasswordInput(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#F2F5F3" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Adil Fashion</Text>
        {showPasswordInput ? (
          <Formik
            initialValues={{ password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => handleLogin(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <TextInput
                  style={[
                    styles.input,
                    touched.password && errors.password
                      ? styles.inputError
                      : null,
                    isPasswordIncorrect ? styles.inputError : null,
                  ]}
                  onChangeText={(text) => {
                    handleChange("password")(text);
                  }}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Password"
                  secureTextEntry
                  error={
                    isPasswordIncorrect
                      ? "Password is incorrect!"
                      : errors.password
                  }
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                {isPasswordIncorrect && (
                  <Text style={styles.error}>Password is incorrect!</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        ) : (
          <View>
            <Text>Checking fingerprint...</Text>
            <TouchableOpacity onPress={handleCancelFingerprint}>
              <Text style={styles.usePasswordText}>Cancel Fingerprint</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F5F3",
    width: "100%",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    maxWidth: 400,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  usePasswordText: {
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default LoginPage;
