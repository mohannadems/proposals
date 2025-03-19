import React from "react";
import { View, StyleSheet } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { LayoutAnimatedView } from "./AnimatedBase";
import FormDropdown from "../../../common/FormDropdown";
import { COLORS } from "../../../../constants/colors";

export const AnimatedFormContainer = ({ children }) => {
  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(400).springify()}
      style={styles.formContainer}
    >
      {children}
    </LayoutAnimatedView>
  );
};

export const AnimatedDropdown = ({
  control,
  name,
  label,
  items,
  leftIcon,
  required = false,
  containerStyle,
  isLoading = false,
  ...props
}) => {
  return (
    <FormDropdown
      control={control}
      name={name}
      label={label}
      items={items}
      placeholderTextColor={COLORS.text + "80"}
      leftIcon={leftIcon}
      containerStyle={[styles.dropdownAnimated, containerStyle]}
      required={required}
      isLoading={isLoading}
      {...props}
    />
  );
};

export const PreferencesContainer = ({ children }) => {
  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(400).springify()}
      style={styles.preferencesContainer}
    >
      {children}
    </LayoutAnimatedView>
  );
};

export const FormRow = ({ children }) => {
  return <View style={styles.rowContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    gap: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  dropdownAnimated: {
    transform: [{ scale: 1 }],
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
  },
  preferencesContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    overflow: "hidden",
  },
  rowContainer: {
    alignItems: "start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
});

export default {
  AnimatedFormContainer,
  AnimatedDropdown,
  PreferencesContainer,
  FormRow,
};
