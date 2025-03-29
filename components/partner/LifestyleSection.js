import React, { memo, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Alert } from "react-native";
import styles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";
import MultiSelectChips from "../search/MultiSelectChips";
import { selectDirectReligiosityLevels } from "../../store/slices/profileAttributesSlice";

const LifestyleSection = ({
  preferences,
  onChange,
  lifestyleInterests,
  personalAttributes,
  onComplete,
}) => {
  const religiosityLevels = useSelector(selectDirectReligiosityLevels);

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {}, [
    religiosityLevels,
    lifestyleInterests,
    preferences.preferred_smoking_status,
    preferences.preferred_smoking_tools,
  ]);

  const hasSmokingError =
    preferences.preferred_smoking_status === true &&
    (!preferences.preferred_smoking_tools ||
      preferences.preferred_smoking_tools.length === 0);

  const handleCompleteSection = () => {
    if (hasSmokingError) {
      Alert.alert(
        "Missing Information",
        "Please select at least one smoking tool since you've selected 'Smoker'.",
        [{ text: "OK" }]
      );
      setValidationErrors({ smokingTools: true });
      return;
    }

    setValidationErrors({});
    onComplete();
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          Set preferences for lifestyle habits and preferences
        </Text>
      </View>

      <View style={styles.toggleContainerWithLabel}>
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>Smoking Status</Text>
          <TouchableOpacity
            onPress={() => {
              onChange("preferred_smoking_status", null);
              onChange("preferred_smoking_tools", []);
              setValidationErrors((prev) => ({ ...prev, smokingTools: false }));
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {preferences.preferred_smoking_status !== null ? (
          <View style={styles.toggleButtons}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                preferences.preferred_smoking_status === true &&
                  styles.activeToggle,
              ]}
              onPress={() => {
                onChange("preferred_smoking_status", true);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  preferences.preferred_smoking_status === true &&
                    styles.activeToggleText,
                ]}
              >
                Smoker
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPreferenceButton}
            onPress={() => {
              onChange("preferred_smoking_status", true);

              if (!preferences.preferred_smoking_tools?.length) {
                const defaultTool = (
                  lifestyleInterests.smokingTools || []
                ).find((tool) => tool.name === "Cigarettes");
                if (defaultTool) {
                  onChange("preferred_smoking_tools", [defaultTool.id]);
                  setValidationErrors((prev) => ({
                    ...prev,
                    smokingTools: false,
                  }));
                }
              }
            }}
          >
            <Text style={styles.addPreferenceText}>Add smoking preference</Text>
          </TouchableOpacity>
        )}
      </View>

      {preferences.preferred_smoking_status === true && (
        <View
          style={[
            styles.chipSelectorContainer,
            validationErrors.smokingTools && {
              borderColor: "red",
              borderWidth: 1,
              padding: 15,
              borderRadius: 8,
            },
          ]}
        >
          <View style={styles.toggleLabelRow}>
            <Text
              style={[
                styles.inputLabel,
                validationErrors.smokingTools && { color: "red" },
              ]}
            >
              Smoking Tools <Text style={{ color: "red" }}>*</Text>
            </Text>
            {validationErrors.smokingTools && (
              <Text style={{ color: "red", fontSize: 12 }}>Required</Text>
            )}
          </View>
          <MultiSelectChips
            items={(lifestyleInterests.smokingTools || []).map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            selectedItems={preferences.preferred_smoking_tools || []}
            onSelectItem={(items) => {
              onChange("preferred_smoking_tools", items);
              if (items.length > 0) {
                setValidationErrors((prev) => ({
                  ...prev,
                  smokingTools: false,
                }));
              }
            }}
          />
          {validationErrors.smokingTools && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                padding: 15,
              }}
            >
              Please select at least one smoking tool.
            </Text>
          )}
        </View>
      )}

      <ModernDropdown
        label="Drinking Status"
        value={preferences.preferred_drinking_status_id}
        items={(lifestyleInterests.drinkingStatuses || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_drinking_status_id", value)
        }
        placeholder="Select drinking status (optional)"
      />

      <ModernDropdown
        label="Sports Activity"
        value={preferences.preferred_sports_activity_id}
        items={(lifestyleInterests.sportsActivities || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_sports_activity_id", value)
        }
        placeholder="Select sports activity (optional)"
      />

      <ModernDropdown
        label="Sleep Habit"
        value={preferences.preferred_sleep_habit_id}
        items={(personalAttributes.sleepHabits || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_sleep_habit_id", value)}
        placeholder="Select sleep habit (optional)"
      />

      <View style={styles.chipSelectorContainer}>
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>Pets</Text>
          {preferences.preferred_pets_id?.length > 0 && (
            <TouchableOpacity
              onPress={() => onChange("preferred_pets_id", [])}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <MultiSelectChips
          items={(lifestyleInterests.pets || []).map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          selectedItems={preferences.preferred_pets_id || []}
          onSelectItem={(items) => onChange("preferred_pets_id", items)}
        />
      </View>

      <ModernDropdown
        label="Religiosity Level"
        value={preferences.preferred_religiosity_level_id}
        items={(religiosityLevels || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_religiosity_level_id", value)
        }
        placeholder="Select religiosity level (optional)"
      />

      <TouchableOpacity
        style={[
          styles.completeSectionButton,
          hasSmokingError && { backgroundColor: "#ccc" },
        ]}
        onPress={handleCompleteSection}
      >
        <Text style={styles.completeSectionButtonText}>
          Save & Complete This Section
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(LifestyleSection);
