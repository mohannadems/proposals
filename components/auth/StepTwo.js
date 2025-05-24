import React, { useContext } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import AuthInput from "../forms/login-forms/AuthInput";
import GenderSelect from "../profile/profile-steps/Profile-steps-filling-data/GenderSelect";
import { registerStyles } from "../../styles/register.styles";
import { LanguageContext } from "../../contexts/LanguageContext";

export const StepTwo = ({
  formData,
  validationErrors,
  touched,
  handleChange,
  handleBlur,
  onPreviousStep,
  onSubmit,
  loading,
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

  const dynamicStyles = {
    errorContainer: [
      registerStyles.errorContainer,
      _isRTL && { flexDirection: "row-reverse" },
    ],
    errorText: [
      registerStyles.errorText,
      _isRTL && { textAlign: "right", marginRight: 8, marginLeft: 0 },
    ],
    buttonGroup: [
      registerStyles.buttonGroup,
      _isRTL && { flexDirection: "row-reverse" },
    ],
    backButton: [
      registerStyles.backButton,
      _isRTL && { flexDirection: "row-reverse" },
    ],
    registerButton: [registerStyles.registerButton],
  };

  return (
    <>
      <GenderSelect
        value={formData.gender}
        onChange={(value) => handleChange("gender", value)}
        error={validationErrors.gender}
        touched={touched.gender}
        isRTL={_isRTL}
        t={_t}
      />

      <AuthInput
        label={_t ? _t("register.password") : "Password"}
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        onBlur={() => handleBlur("password")}
        error={validationErrors.password}
        touched={touched.password}
        placeholder={
          _t ? _t("register.password_placeholder") : "Create a secure password"
        }
        secureTextEntry
        leftIcon="lock"
        isRTL={_isRTL}
      />

      <AuthInput
        label={_t ? _t("register.confirm_password") : "Confirm Password"}
        value={formData.password_confirmation}
        onChangeText={(text) => handleChange("password_confirmation", text)}
        onBlur={() => handleBlur("password_confirmation")}
        error={validationErrors.password_confirmation}
        touched={touched.password_confirmation}
        placeholder={
          _t
            ? _t("register.confirm_password_placeholder")
            : "Confirm your password"
        }
        secureTextEntry
        leftIcon="lock"
        isRTL={_isRTL}
      />

      {validationErrors.general && (
        <View style={dynamicStyles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#FF3B30" />
          <Text style={dynamicStyles.errorText}>
            {validationErrors.general}
          </Text>
        </View>
      )}

      <View style={dynamicStyles.buttonGroup}>
        <TouchableOpacity
          style={dynamicStyles.backButton}
          onPress={onPreviousStep}
        >
          <MaterialIcons
            name={_isRTL ? "arrow-forward" : "arrow-back"}
            size={24}
            color="#9e086c"
          />
          <Text style={registerStyles.backButtonText}>
            {_t ? _t("register.back") : "Back"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            dynamicStyles.registerButton,
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
              {_isRTL && (
                <FontAwesome
                  name="heart"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={registerStyles.buttonText}>
                {_t ? _t("register.start_journey") : "Start Journey"}
              </Text>
              {!_isRTL && (
                <FontAwesome
                  name="heart"
                  size={20}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};
