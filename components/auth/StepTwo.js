import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AuthInput from "../forms/login-forms/AuthInput";
import GenderSelect from "../profile/profile-steps/Profile-steps-filling-data/GenderSelect";
import { registerStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";

export const StepTwo = ({
  formData,
  validationErrors,
  touched,
  handleChange,
  handleBlur,
  onPreviousStep,
  onSubmit,
  loading,
}) => {
  return (
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
        <View style={registerStyles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={registerStyles.errorText}>
            {validationErrors.general}
          </Text>
        </View>
      )}

      <View style={registerStyles.buttonGroup}>
        <TouchableOpacity
          style={registerStyles.backButton}
          onPress={onPreviousStep}
        >
          <MaterialIcons name="arrow-back" size={24} color="#B65165" />
          <Text style={registerStyles.backButtonText}>
            {REGISTER_MESSAGES.BACK}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            registerStyles.registerButton,
            (loading ||
              Object.keys(validationErrors).some(
                (key) => validationErrors[key]
              )) &&
              registerStyles.buttonDisabled,
          ]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={registerStyles.buttonText}>
                {REGISTER_MESSAGES.START_JOURNEY}
              </Text>
              <FontAwesome name="heart" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};
