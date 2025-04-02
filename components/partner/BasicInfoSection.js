import React, { memo, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import createSearchStyles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";
import RangeSlider from "../search/RangeSlider";
import { selectCities } from "../../store/slices/profileAttributesSlice";

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
  isRTL = false,
  t,
}) => {
  const styles = createSearchStyles(isRTL);

  const cities = useSelector(selectCities);

  useEffect(() => {
    console.log(
      `Cities available for country ${preferences.preferred_country_id}:`,
      cities
    );
  }, [cities, preferences.preferred_country_id]);

  const handleAgeRangePreset = (min, max) => {
    onChange("preferred_age_min", min);
    onChange("preferred_age_max", max);
  };

  const getPresetLabel = (preset) => {
    if (!t) return preset.label;

    if (preset.label === "All Ages") {
      return t("search.age_ranges.all_ages");
    }
    return preset.label;
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          {t
            ? t("search.basic_info.description")
            : "Tell us about the basic attributes you're looking for in a partner"}
        </Text>
      </View>

      <ModernDropdown
        label={t ? t("search.basic_info.nationality") : "Nationality"}
        value={preferences.preferred_nationality_id}
        items={geographic.nationalities.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_nationality_id", value)}
        placeholder={
          t
            ? t("search.basic_info.select_nationality")
            : "Select nationality (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.basic_info.origin") : "Origin"}
        value={preferences.preferred_origin_id}
        items={personalAttributes.origins.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_origin_id", value)}
        placeholder={
          t ? t("search.basic_info.select_origin") : "Select origin (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.basic_info.country") : "Country"}
        value={preferences.preferred_country_id}
        items={geographic.countries.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_country_id", value)}
        placeholder={
          t
            ? t("search.basic_info.select_country")
            : "Select country (optional)"
        }
        isRTL={isRTL}
      />

      {preferences.preferred_country_id && cities && cities.length > 0 && (
        <ModernDropdown
          label={t ? t("search.basic_info.city") : "City"}
          value={preferences.preferred_city_id}
          items={cities.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) => onChange("preferred_city_id", value)}
          placeholder={
            t ? t("search.basic_info.select_city") : "Select city (optional)"
          }
          isRTL={isRTL}
        />
      )}

      <View style={styles.ageRangeContainer}>
        <Text style={styles.inputLabel}>
          {t ? t("search.basic_info.age_range") : "Age Range"}
        </Text>
        <Text style={styles.ageRangeDisplay}>
          {preferences.preferred_age_min} - {preferences.preferred_age_max}{" "}
          {t ? t("search.basic_info.years") : "years"}
        </Text>

        <View style={styles.agePresets}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
          >
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
                  {getPresetLabel(preset)}
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
          isRTL={isRTL}
        />
      </View>

      <TouchableOpacity
        style={styles.completeSectionButton}
        onPress={onComplete}
      >
        <Text style={styles.completeSectionButtonText}>
          {t
            ? t("search.basic_info.save_complete")
            : "Save & Complete This Section"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(BasicInfoSection);
