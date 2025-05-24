import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  I18nManager,
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
import * as Haptics from "expo-haptics";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function VerifyOTPScreen() {
  const dispatch = useDispatch();
  const { tempEmail, loading, error } = useSelector((state) => state.auth);
  const route = useRoute();
  const [otp, setOTP] = useState("");
  const [validationError, setValidationError] = useState("");

  const { locale, isRTL, t } = useContext(LanguageContext);

  useEffect(() => {
    const routeEmail = route.params?.email;
    if (routeEmail) {
      dispatch(setTempEmail(routeEmail));
    }
  }, [route.params?.email, dispatch]);

  useEffect(() => {
    if (otp.length === 6 && !loading) {
      handleVerify();
    }
  }, [otp, loading]);

  const handleVerify = async () => {
    setValidationError("");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!otp || otp.length !== 6) {
      setValidationError(t("verification.valid_code"));
      return;
    }

    if (!tempEmail) {
      setValidationError(t("verification.email_missing"));
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({ email: tempEmail, otp })
      ).unwrap();

      if (result.success) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        router.replace("/(tabs)/home");
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setValidationError(result.message || t("verification.failed"));
      }
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setValidationError(error.message || t("verification.failed"));
    }
  };

  const handleResendOTP = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!tempEmail) {
      setValidationError(t("verification.email_missing"));
      return;
    }

    try {
      const result = await dispatch(resendOTP(tempEmail)).unwrap();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        t("verification.otp_resent"),
        result.message || t("verification.new_code_sent")
      );
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        t("verification.resend_failed"),
        error.message || t("verification.could_not_resend")
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialIcons name="verified" size={60} color="#9e086c" />
        <Text style={styles.title}>{t("verification.verify_email")}</Text>
        <Text style={[styles.subtitle, isRTL && { textAlign: "right" }]}>
          {t("verification.enter_code")} {tempEmail}
        </Text>
      </View>

      <View style={styles.otpContainer}>
        <OTPTextInput
          handleTextChange={setOTP}
          inputCount={6}
          tintColor="#9e086c"
          offTintColor={validationError ? "#FF3B30" : "#E5E5EA"}
          textInputStyle={[
            styles.otpInput,
            validationError && styles.otpInputError,
          ]}
          containerStyle={styles.otpInputContainer}
        />

        {(validationError || error) && (
          <View
            style={[
              styles.errorContainer,
              isRTL && { flexDirection: "row-reverse" },
            ]}
          >
            <MaterialIcons
              name="error"
              size={16}
              color="#FF3B30"
              style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }}
            />
            <Text style={[styles.errorText, isRTL && { textAlign: "right" }]}>
              {validationError || error}
            </Text>
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
          <Text style={styles.buttonText}>
            {t("verification.verify_button")}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResendOTP}
        disabled={loading}
      >
        <Text style={[styles.resendText, isRTL && { textAlign: "right" }]}>
          {t("verification.didnt_receive")}
        </Text>
        <Text style={styles.resendLink}>{t("verification.resend_code")}</Text>
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
    flex: 1,
  },
  verifyButton: {
    height: 56,
    backgroundColor: "#9e086c",
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
    color: "#9e086c",
    fontWeight: "600",
  },
});
