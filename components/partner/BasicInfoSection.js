import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import ModernDropdown from "../../components/search/ModernDropdown";
import RangeSlider from "../../components/search/RangeSlider";
import SectionHeader from "../../components/search/SectionHeader"; // Import the new SectionHeader component
import { createSearchStyles } from "../../styles/SearchScreen";

const AGE_RANGE_PRESETS = [
  { label: "18-25", min: 18, max: 25 },
  { label: "26-35", min: 26, max: 35 },
  { label: "36-45", min: 36, max: 45 },
  { label: "46-60", min: 46, max: 60 },
  { label: "All Ages", min: 18, max: 70 },
];

const BasicInfoFilterSection = ({
  t,
  isRTL,
  preferences,
  geographic,
  personalAttributes,
  cities,
  handlePreferenceChange,
  handleAgeRangePreset,
  isFilterDisabled,
  isMaxFiltersSelected,
  getPresetLabel,
  styles: propStyles,
  sectionRef,
}) => {
  const styles = propStyles || createSearchStyles(isRTL);
  return (
    <View style={styles.sectionCard}>
      <SectionHeader
        title={t ? t("search.sections.basic.title") : "Basic Information"}
        forwardRef={sectionRef}
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.basic_info.nationality") : "Nationality"}
        value={preferences.preferred_nationality_id}
        items={
          geographic?.nationalities?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || []
        }
        onValueChange={(value) =>
          handlePreferenceChange("preferred_nationality_id", value)
        }
        placeholder={
          t
            ? t("search.basic_info.select_nationality")
            : "Select nationality (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled?.("preferred_nationality_id")}
        containerStyle={
          isFilterDisabled?.("preferred_nationality_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.basic_info.origin") : "Origin"}
        value={preferences.preferred_origin_id}
        items={
          personalAttributes.origins?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || []
        }
        onValueChange={(value) =>
          handlePreferenceChange("preferred_origin_id", value)
        }
        placeholder={
          t ? t("search.basic_info.select_origin") : "Select origin (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_origin_id")}
        containerStyle={
          isFilterDisabled("preferred_origin_id") ? styles.disabledFilter : null
        }
      />

      <ModernDropdown
        label={t ? t("search.basic_info.country") : "Country"}
        value={preferences.preferred_country_id}
        items={
          geographic.countries?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || []
        }
        onValueChange={(value) =>
          handlePreferenceChange("preferred_country_id", value)
        }
        placeholder={
          t
            ? t("search.basic_info.select_country")
            : "Select country (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_country_id")}
        containerStyle={
          isFilterDisabled("preferred_country_id")
            ? styles.disabledFilter
            : null
        }
      />

      {preferences.preferred_country_id && cities && cities.length > 0 && (
        <ModernDropdown
          label={t ? t("search.basic_info.city") : "City"}
          value={preferences.preferred_city_id}
          items={cities.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) =>
            handlePreferenceChange("preferred_city_id", value)
          }
          placeholder={
            t ? t("search.basic_info.select_city") : "Select city (optional)"
          }
          isRTL={isRTL}
          disabled={isFilterDisabled("preferred_city_id")}
          containerStyle={
            isFilterDisabled("preferred_city_id") ? styles.disabledFilter : null
          }
        />
      )}

      <View
        style={[
          styles.ageRangeContainer,
          isFilterDisabled("preferred_age_min") ? styles.disabledFilter : null,
        ]}
      >
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
                disabled={isFilterDisabled("preferred_age_min")}
              >
                <Text
                  style={[
                    styles.agePresetText,
                    preferences.preferred_age_min === preset.min &&
                      preferences.preferred_age_max === preset.max &&
                      styles.activeAgePresetText,
                  ]}
                >
                  {getPresetLabel(preset.min, preset.max)}
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
            const isAgeFilterAlreadySet =
              preferences.preferred_age_min !== 18 ||
              preferences.preferred_age_max !== 70;
            const wouldBeNewFilter =
              !isAgeFilterAlreadySet && (low !== 18 || high !== 70);

            if (isMaxFiltersSelected && wouldBeNewFilter) {
              Alert.alert(
                t ? t("search.max_filters.title") : "Maximum Filters Reached",
                t
                  ? t("search.max_filters.message")
                  : "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
                [{ text: t ? t("common.ok") : "OK" }]
              );
              return;
            }

            handlePreferenceChange("preferred_age_min", low);
            handlePreferenceChange("preferred_age_max", high);
          }}
          isRTL={isRTL}
          disabled={isFilterDisabled("preferred_age_min")}
        />
      </View>
    </View>
  );
};

export default BasicInfoFilterSection;
import React from "react";
