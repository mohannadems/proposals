import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function VerificationScreen() {
  const [document, setDocument] = useState(null);

  const handleUploadDocument = () => {
    // Logic to upload a verification document
    console.log("Upload verification document");
  };

  const handleSubmitVerification = () => {
    // Submit verification logic here
    console.log("Verification submitted:", { document });
    router.back(); // Navigate back to the previous screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Your Account</Text>
      </View>

      <View style={styles.content}>
        {/* Document Upload */}
        <TouchableOpacity
          style={styles.documentContainer}
          onPress={handleUploadDocument}
        >
          {document ? (
            <Image source={{ uri: document }} style={styles.documentImage} />
          ) : (
            <MaterialIcons
              name="upload-file"
              size={48}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.uploadText}>Upload a government-issued ID</Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitVerification}
        >
          <Text style={styles.submitButtonText}>Submit Verification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 16,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  documentContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  documentImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  uploadText: {
    fontSize: 16,
    color: COLORS.text + "80",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
