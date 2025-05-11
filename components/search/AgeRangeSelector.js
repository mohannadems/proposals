import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import COLORS from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext"; // Make sure the path is correct

// Age presets will be defined as a function to support translation
const getAgePresets = (labels) => [
  { label: labels.young || "Young (18-25)", min: 18, max: 25 },
  { label: labels.mid || "Mid (26-35)", min: 26, max: 35 },
  { label: labels.mature || "Mature (36-45)", min: 36, max: 45 },
  { label: labels.senior || "Senior (46-70)", min: 46, max: 70 },
  { label: labels.allAges || "All Ages", min: 18, max: 70 },
];

const AgeRangeSelector = ({
  minAge,
  maxAge,
  onChange,
  isFilterDisabled,
  isMaxFiltersSelected,
  // Remove isRTL prop and use context instead
  labelText = "Age Range",
  minAgeLabel = "Min Age",
  maxAgeLabel = "Max Age",
  clearLabel = "Clear",
  toLabel = "to",
  presetLabels = {
    young: "Young (18-25)",
    mid: "Mid (26-35)",
    mature: "Mature (36-45)",
    senior: "Senior (46-70)",
    allAges: "All Ages",
  },
}) => {
  // Get isRTL from context instead of props
  const { isRTL } = useContext(LanguageContext);

  // Get localized age presets
  const AGE_PRESETS = getAgePresets(presetLabels);

  const getActivePresetIndex = () => {
    return AGE_PRESETS.findIndex(
      (preset) => preset.min === minAge && preset.max === maxAge
    );
  };

  const handlePresetPress = (preset) => {
    const isCustomRange = minAge !== 18 || maxAge !== 70;
    const isDefaultRange = preset.min === 18 && preset.max === 70;

    if (isMaxFiltersSelected && !isCustomRange && !isDefaultRange) {
      return;
    }

    onChange(preset.min, preset.max);
  };

  const handleSliderChange = (values) => {
    const isCustomRange = minAge !== 18 || maxAge !== 70;
    const isDefaultRange = values[0] === 18 && values[1] === 70;

    if (isMaxFiltersSelected && !isCustomRange && !isDefaultRange) {
      return;
    }

    onChange(values[0], values[1]);
  };

  const activePresetIndex = getActivePresetIndex();
  const isAgeFilterActive = minAge !== 18 || maxAge !== 70;

  return (
    <View
      style={[styles.container, isFilterDisabled && styles.containerDisabled]}
    >
      <View
        style={[
          styles.headerContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
          {labelText}
        </Text>
        {isAgeFilterActive && !isFilterDisabled && (
          <TouchableOpacity
            onPress={() => onChange(18, 70)}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>{clearLabel}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.displayContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.ageDisplay}>
          <Text style={styles.ageValue}>{minAge}</Text>
          <Text style={styles.ageLabel}>{minAgeLabel}</Text>
        </View>

        <View style={styles.ageSeparator}>
          <Text style={styles.ageSeparatorText}>{toLabel}</Text>
        </View>

        <View style={styles.ageDisplay}>
          <Text style={styles.ageValue}>{maxAge}</Text>
          <Text style={styles.ageLabel}>{maxAgeLabel}</Text>
        </View>
      </View>

      <View style={styles.presetsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.presetScroll,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
          // Do not transform the scroll view itself
        >
          {AGE_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.presetButton,
                {
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                },
                index === activePresetIndex && styles.activePresetButton,
                isFilterDisabled && styles.disabledPresetButton,
              ]}
              onPress={() => handlePresetPress(preset)}
              disabled={isFilterDisabled}
            >
              <Text
                style={[
                  styles.presetText,
                  index === activePresetIndex && styles.activePresetText,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sliderContainer}>
        {/* 
          Fix for RTL mode: Instead of using transform, which causes issues with the multi-slider,
          we'll invert the min/max values and the slider values when in RTL mode.
          This approach ensures the slider behaves correctly in both LTR and RTL modes.
        */}
        <MultiSlider
          values={
            isRTL ? [70 - maxAge + 18, 70 - minAge + 18] : [minAge, maxAge]
          }
          min={18}
          max={70}
          step={1}
          allowOverlap={false}
          snapped
          onValuesChange={(values) => {
            if (isRTL) {
              // Convert the RTL values back to LTR values
              const rtlMin = 70 - values[1] + 18;
              const rtlMax = 70 - values[0] + 18;
              handleSliderChange([rtlMin, rtlMax]);
            } else {
              handleSliderChange(values);
            }
          }}
          selectedStyle={styles.sliderTrackSelected}
          unselectedStyle={styles.sliderTrackUnselected}
          markerStyle={styles.sliderMarker}
          trackStyle={styles.sliderTrack}
          containerStyle={styles.sliderInnerContainer}
          sliderLength={280}
          enabledOne={!isFilterDisabled}
          enabledTwo={!isFilterDisabled}
        />
      </View>

      <View
        style={[
          styles.ticksContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {/* Adjust tick labels for RTL */}
        <Text style={styles.tickLabel}>{isRTL ? "70" : "18"}</Text>
        <Text style={styles.tickLabel}>{isRTL ? "60" : "30"}</Text>
        <Text style={styles.tickLabel}>{isRTL ? "45" : "45"}</Text>
        <Text style={styles.tickLabel}>{isRTL ? "30" : "60"}</Text>
        <Text style={styles.tickLabel}>{isRTL ? "18" : "70"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  headerContainer: {
    flexDirection: "row", // Will be overridden in render
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    // textAlign will be set in render
  },
  clearButton: {
    backgroundColor: "rgba(74, 111, 161, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  displayContainer: {
    flexDirection: "row", // Will be overridden in render
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  ageDisplay: {
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 12,
    width: 90,
  },
  ageValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  ageLabel: {
    fontSize: 12,
    color: "#666",
  },
  ageSeparator: {
    marginHorizontal: 12,
  },
  ageSeparatorText: {
    color: "#999",
    fontSize: 14,
  },
  presetsContainer: {
    marginBottom: 20,
  },
  presetScroll: {
    paddingVertical: 4,
    // flexDirection will be set in render
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // margins will be set in render
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "#FFFFFF",
  },
  activePresetButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  disabledPresetButton: {
    backgroundColor: "#F5F7FA",
    borderColor: "#E5E5E5",
  },
  presetText: {
    fontSize: 14,
    color: "#555",
  },
  activePresetText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  sliderContainer: {
    alignItems: "center",
    height: 40,
  },
  sliderInnerContainer: {
    height: 40,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  sliderTrackSelected: {
    backgroundColor: COLORS.primary,
  },
  sliderTrackUnselected: {
    backgroundColor: "#DDE1E6",
  },
  sliderMarker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  ticksContainer: {
    flexDirection: "row", // Will be overridden in render
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 4,
  },
  tickLabel: {
    fontSize: 12,
    color: "#999",
  },
});

export default AgeRangeSelector;
