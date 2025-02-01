import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { COLORS } from "../../constants/colors";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../store/slices/profile.slice";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";

const steps = [
  "Personal Information",
  "Physical Attributes",
  "Location and Nationality",
  "Education and Employment",
  "Lifestyle",
  "Health and Marital Status",
  "Social Media and Guardian Contact",
  "Review and Submit",
];

// Reusable components
const FormInput = ({ label, error, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor={COLORS.placeholder}
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const CustomDropdown = ({
  label,
  items,
  open,
  setOpen,
  error,
  multiple,
  ...props
}) => (
  <View style={styles.dropdownContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      items={items}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownList}
      listMode="SCROLLVIEW"
      multiple={multiple}
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);
// Personal Information Step
// Part 2 - Form Steps Implementation

const PersonalInfoStep = ({ control }) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="bio_en"
        rules={{ required: "Bio in English is required" }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormInput
            label="Bio (English)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="bio_ar"
        rules={{ required: "Bio in Arabic is required" }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormInput
            label="Bio (Arabic)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="أخبرنا عن نفسك..."
            multiline
            numberOfLines={4}
            textAlign="right"
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        rules={{ required: "Gender is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Gender"
            items={genderItems}
            open={genderOpen}
            setOpen={setGenderOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="date_of_birth"
        rules={{ required: "Date of birth is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View style={styles.datePickerContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.datePickerButton]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {value ? new Date(value).toLocaleDateString() : "Select date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate && event.type !== "dismissed") {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const PhysicalAttributesStep = ({ control }) => {
  const [heightOpen, setHeightOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);
  const [hairColorOpen, setHairColorOpen] = useState(false);
  const [skinColorOpen, setSkinColorOpen] = useState(false);

  const heightOptions = Array.from({ length: 61 }, (_, i) => ({
    label: `${150 + i}cm`,
    value: 150 + i,
  }));

  const weightOptions = Array.from({ length: 101 }, (_, i) => ({
    label: `${40 + i}kg`,
    value: 40 + i,
  }));

  const [hairColorOptions] = useState([
    { label: "Black", value: 1 },
    { label: "Brown", value: 2 },
    { label: "Blonde", value: 3 },
    { label: "Red", value: 4 },
  ]);

  const [skinColorOptions] = useState([
    { label: "Fair", value: 1 },
    { label: "Medium", value: 2 },
    { label: "Olive", value: 3 },
    { label: "Dark", value: 4 },
  ]);

  return (
    <View style={styles.stepContainer}>
      {/* Height, Weight, Hair Color, and Skin Color Controllers */}
      <Controller
        control={control}
        name="height"
        rules={{ required: "Height is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Height"
            items={heightOptions}
            open={heightOpen}
            setOpen={setHeightOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={4000}
          />
        )}
      />

      <Controller
        control={control}
        name="weight"
        rules={{ required: "Weight is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Weight"
            items={weightOptions}
            open={weightOpen}
            setOpen={setWeightOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="hair_color_id"
        rules={{ required: "Hair color is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Hair Color"
            items={hairColorOptions}
            open={hairColorOpen}
            setOpen={setHairColorOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      <Controller
        control={control}
        name="skin_color_id"
        rules={{ required: "Skin color is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Skin Color"
            items={skinColorOptions}
            open={skinColorOpen}
            setOpen={setSkinColorOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={1000}
          />
        )}
      />
    </View>
  );
};

// Location and Nationality Step
const LocationAndNationalityStep = ({ control }) => {
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const countryOptions = [
    { label: "Saudi Arabia", value: 1 },
    { label: "UAE", value: 2 },
    { label: "Kuwait", value: 3 },
    { label: "Qatar", value: 4 },
    { label: "Bahrain", value: 5 },
  ];

  const cityOptions = [
    { label: "Riyadh", value: 1 },
    { label: "Jeddah", value: 2 },
    { label: "Dubai", value: 3 },
    { label: "Abu Dhabi", value: 4 },
    { label: "Kuwait City", value: 5 },
  ];

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="nationality_id"
        rules={{ required: "Nationality is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Nationality"
            items={countryOptions}
            open={nationalityOpen}
            setOpen={setNationalityOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="country_of_residence_id"
        rules={{ required: "Country of residence is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Country of Residence"
            items={countryOptions}
            open={countryOpen}
            setOpen={setCountryOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      <Controller
        control={control}
        name="city_id"
        rules={{ required: "City is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="City"
            items={cityOptions}
            open={cityOpen}
            setOpen={setCityOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={1000}
          />
        )}
      />
    </View>
  );
};

const EducationAndEmploymentStep = ({ control, watch }) => {
  const [eduLevelOpen, setEduLevelOpen] = useState(false);
  const [employmentOpen, setEmploymentOpen] = useState(false);
  const [jobTitleOpen, setJobTitleOpen] = useState(false);

  const employmentStatus = watch("employment_status");

  const educationOptions = [
    { label: "High School", value: 1 },
    { label: "Bachelor's Degree", value: 2 },
    { label: "Master's Degree", value: 3 },
    { label: "PhD", value: 4 },
  ];

  const employmentOptions = [
    { label: "Employed", value: true },
    { label: "Unemployed", value: false },
  ];

  const jobTitleOptions = [
    { label: "Engineer", value: 1 },
    { label: "Doctor", value: 2 },
    { label: "Teacher", value: 3 },
    { label: "Business Owner", value: 4 },
  ];

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="educational_level_id"
        rules={{ required: "Education level is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Education Level"
            items={educationOptions}
            open={eduLevelOpen}
            setOpen={setEduLevelOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="employment_status"
        rules={{ required: "Employment status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Employment Status"
            items={employmentOptions}
            open={employmentOpen}
            setOpen={setEmploymentOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      {employmentStatus && (
        <Controller
          control={control}
          name="job_title_id"
          rules={{ required: "Job title is required when employed" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDropdown
              label="Job Title"
              items={jobTitleOptions}
              open={jobTitleOpen}
              setOpen={setJobTitleOpen}
              value={value}
              setValue={onChange}
              error={error?.message}
              zIndex={1000}
            />
          )}
        />
      )}
    </View>
  );
};
// Lifestyle Step
const LifestyleStep = ({ control, watch }) => {
  const [smokingOpen, setSmokingOpen] = useState(false);
  const [smokingToolsOpen, setSmokingToolsOpen] = useState(false);
  const [financialStatusOpen, setFinancialStatusOpen] = useState(false);
  const [housingStatusOpen, setHousingStatusOpen] = useState(false);
  const [carOwnershipOpen, setCarOwnershipOpen] = useState(false);

  const smokingOptions = [
    { label: "Non-smoker", value: 0 },
    { label: "Smoker", value: 1 },
  ];

  const smokingToolsOptions = [
    { label: "Cigarettes", value: 1 },
    { label: "Shisha/Hookah", value: 2 },
    { label: "Vape/E-cigarettes", value: 3 },
  ];

  const financialStatusOptions = [
    { label: "Low Income", value: 1 },
    { label: "Middle Income", value: 2 },
    { label: "High Income", value: 3 },
  ];

  const housingStatusOptions = [
    { label: "Own Home", value: 1 },
    { label: "Renting", value: 2 },
    { label: "Living with Family", value: 3 },
  ];

  const carOwnershipOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const smokingStatus = watch("smoking_status");

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="smoking_status"
        rules={{ required: "Smoking status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Smoking Status"
            items={smokingOptions}
            open={smokingOpen}
            setOpen={setSmokingOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={5000}
          />
        )}
      />

      {smokingStatus === 1 && (
        <Controller
          control={control}
          name="smoking_tools"
          rules={{ required: "Smoking tools is required for smokers" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <CustomDropdown
              label="Smoking Tools"
              items={smokingToolsOptions}
              open={smokingToolsOpen}
              setOpen={setSmokingToolsOpen}
              value={value}
              setValue={onChange}
              multiple={true}
              error={error?.message}
              zIndex={4000}
            />
          )}
        />
      )}

      <Controller
        control={control}
        name="financial_status_id"
        rules={{ required: "Financial status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Financial Status"
            items={financialStatusOptions}
            open={financialStatusOpen}
            setOpen={setFinancialStatusOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={3000}
          />
        )}
      />

      <Controller
        control={control}
        name="housing_status_id"
        rules={{ required: "Housing status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Housing Status"
            items={housingStatusOptions}
            open={housingStatusOpen}
            setOpen={setHousingStatusOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />
      <Controller
        control={control}
        name="housing_status_id"
        rules={{ required: "Housing status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Housing Status"
            items={housingStatusOptions}
            open={housingStatusOpen}
            setOpen={setHousingStatusOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      <Controller
        control={control}
        name="car_ownership"
        rules={{ required: "Car ownership status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Do you own a car?"
            items={carOwnershipOptions}
            open={carOwnershipOpen}
            setOpen={setCarOwnershipOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={1000}
          />
        )}
      />
    </View>
  );
};

// Health and Marital Status Step
const HealthAndMaritalStatusStep = ({ control }) => {
  const [maritalStatusOpen, setMaritalStatusOpen] = useState(false);
  const [religionOpen, setReligionOpen] = useState(false);

  const maritalStatusOptions = [
    { label: "Single", value: 1 },
    { label: "Married", value: 2 },
    { label: "Divorced", value: 3 },
    { label: "Widowed", value: 4 },
  ];

  const religionOptions = [
    { label: "Muslim", value: 1 },
    { label: "Christian", value: 2 },
    { label: "Jewish", value: 3 },
    { label: "Other", value: 4 },
  ];

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="marital_status_id"
        rules={{ required: "Marital status is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Marital Status"
            items={maritalStatusOptions}
            open={maritalStatusOpen}
            setOpen={setMaritalStatusOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      <Controller
        control={control}
        name="religion_id"
        rules={{ required: "Religion is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Religion"
            items={religionOptions}
            open={religionOpen}
            setOpen={setReligionOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={1000}
          />
        )}
      />
    </View>
  );
};
// Social Media and Guardian Contact Step
const SocialMediaAndGuardianStep = ({ control }) => {
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);

  const socialMediaOptions = [
    { label: "No Social Media", value: 1 },
    { label: "Has Social Media", value: 2 },
  ];

  return (
    <View style={styles.stepContainer}>
      <Controller
        control={control}
        name="social_media_presence_id"
        rules={{ required: "Social media presence is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CustomDropdown
            label="Social Media Presence"
            items={socialMediaOptions}
            open={socialMediaOpen}
            setOpen={setSocialMediaOpen}
            value={value}
            setValue={onChange}
            error={error?.message}
            zIndex={2000}
          />
        )}
      />

      <Controller
        control={control}
        name="guardian_contact"
        rules={{
          required: "Guardian contact is required",
          pattern: {
            value: /^\+9\d{9,14}$/,
            message: "Please enter a valid phone number starting with +9",
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <FormInput
            label="Guardian Contact"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter guardian contact number (+9...)"
            keyboardType="phone-pad"
            error={error?.message}
          />
        )}
      />
    </View>
  );
};

// Main Component Implementation
const ProfileCompletionScreen = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      bio_en: "",
      bio_ar: "",
      gender: "",
      date_of_birth: new Date(),
      height: null,
      weight: null,
      nationality_id: null,
      city_id: null,
      country_of_residence_id: null,
      educational_level_id: null,
      employment_status: null,
      financial_status_id: null,
      hair_color_id: null,
      housing_status_id: null,
      marital_status_id: null,
      religion_id: null,
      skin_color_id: null,
      smoking_status: null,
      car_ownership: null,
      social_media_presence_id: null,
      guardian_contact: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (currentStep === steps.length - 1) {
        const formData = new FormData();

        // Format and append form data
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            if (key === "date_of_birth") {
              formData.append(key, data[key].toISOString().split("T")[0]);
            } else if (typeof data[key] === "boolean") {
              formData.append(key, data[key] ? "1" : "0");
            } else if (Array.isArray(data[key])) {
              data[key].forEach((value) => {
                formData.append(`${key}[]`, value.toString());
              });
            } else {
              formData.append(key, data[key].toString());
            }
          }
        });

        await dispatch(updateProfile(formData)).unwrap();
        Alert.alert("Success", "Profile updated successfully");
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep control={control} />;
      case 1:
        return <PhysicalAttributesStep control={control} />;
      case 2:
        return <LocationAndNationalityStep control={control} />;
      case 3:
        return <EducationAndEmploymentStep control={control} watch={watch} />;
      case 4:
        return <LifestyleStep control={control} watch={watch} />;
      case 5:
        return <HealthAndMaritalStatusStep control={control} />;
      case 6:
        return <SocialMediaAndGuardianStep control={control} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.stepCount}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${((currentStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepTitle}>{steps[currentStep]}</Text>
        {renderStep()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.navButton, styles.secondaryButton]}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navButton, styles.primaryButton]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.primaryButtonText}>
            {currentStep < steps.length - 1 ? "Next" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCount: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    gap: 24,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1000,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  dropdown: {
    borderColor: COLORS.border,
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: COLORS.white,
  },
  dropdownList: {
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerButton: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
  },
  navigationButtons: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileCompletionScreen;
