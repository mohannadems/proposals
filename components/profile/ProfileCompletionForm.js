// components/profile/ProfileCompletionForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants/colors";

const steps = [
  {
    title: "Basic Information",
    fields: [
      {
        key: "first_name",
        label: "First Name",
        placeholder: "Enter your first name",
      },
      {
        key: "last_name",
        label: "Last Name",
        placeholder: "Enter your last name",
      },
      {
        key: "date_of_birth",
        label: "Date of Birth",
        placeholder: "YYYY-MM-DD",
      },
    ],
  },
  {
    title: "Personal Details",
    fields: [
      { key: "gender", label: "Gender", placeholder: "Enter your gender" },
      {
        key: "height",
        label: "Height",
        placeholder: "Enter your height in cm",
      },
      {
        key: "weight",
        label: "Weight",
        placeholder: "Enter your weight in kg",
      },
    ],
  },
  {
    title: "Interests",
    fields: [
      { key: "hobbies", label: "Hobbies", placeholder: "Enter your hobbies" },
      {
        key: "favorite_music",
        label: "Favorite Music",
        placeholder: "Enter your favorite music genres",
      },
      {
        key: "favorite_movies",
        label: "Favorite Movies",
        placeholder: "Enter your favorite movie genres",
      },
    ],
  },
];

export default function ProfileCompletionForm({
  initialData,
  onSubmit,
  onClose,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData || {});

  const handleChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentStepData.title}</Text>

      {currentStepData.fields.map((field) => (
        <View key={field.key} style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            value={formData[field.key]}
            onChangeText={(text) => handleChange(field.key, text)}
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.text,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});
