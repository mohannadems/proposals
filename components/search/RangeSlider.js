import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider"; // Make sure to install this package
import { COLORS } from "../../constants/colors";

const RangeSlider = ({
  minValue,
  maxValue,
  initialLowValue,
  initialHighValue,
  onValueChange,
}) => {
  const [lowValue, setLowValue] = useState(initialLowValue || minValue);
  const [highValue, setHighValue] = useState(initialHighValue || maxValue);

  useEffect(() => {
    // Update the slider state if the props change from outside
    if (initialLowValue !== undefined) setLowValue(initialLowValue);
    if (initialHighValue !== undefined) setHighValue(initialHighValue);
  }, [initialLowValue, initialHighValue]);

  const handleLowValueChange = (value) => {
    // Ensure low doesn't exceed high
    const newLowValue = Math.min(Math.round(value), highValue - 1);
    setLowValue(newLowValue);
    onValueChange(newLowValue, highValue);
  };

  const handleHighValueChange = (value) => {
    // Ensure high doesn't go below low
    const newHighValue = Math.max(Math.round(value), lowValue + 1);
    setHighValue(newHighValue);
    onValueChange(lowValue, newHighValue);
  };

  // Calculate the percentage of the range for visual representation
  const getTrackMarkPositions = () => {
    const positions = [];
    const step = (maxValue - minValue) / 4; // 5 marks including min and max

    for (let i = 0; i <= 4; i++) {
      positions.push(minValue + step * i);
    }

    return positions;
  };

  const trackMarks = getTrackMarkPositions();

  return (
    <View style={styles.container}>
      <View style={styles.rangeInfoContainer}>
        <View style={styles.valueIndicator}>
          <Text style={styles.valueIndicatorLabel}>Min</Text>
          <View style={styles.valueIndicatorBubble}>
            <Text style={styles.valueIndicatorText}>
              {Math.round(lowValue)}
            </Text>
          </View>
        </View>

        <View style={styles.valueIndicator}>
          <Text style={styles.valueIndicatorLabel}>Max</Text>
          <View style={styles.valueIndicatorBubble}>
            <Text style={styles.valueIndicatorText}>
              {Math.round(highValue)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.trackMarksContainer}>
        {trackMarks.map((mark, index) => (
          <View key={index} style={styles.trackMarkContainer}>
            <View style={styles.trackMark} />
            <Text style={styles.trackMarkLabel}>{Math.round(mark)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.slidersContainer}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={1}
            value={lowValue}
            onValueChange={handleLowValueChange}
            minimumTrackTintColor={COLORS.divider}
            maximumTrackTintColor={COLORS.primary}
            thumbTintColor={COLORS.primary}
          />
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={1}
            value={highValue}
            onValueChange={handleHighValueChange}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.divider}
            thumbTintColor={COLORS.primary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  rangeInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  valueIndicator: {
    alignItems: "center",
  },
  valueIndicatorLabel: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  valueIndicatorBubble: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
  },
  valueIndicatorText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  slidersContainer: {
    marginTop: 10,
  },
  sliderContainer: {
    marginVertical: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  trackMarksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -10,
    paddingHorizontal: 10,
  },
  trackMarkContainer: {
    alignItems: "center",
    width: 30,
  },
  trackMark: {
    width: 1,
    height: 8,
    backgroundColor: COLORS.divider,
  },
  trackMarkLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 4,
  },
});

export default RangeSlider;

/* Note: 
   You'll need to install the slider package:
   npm install @react-native-community/slider
   or
   yarn add @react-native-community/slider
*/
