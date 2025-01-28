import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider"; // Correct import
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function PreferencesScreen() {
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [isSmokingOk, setIsSmokingOk] = useState(false);
  const [isDrinkingOk, setIsDrinkingOk] = useState(false);

  const handleSavePreferences = () => {
    // Save preferences logic here
    console.log("Preferences saved:", {
      ageRange,
      location,
      interests,
      isSmokingOk,
      isDrinkingOk,
    });
    router.back(); // Navigate back to the previous screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partner Preferences</Text>
      </View>

      <View style={styles.content}>
        {/* Age Range */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Age Range</Text>
          <View style={styles.ageRangeContainer}>
            <Text style={styles.ageRangeText}>{ageRange[0]}</Text>
            <Slider
              style={styles.slider}
              minimumValue={18}
              maximumValue={60}
              step={1}
              value={ageRange[0]}
              onValueChange={(value) => setAgeRange([value, ageRange[1]])}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.ageRangeText}>{ageRange[1]}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter preferred location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Interests */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Interests</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter interests (e.g., hiking, reading)"
            value={interests}
            onChangeText={setInterests}
          />
        </View>

        {/* Lifestyle Preferences */}
        <View style={styles.preferenceSection}>
          <Text style={styles.preferenceTitle}>Lifestyle Preferences</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Smoking</Text>
            <Switch
              value={isSmokingOk}
              onValueChange={setIsSmokingOk}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Drinking</Text>
            <Switch
              value={isDrinkingOk}
              onValueChange={setIsDrinkingOk}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSavePreferences}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  },
  preferenceSection: {
    marginBottom: 24,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  ageRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ageRangeText: {
    fontSize: 16,
    color: COLORS.text,
  },
  slider: {
    flex: 1,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
