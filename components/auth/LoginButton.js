import React, { useContext } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { loginStyles } from "../../styles/auth.styles";
import { AUTH_MESSAGES } from "../../constants/auth";
import { LanguageContext } from "../../contexts/LanguageContext";

export const LoginButton = ({ onPress, loading, buttonText }) => {
  const languageContext = useContext(LanguageContext);
  const isRTL = languageContext ? languageContext.isRTL : false;
  const t = languageContext ? languageContext.t : null;

  const text =
    buttonText ||
    (t ? t("auth.continue_journey") : AUTH_MESSAGES.CONTINUE_JOURNEY);

  return (
    <TouchableOpacity
      style={[
        loginStyles.loginButton,
        loading && loginStyles.buttonDisabled,
        isRTL && { flexDirection: "row-reverse" },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <FontAwesome
            name="heart"
            size={20}
            color="#fff"
            style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }}
          />
          <Text
            style={[
              loginStyles.loginButtonText,
              isRTL && { textAlign: "right" },
            ]}
          >
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};
