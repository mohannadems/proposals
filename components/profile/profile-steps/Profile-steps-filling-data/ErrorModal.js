import React from "react";
import { View, ScrollView, Text, Modal, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import styles from "../../../../styles/fillProfileData";

const ErrorModal = ({ visible, errors, onClose }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.errorModalContent}>
          <Feather name="alert-triangle" size={50} color="#FF6B6B" />
          <Text style={styles.errorModalTitle}>Oops! Something's Missing</Text>
          <Text style={styles.errorModalSubtitle}>
            Please review the following:
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.errorScrollView}
            contentContainerStyle={styles.errorScrollContent}
          >
            {errors.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Feather name="x-circle" size={18} color="#FF6B6B" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.errorModalButton} onPress={onClose}>
            <Text style={styles.errorModalButtonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorModal;
