import React, { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AuthInput from "../forms/login-forms/AuthInput";
import { registerStyles } from "../../styles/register.styles";
import { LanguageContext } from "../../contexts/LanguageContext";

export const StepOne = ({
  formData,
  validationErrors,
  touched,
  handleChange,
  handleBlur,
  onNextStep,
  isRTL,
  t,
}) => {
  const languageContext = useContext(LanguageContext);
  const _isRTL =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;
  const _t = t || (languageContext ? languageContext.t : null);

  return (
    <>
      <AuthInput
        label={_t ? _t("register.first_name") : "First Name"}
        value={formData.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
        onBlur={() => handleBlur("first_name")}
        error={validationErrors.first_name}
        touched={touched.first_name}
        placeholder={
          _t ? _t("register.first_name_placeholder") : "Your first name"
        }
        leftIcon="person"
        isRTL={_isRTL}
      />

      <AuthInput
        label={_t ? _t("register.last_name") : "Last Name"}
        value={formData.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
        onBlur={() => handleBlur("last_name")}
        error={validationErrors.last_name}
        touched={touched.last_name}
        placeholder={
          _t ? _t("register.last_name_placeholder") : "Your last name"
        }
        leftIcon="person"
        isRTL={_isRTL}
      />

      <AuthInput
        label={_t ? _t("register.email") : "Email"}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        onBlur={() => handleBlur("email")}
        error={validationErrors.email}
        touched={touched.email}
        placeholder={
          _t ? _t("register.email_placeholder") : "Your email address"
        }
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="email"
        isRTL={_isRTL}
      />

      <AuthInput
        label={_t ? _t("register.phone_number") : "Phone Number"}
        value={formData.phone_number}
        onChangeText={(text) => handleChange("phone_number", text)}
        onBlur={() => handleBlur("phone_number")}
        error={validationErrors.phone_number}
        touched={touched.phone_number}
        placeholder={
          _t ? _t("register.phone_placeholder") : "Your phone number"
        }
        keyboardType="phone-pad"
        leftIcon="phone"
        isRTL={_isRTL}
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
          {_t ? _t("register.continue") : "Continue"}
        </Text>
        {_isRTL ? null : <FontAwesome name="heart" size={20} color="#fff" />}
        {_isRTL && (
          <FontAwesome
            name="heart"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
        )}
      </TouchableOpacity>
    </>
  );
};
