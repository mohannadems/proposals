import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  verifyOTP,
  resendOTP,
  setTempEmail,
} from "../../store/slices/auth.slice";
import OTPTextInput from "react-native-otp-textinput";
import { useRoute } from "@react-navigation/native";

export default function VerifyOTPScreen() {
  const dispatch = useDispatch();
  const { tempEmail, loading, error } = useSelector((state) => state.auth);
  const route = useRoute();
  const [otp, setOTP] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const routeEmail = route.params?.email;
    if (routeEmail) {
      dispatch(setTempEmail(routeEmail));
    }
  }, [route.params?.email, dispatch]);

  // Automatically verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerify();
    }
  }, [otp, loading]);

  const handleVerify = async () => {
    setValidationError("");

    if (!otp || otp.length !== 6) {
      setValidationError("Please enter a valid 6-digit code");
      return;
    }

    if (!tempEmail) {
      setValidationError(
        "Email address is missing. Please try registering again."
      );
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({ email: tempEmail, otp })
      ).unwrap();
      console.log("Verification result:", result);

      if (result.success) {
        router.replace("/(tabs)/home");
      } else {
        setValidationError(result.message || "Verification failed");
      }
    } catch (error) {
      console.log("Verification error:", error);
      setValidationError(error.message || "Verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (!tempEmail) {
      setValidationError(
        "Email address is missing. Please try registering again."
      );
      return;
    }

    try {
      const result = await dispatch(resendOTP(tempEmail)).unwrap();
      Alert.alert(
        "OTP Resent",
        result.message || "A new code has been sent to your email"
      );
    } catch (error) {
      Alert.alert("Resend Failed", error.message || "Could not resend OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialIcons name="verified" size={60} color="#B65165" />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {tempEmail}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        <OTPTextInput
          handleTextChange={setOTP}
          inputCount={6}
          tintColor="#B65165"
          offTintColor={validationError ? "#FF3B30" : "#E5E5EA"}
          textInputStyle={[
            styles.otpInput,
            validationError && styles.otpInputError,
          ]}
          containerStyle={styles.otpInputContainer}
        />

        {(validationError || error) && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={16} color="#FF3B30" />
            <Text style={styles.errorText}>{validationError || error}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResendOTP}
        disabled={loading}
      >
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <Text style={styles.resendLink}>Resend Code</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  otpContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  otpInputContainer: {
    marginBottom: 16,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    backgroundColor: "#fff",
  },
  otpInputError: {
    borderColor: "#FF3B30",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontSize: 14,
  },
  verifyButton: {
    height: 56,
    backgroundColor: "#B65165",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    color: "#666",
    marginBottom: 4,
  },
  resendLink: {
    color: "#B65165",
    fontWeight: "600",
  },
});
