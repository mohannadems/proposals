import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import COLORS from "../../constants/colors";
const AGE_PRESETS = [
  { label: "Young (18-25)", min: 18, max: 25 },
  { label: "Mid (26-35)", min: 26, max: 35 },
  { label: "Mature (36-45)", min: 36, max: 45 },
  { label: "Senior (46-70)", min: 46, max: 70 },
  { label: "All Ages", min: 18, max: 70 },
];

const AgeRangeSelector = ({
  minAge,
  maxAge,
  onChange,
  isFilterDisabled,
  isMaxFiltersSelected,
  isRTL,
}) => {
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
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Age Range</Text>
        {isAgeFilterActive && !isFilterDisabled && (
          <TouchableOpacity
            onPress={() => onChange(18, 70)}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.displayContainer}>
        <View style={styles.ageDisplay}>
          <Text style={styles.ageValue}>{minAge}</Text>
          <Text style={styles.ageLabel}>Min Age</Text>
        </View>

        <View style={styles.ageSeparator}>
          <Text style={styles.ageSeparatorText}>to</Text>
        </View>

        <View style={styles.ageDisplay}>
          <Text style={styles.ageValue}>{maxAge}</Text>
          <Text style={styles.ageLabel}>Max Age</Text>
        </View>
      </View>

      <View style={styles.presetsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetScroll}
        >
          {AGE_PRESETS.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.presetButton,
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
        <MultiSlider
          values={[minAge, maxAge]}
          min={18}
          max={70}
          step={1}
          allowOverlap={false}
          snapped
          onValuesChange={(values) => handleSliderChange(values)}
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

      <View style={styles.ticksContainer}>
        <Text style={styles.tickLabel}>18</Text>
        <Text style={styles.tickLabel}>30</Text>
        <Text style={styles.tickLabel}>45</Text>
        <Text style={styles.tickLabel}>60</Text>
        <Text style={styles.tickLabel}>70</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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
    flexDirection: "row",
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
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
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
    flexDirection: "row",
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
