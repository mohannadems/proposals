import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP } from "../../store/slices/auth.slice";
import { COLORS } from "../../constants/colors";
import { router } from "expo-router";
import OTPTextInput from "react-native-otp-textinput";

const VerifyOTPScreen = () => {
  const [otp, setOTP] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const email = useSelector((state) => state.auth.tempEmail);

  const handleVerify = async () => {
    if (otp.length === 6) {
      const result = await dispatch(verifyOTP({ email, otp }));
      if (!result.error) {
        router.replace("/(tabs)/home");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Please enter the verification code sent to your email
      </Text>

      <OTPTextInput
        handleTextChange={setOTP}
        inputCount={6}
        tintColor={COLORS.primary}
        offTintColor={COLORS.border}
        textInputStyle={styles.otpCell}
        containerStyle={styles.otpContainer}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: COLORS.text,
    opacity: 0.7,
  },
  otpContainer: {
    marginBottom: 20,
  },
  otpCell: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 24,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 10,
  },
  resendButton: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    color: COLORS.primary,
    fontSize: 14,
  },
});

export default VerifyOTPScreen;
