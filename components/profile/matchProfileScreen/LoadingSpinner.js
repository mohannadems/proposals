import React from "react";
import { View, Text, ActivityIndicator, Modal, StyleSheet } from "react-native";
import { COLORS } from "../../../constants/colors";

const LoadingSpinner = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    padding: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});

export default LoadingSpinner;
