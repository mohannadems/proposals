import React, { memo, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import styles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";
import RangeSlider from "../search/RangeSlider";
import { selectCities } from "../../store/slices/profileAttributesSlice";

// Age range presets for easier selection
const AGE_RANGE_PRESETS = [
  { label: "18-25", min: 18, max: 25 },
  { label: "26-35", min: 26, max: 35 },
  { label: "36-45", min: 36, max: 45 },
  { label: "46-60", min: 46, max: 60 },
  { label: "All Ages", min: 18, max: 70 },
];

const BasicInfoSection = ({
  preferences,
  onChange,
  geographic,
  personalAttributes,
  onComplete,
}) => {
  // Get cities directly from the store
  const cities = useSelector(selectCities);

  // Log cities for debugging
  useEffect(() => {
    console.log(
      `Cities available for country ${preferences.preferred_country_id}:`,
      cities
    );
  }, [cities, preferences.preferred_country_id]);

  // Handle age range preset selection
  const handleAgeRangePreset = (min, max) => {
    onChange("preferred_age_min", min);
    onChange("preferred_age_max", max);
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          Tell us about the basic attributes you're looking for in a partner
        </Text>
      </View>

      <ModernDropdown
        label="Nationality"
        value={preferences.preferred_nationality_id}
        items={geographic.nationalities.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_nationality_id", value)}
        placeholder="Select nationality (optional)"
      />

      <ModernDropdown
        label="Origin"
        value={preferences.preferred_origin_id}
        items={personalAttributes.origins.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_origin_id", value)}
        placeholder="Select origin (optional)"
      />

      <ModernDropdown
        label="Country"
        value={preferences.preferred_country_id}
        items={geographic.countries.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_country_id", value)}
        placeholder="Select country (optional)"
      />

      {preferences.preferred_country_id && cities && cities.length > 0 && (
        <ModernDropdown
          label="City"
          value={preferences.preferred_city_id}
          items={cities.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) => onChange("preferred_city_id", value)}
          placeholder="Select city (optional)"
        />
      )}

      <View style={styles.ageRangeContainer}>
        <Text style={styles.inputLabel}>Age Range</Text>
        <Text style={styles.ageRangeDisplay}>
          {preferences.preferred_age_min} - {preferences.preferred_age_max}{" "}
          years
        </Text>

        <View style={styles.agePresets}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {AGE_RANGE_PRESETS.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.agePresetButton,
                  preferences.preferred_age_min === preset.min &&
                    preferences.preferred_age_max === preset.max &&
                    styles.activeAgePreset,
                ]}
                onPress={() => handleAgeRangePreset(preset.min, preset.max)}
              >
                <Text
                  style={[
                    styles.agePresetText,
                    preferences.preferred_age_min === preset.min &&
                      preferences.preferred_age_max === preset.max &&
                      styles.activeAgePresetText,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <RangeSlider
          minValue={18}
          maxValue={70}
          initialLowValue={preferences.preferred_age_min}
          initialHighValue={preferences.preferred_age_max}
          onValueChange={(low, high) => {
            onChange("preferred_age_min", low);
            onChange("preferred_age_max", high);
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.completeSectionButton}
        onPress={onComplete}
      >
        <Text style={styles.completeSectionButtonText}>
          Save & Complete This Section
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BasicInfoSection);
