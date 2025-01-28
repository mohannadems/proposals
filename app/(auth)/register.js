import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { register } from "../../store/slices/auth.slice";
import AuthInput from "../../components/forms/AuthInput";
import GenderSelect from "../../components/forms/GenderSelect";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    gender: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    gender: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone_number: false,
    password: false,
    password_confirmation: false,
    gender: false,
  });
  const [step, setStep] = useState(1);

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]*$/.test(value))
          return "Name can only contain letters and spaces";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";

      case "phone_number":
        if (!value.trim()) return "Phone number is required";
        if (!/^[0-9]{10}$/.test(value.replace(/\D/g, "")))
          return "Please enter a valid 10-digit phone number";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        return "";

      case "password_confirmation":
        if (!value) return "Please confirm your password";
        if (value !== formData.password) return "Passwords do not match";
        return "";

      case "gender":
        if (!value) return "Please select your gender";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const error = validateField(field, value);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field]);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateStep = (stepNumber) => {
    const fieldsToValidate =
      stepNumber === 1
        ? ["name", "email", "phone_number"]
        : ["gender", "password", "password_confirmation"];

    const newErrors = {};
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) isValid = false;

      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    });

    setValidationErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(1)) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!validateStep(2)) {
      return;
    }

    try {
      const result = await dispatch(register(formData)).unwrap();
      if (result) {
        router.push("/(auth)/verify-otp");
      }
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        general: error.message || "Registration failed. Please try again.",
      }));
    }
  };

  const renderWelcomeMessage = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeEmoji}>💝</Text>
      <Text style={styles.title}>Find Your Soulmate</Text>
      <Text style={styles.subtitle}>
        Begin your journey to meaningful connections
      </Text>
    </View>
  );

  const renderStepOne = () => (
    <>
      <AuthInput
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        onBlur={() => handleBlur("name")}
        error={validationErrors.name}
        touched={touched.name}
        placeholder="How should we call you?"
        leftIcon="person"
      />

      <AuthInput
        label="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        onBlur={() => handleBlur("email")}
        error={validationErrors.email}
        touched={touched.email}
        placeholder="Your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
      />

      <AuthInput
        label="Phone Number"
        value={formData.phone_number}
        onChangeText={(text) => handleChange("phone_number", text)}
        onBlur={() => handleBlur("phone_number")}
        error={validationErrors.phone_number}
        touched={touched.phone_number}
        placeholder="Your phone number"
        keyboardType="phone-pad"
        leftIcon="phone"
      />

      <TouchableOpacity
        style={[
          styles.nextButton,
          Object.keys(validationErrors).some((key) => validationErrors[key]) &&
            styles.buttonDisabled,
        ]}
        onPress={handleNextStep}
      >
        <Text style={styles.buttonText}>Continue</Text>
        <FontAwesome name="heart" size={20} color="#fff" />
      </TouchableOpacity>
    </>
  );

  const renderStepTwo = () => (
    <>
      <GenderSelect
        value={formData.gender}
        onChange={(value) => handleChange("gender", value)}
        error={validationErrors.gender}
        touched={touched.gender}
      />

      <AuthInput
        label="Password"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        onBlur={() => handleBlur("password")}
        error={validationErrors.password}
        touched={touched.password}
        placeholder="Create a secure password"
        secureTextEntry
        leftIcon="lock"
      />

      <AuthInput
        label="Confirm Password"
        value={formData.password_confirmation}
        onChangeText={(text) => handleChange("password_confirmation", text)}
        onBlur={() => handleBlur("password_confirmation")}
        error={validationErrors.password_confirmation}
        touched={touched.password_confirmation}
        placeholder="Confirm your password"
        secureTextEntry
        leftIcon="lock"
      />

      {validationErrors.general && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>{validationErrors.general}</Text>
        </View>
      )}

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
          <MaterialIcons name="arrow-back" size={24} color="#B65165" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.registerButton,
            (loading ||
              Object.keys(validationErrors).some(
                (key) => validationErrors[key]
              )) &&
              styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Start Your Journey</Text>
              <FontAwesome name="heart" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={["rgba(65, 105, 225, 0.1)", "rgba(212, 175, 55, 0.1)"]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderWelcomeMessage()}

          <View style={styles.stepsContainer}>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]}>
                {step > 1 && (
                  <MaterialIcons name="check" size={12} color="#fff" />
                )}
              </View>
              <View
                style={[styles.stepLine, step >= 2 && styles.activeStepLine]}
              />
              <View
                style={[styles.stepDot, step >= 2 && styles.activeStepDot]}
              />
            </View>
            <Text style={styles.stepText}>Step {step} of 2</Text>
          </View>

          <View style={styles.formContainer}>
            {step === 1 ? renderStepOne() : renderStepTwo()}
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginLinkText}>
              Already found love here? Sign in
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 40,
    marginBottom: 20,
  },
  welcomeEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B65165",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  stepsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepDot: {
    backgroundColor: "#B65165",
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 4,
  },
  activeStepLine: {
    backgroundColor: "#B65165",
  },
  stepText: {
    color: "#666",
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  registerButton: {
    flex: 2,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButtonText: {
    color: "#B65165",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 16,
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#B65165",
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontSize: 14,
  },
});
