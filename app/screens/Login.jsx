import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { login } from "../../database";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const LoginSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const inputPassword = values.password;

      const admin = await login();
      if (!admin) {
        setIsPasswordIncorrect(true);
        return;
      }

      const storedPassword = admin.password;

      if (inputPassword === storedPassword) {
        await AsyncStorage.setItem("isLoggedIn", "true");
        router.replace("/(tabs)");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Please enter your password to continue
          </Text>

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
              <View style={styles.formContent}>
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
                    setIsPasswordIncorrect(false);
                  }}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Enter your password"
                  secureTextEntry
                  mode="outlined"
                  outlineColor="#0083D0"
                  activeOutlineColor="#0083D0"
                  error={
                    isPasswordIncorrect || (touched.password && errors.password)
                  }
                  left={<TextInput.Icon icon="lock" color="#6C757D" />}
                  theme={{ roundness: 16 }}
                />
                {touched.password && errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                {isPasswordIncorrect && (
                  <Text style={styles.error}>
                    Incorrect password. Please try again.
                  </Text>
                )}
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: width * 0.9,
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#212529",
  },
  subtitle: {
    fontSize: 16,
    color: "#6C757D",
    marginBottom: 24,
    textAlign: "center",
  },
  formContent: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 16,
  },
  inputError: {
    borderColor: "#DC3545",
  },
  error: {
    color: "#DC3545",
    fontSize: 14,
    marginBottom: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A0C4F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Login;
