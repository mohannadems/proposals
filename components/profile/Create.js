import React, { useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../store/slices/profile.slice";
import ProfileCreationStepper from "../../components/profile/ProfileCreationStepper";
import { COLORS } from "../../constants/colors";
import AuthInput from "../../components/forms/AuthInput";
import GenderSelect from "../../components/forms/GenderSelect";
import DatePicker from "../../components/forms/DatePicker";
import SelectInput from "../../components/forms/SelectInput";
import { nationalities, origins, religions } from "../../constants/options";

export default function CreateProfile() {
  const dispatch = useDispatch();
  const { data, currentStep } = useSelector((state) => state.profile);

  const handleNext = useCallback(() => {
    // Validate current step
    const isValid = validateCurrentStep();
    if (isValid) {
      dispatch(setStep(currentStep + 1));
    }
  }, [currentStep, data]);

  const handleFieldChange = useCallback((field, value) => {
    dispatch(updateField({ field, value }));
  }, []);

  const validateCurrentStep = () => {
    // Add validation logic here
    return true;
  };

  const renderBasicInfoStep = () => (
    <View style={styles.stepContainer}>
      <AuthInput
        label="Full Name"
        value={data.name}
        onChangeText={(value) => handleFieldChange("name", value)}
        placeholder="Enter your full name"
      />

      <GenderSelect
        value={data.gender}
        onChange={(value) => handleFieldChange("gender", value)}
      />

      <DatePicker
        label="Date of Birth"
        value={data.dateOfBirth}
        onChange={(value) => handleFieldChange("dateOfBirth", value)}
        maxDate={new Date()}
      />

      <SelectInput
        label="Nationality"
        value={data.nationality}
        options={nationalities}
        onChange={(value) => handleFieldChange("nationality", value)}
      />

      <SelectInput
        label="Origin"
        value={data.origin}
        options={origins}
        onChange={(value) => handleFieldChange("origin", value)}
      />

      <SelectInput
        label="Religion"
        value={data.religion}
        options={religions}
        onChange={(value) => handleFieldChange("religion", value)}
      />

      <Button title="Next" onPress={handleNext} style={styles.button} />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ProfileCreationStepper />
        {renderBasicInfoStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  stepContainer: {
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
});
