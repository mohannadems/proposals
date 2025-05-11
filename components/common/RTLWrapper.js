import React, { useContext } from "react";
import { View } from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";

const RTLWrapper = ({ children, style, ...props }) => {
  const { isRTL } = useContext(LanguageContext);

  return (
    <View
      style={[{ flexDirection: isRTL ? "row-reverse" : "row" }, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export default RTLWrapper;
