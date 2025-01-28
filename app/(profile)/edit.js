import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { updateProfile } from "../../store/slices/profile.slice";
import AuthInput from "../../components/forms/AuthInput";
import SelectInput from "../../components/forms/SelectInput";
import DateInput from "../../components/forms/DateInput";

export default function ProfileEditScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.profile);
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    dateOfBirth: "",
    nationality: "",
    origin: "",
    religion: "",

    // Location
    countryOfResidence: "",
    cityOfResidence: "",
    area: "",

    // Personal Details
    education: "",
    specialization: "",
    occupation: "",
    workSector: "",
    workLevel: "",
    financialStatus: "",

    // Physical Attributes
    height: "",
    weight: "",
    skinTone: "",
    hairColor: "",

    // Lifestyle
    maritalStatus: "",
    hasChildren: false,
    numberOfChildren: 0,
    languages: [],

    // Habits & Preferences
    hasPets: false,
    petTypes: [],
    smoking: "",
    drinking: "",
    exerciseHabits: "",
    socialMediaUsage: "",
    sleepingHabits: "",
    religiousCommitment: "",

    // Additional Info
    hobbies: [],
    bio: "",
    aboutPartner: "",
  });

  const sections = [
    {
      title: "Basic Information",
      fields: ["dateOfBirth", "nationality", "origin", "religion"],
      icon: "person",
    },
    {
      title: "Location",
      fields: ["countryOfResidence", "cityOfResidence", "area"],
      icon: "location-on",
    },
    {
      title: "Education & Work",
      fields: [
        "education",
        "specialization",
        "occupation",
        "workSector",
        "workLevel",
        "financialStatus",
      ],
      icon: "school",
    },
    {
      title: "Physical Attributes",
      fields: ["height", "weight", "skinTone", "hairColor"],
      icon: "face",
    },
    {
      title: "Lifestyle",
      fields: ["maritalStatus", "hasChildren", "numberOfChildren", "languages"],
      icon: "lifestyle",
    },
    {
      title: "Habits",
      fields: [
        "smoking",
        "drinking",
        "exerciseHabits",
        "socialMediaUsage",
        "sleepingHabits",
        "religiousCommitment",
      ],
      icon: "favorite",
    },
    {
      title: "About Me",
      fields: ["hobbies", "bio", "aboutPartner"],
      icon: "edit",
    },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSection = async () => {
    try {
      await dispatch(
        updateProfile({
          section: currentSection,
          data: formData,
        })
      ).unwrap();

      if (currentSection < sections.length - 1) {
        setCurrentSection((prev) => prev + 1);
      } else {
        router.replace("/(tabs)/profile");
      }
    } catch (error) {
      // Handle error
    }
  };

  const renderSectionContent = () => {
    const currentFields = sections[currentSection].fields;

    return (
      <View style={styles.sectionContent}>
        {currentFields.map((field) => {
          switch (field) {
            case "dateOfBirth":
              return (
                <DateInput
                  key={field}
                  label="Date of Birth"
                  value={formData[field]}
                  onChange={(value) => handleChange(field, value)}
                />
              );
            case "bio":
            case "aboutPartner":
              return (
                <AuthInput
                  key={field}
                  label={field === "bio" ? "About Me" : "What I'm Looking For"}
                  value={formData[field]}
                  onChangeText={(text) => handleChange(field, text)}
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                />
              );
            default:
              return (
                <AuthInput
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  value={formData[field]}
                  onChangeText={(text) => handleChange(field, text)}
                />
              );
          }
        })}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(182, 81, 101, 0.1)", "rgba(182, 81, 101, 0.05)"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{sections[currentSection].title}</Text>
        <Text style={styles.headerSubtitle}>
          Step {currentSection + 1} of {sections.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>{renderSectionContent()}</ScrollView>

      <View style={styles.footer}>
        {currentSection > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentSection((prev) => prev - 1)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#B65165" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, loading && styles.buttonDisabled]}
          onPress={handleSaveSection}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentSection === sections.length - 1
                  ? "Complete Profile"
                  : "Next"}
              </Text>
              <MaterialIcons
                name={
                  currentSection === sections.length - 1
                    ? "check"
                    : "arrow-forward"
                }
                size={24}
                color="#fff"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B65165",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  content: {
    flex: 1,
  },
  sectionContent: {
    padding: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#B65165",
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
