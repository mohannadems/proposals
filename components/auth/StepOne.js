import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AuthInput from "../forms/login-forms/AuthInput";
import { registerStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";

export const StepOne = ({
  formData,
  validationErrors,
  touched,
  handleChange,
  handleBlur,
  onNextStep,
}) => {
  return (
    <>
      <AuthInput
        label="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
        onBlur={() => handleBlur("first_name")}
        error={validationErrors.first_name}
        touched={touched.first_name}
        placeholder="Your first name"
        leftIcon="person"
      />

      <AuthInput
        label="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
        onBlur={() => handleBlur("last_name")}
        error={validationErrors.last_name}
        touched={touched.last_name}
        placeholder="Your last name"
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
          registerStyles.nextButton,
          Object.keys(validationErrors).some((key) => validationErrors[key]) &&
            registerStyles.buttonDisabled,
        ]}
        onPress={onNextStep}
      >
        <Text style={registerStyles.buttonText}>
          {REGISTER_MESSAGES.CONTINUE}
        </Text>
        <FontAwesome name="heart" size={20} color="#fff" />
      </TouchableOpacity>
    </>
  );
};
