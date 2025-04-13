import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider"; // Make sure to install this package
import { COLORS } from "../../constants/colors";

const RangeSlider = ({
  minValue,
  maxValue,
  initialLowValue,
  initialHighValue,
  onValueChange,
}) => {
  const [values, setValues] = useState([
    initialLowValue || minValue,
    initialHighValue || maxValue,
  ]);

  useEffect(() => {
    const newValues = [...values];
    let changed = false;

    if (initialLowValue !== undefined && initialLowValue !== values[0]) {
      newValues[0] = initialLowValue;
      changed = true;
    }

    if (initialHighValue !== undefined && initialHighValue !== values[1]) {
      newValues[1] = initialHighValue;
      changed = true;
    }

    if (changed) {
      setValues(newValues);
    }
  }, [initialLowValue, initialHighValue]);

  const handleValuesChange = (newValues) => {
    setValues(newValues);
    onValueChange(newValues[0], newValues[1]);
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
              {Math.round(values[0])}
            </Text>
          </View>
        </View>

        <View style={styles.valueIndicator}>
          <Text style={styles.valueIndicatorLabel}>Max</Text>
          <View style={styles.valueIndicatorBubble}>
            <Text style={styles.valueIndicatorText}>
              {Math.round(values[1])}
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

      <View style={styles.sliderContainer}>
        <MultiSlider
          values={values}
          min={minValue}
          max={maxValue}
          step={1}
          allowOverlap={false}
          snapped
          minMarkerOverlapDistance={10}
          onValuesChange={handleValuesChange}
          selectedStyle={{ backgroundColor: COLORS.primary }}
          unselectedStyle={{ backgroundColor: COLORS.divider }}
          markerStyle={{
            backgroundColor: COLORS.primary,
            height: 30,
            width: 30,
            borderRadius: 15,
          }}
          trackStyle={{
            height: 4,
          }}
          containerStyle={{
            height: 40,
          }}
        />
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
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
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
