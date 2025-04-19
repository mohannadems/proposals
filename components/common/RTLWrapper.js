import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";

const RTLWrapper = ({ children, style }) => {
  const { isRTL } = useContext(LanguageContext);

  return (
    <View style={[styles.container, isRTL && styles.rtl, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  rtl: {
    flexDirection: "row-reverse",
  },
});

export default RTLWrapper;
