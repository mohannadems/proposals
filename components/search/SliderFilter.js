// components/SliderFilter.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PRESET_RANGES = [
  { label: "18-25", min: 18, max: 25 },
  { label: "25-35", min: 25, max: 35 },
  { label: "35-45", min: 35, max: 45 },
  { label: "45+", min: 45, max: 65 },
];

const SliderFilter = ({
  title,
  minValue = 0,
  maxValue = 100,
  startValue = 0,
  endValue = 100,
  onValueChange,
}) => {
  const [sliderWidth, setSliderWidth] = useState(1);
  const [startPosition, setStartPosition] = useState(new Animated.Value(0));
  const [endPosition, setEndPosition] = useState(new Animated.Value(0));
  const [startVal, setStartVal] = useState(startValue);
  const [endVal, setEndVal] = useState(endValue);
  const [activeBubble, setActiveBubble] = useState(null);

  useEffect(() => {
    // Set initial positions based on values
    const initialStartPosition =
      ((startValue - minValue) / (maxValue - minValue)) * sliderWidth;
    const initialEndPosition =
      ((endValue - minValue) / (maxValue - minValue)) * sliderWidth;

    startPosition.setValue(initialStartPosition);
    endPosition.setValue(initialEndPosition);
  }, [sliderWidth, startValue, endValue, minValue, maxValue]);

  // Animated values for smooth label transitions
  const minLabelScale = useState(new Animated.Value(1))[0];
  const maxLabelScale = useState(new Animated.Value(1))[0];

  // Animate labels when dragging
  const animateLabel = (isStart, isDragging) => {
    Animated.spring(
      isDragging
        ? isStart
          ? minLabelScale
          : maxLabelScale
        : isStart
        ? minLabelScale
        : maxLabelScale,
      {
        toValue: isDragging ? 1.2 : 1,
        friction: 5,
        useNativeDriver: true,
      }
    ).start();
  };

  const startPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      animateLabel(true, true);
      setActiveBubble("start");
    },
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.dx + startPosition._value;

      // Constrain to slider bounds and don't go past end thumb
      newPosition = Math.max(0, newPosition);
      newPosition = Math.min(endPosition._value - 20, newPosition);

      startPosition.setValue(newPosition);

      // Calculate and update the value
      const newStartValue = Math.round(
        (newPosition / sliderWidth) * (maxValue - minValue) + minValue
      );

      // Only update if value changed
      if (newStartValue !== startVal) {
        setStartVal(newStartValue);
        if (onValueChange) {
          onValueChange(newStartValue, endVal);
        }
      }
    },
    onPanResponderRelease: () => {
      // Save the current position for the next gesture
      startPosition.setOffset(0);
      startPosition.setValue(startPosition._value);
      animateLabel(true, false);
      setTimeout(() => setActiveBubble(null), 1000);
    },
  });

  const endPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      animateLabel(false, true);
      setActiveBubble("end");
    },
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.dx + endPosition._value;

      // Constrain to slider bounds and don't go before start thumb
      newPosition = Math.min(sliderWidth, newPosition);
      newPosition = Math.max(startPosition._value + 20, newPosition);

      endPosition.setValue(newPosition);

      // Calculate and update the value
      const newEndValue = Math.round(
        (newPosition / sliderWidth) * (maxValue - minValue) + minValue
      );

      // Only update if value changed
      if (newEndValue !== endVal) {
        setEndVal(newEndValue);
        if (onValueChange) {
          onValueChange(startVal, newEndValue);
        }
      }
    },
    onPanResponderRelease: () => {
      // Save the current position for the next gesture
      endPosition.setOffset(0);
      endPosition.setValue(endPosition._value);
      animateLabel(false, false);
      setTimeout(() => setActiveBubble(null), 1000);
    },
  });

  // Function to set preset range
  const setPresetRange = (min, max) => {
    setStartVal(min);
    setEndVal(max);

    // Calculate new positions
    const newStartPosition =
      ((min - minValue) / (maxValue - minValue)) * sliderWidth;
    const newEndPosition =
      ((max - minValue) / (maxValue - minValue)) * sliderWidth;

    // Use animation for smooth transition
    Animated.parallel([
      Animated.spring(startPosition, {
        toValue: newStartPosition,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(endPosition, {
        toValue: newEndPosition,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();

    if (onValueChange) {
      onValueChange(min, max);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.valueDisplay}>
          <Animated.View
            style={[
              styles.valueContainer,
              activeBubble === "start" && styles.activeValueContainer,
              { transform: [{ scale: minLabelScale }] },
            ]}
          >
            <Text style={styles.valueText}>{startVal}</Text>
          </Animated.View>

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.toText}>to</Text>
            <View style={styles.separator} />
          </View>

          <Animated.View
            style={[
              styles.valueContainer,
              activeBubble === "end" && styles.activeValueContainer,
              { transform: [{ scale: maxLabelScale }] },
            ]}
          >
            <Text style={styles.valueText}>{endVal}</Text>
          </Animated.View>
        </View>
      </View>

      {/* Quick selection buttons */}
      <View style={styles.presetContainer}>
        {PRESET_RANGES.map((range, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.presetButton,
              startVal === range.min &&
                endVal === range.max &&
                styles.presetButtonActive,
            ]}
            onPress={() => setPresetRange(range.min, range.max)}
          >
            <Text
              style={[
                styles.presetButtonText,
                startVal === range.min &&
                  endVal === range.max &&
                  styles.presetButtonTextActive,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom slider */}
      <View
        style={styles.sliderContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
      >
        <View style={styles.track}>
          {/* Age marker lines */}
          {[20, 30, 40, 50, 60].map((age) => (
            <View
              key={age}
              style={[
                styles.markerLine,
                {
                  left: `${((age - minValue) / (maxValue - minValue)) * 100}%`,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View
          style={[
            styles.selectedTrack,
            {
              left: startPosition,
              right: sliderWidth - endPosition,
            },
          ]}
        />

        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: startPosition }],
              backgroundColor:
                activeBubble === "start" ? COLORS.primary : "#FFFFFF",
            },
          ]}
          {...startPanResponder.panHandlers}
        >
          <View
            style={[
              styles.thumbInner,
              activeBubble === "start" && styles.thumbInnerActive,
            ]}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: endPosition }],
              backgroundColor:
                activeBubble === "end" ? COLORS.primary : "#FFFFFF",
            },
          ]}
          {...endPanResponder.panHandlers}
        >
          <View
            style={[
              styles.thumbInner,
              activeBubble === "end" && styles.thumbInnerActive,
            ]}
          />
        </Animated.View>
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{minValue}</Text>
        <Text style={styles.rangeLabel}>Age Range</Text>
        <Text style={styles.rangeLabel}>{maxValue}</Text>
      </View>

      <View style={styles.helpTextContainer}>
        <Ionicons name="information-circle-outline" size={16} color="#888" />
        <Text style={styles.helpText}>
          Drag the sliders to set your preferred age range
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
  },
  valueDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    backgroundColor: "rgba(158, 8, 108, 0.08)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    minWidth: 50,
    alignItems: "center",
  },
  activeValueContainer: {
    backgroundColor: "rgba(158, 8, 108, 0.15)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    width: 10,
    backgroundColor: "#DDD",
  },
  toText: {
    fontSize: 14,
    color: "#777",
    marginHorizontal: 6,
  },

  // Preset buttons
  presetContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  presetButton: {
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    minWidth: 70,
    alignItems: "center",
  },
  presetButtonActive: {
    backgroundColor: COLORS.primary,
  },
  presetButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#555",
  },
  presetButtonTextActive: {
    color: "#FFFFFF",
  },

  // Slider
  sliderContainer: {
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    position: "relative",
  },
  markerLine: {
    position: "absolute",
    height: 10,
    width: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    top: -2,
  },
  selectedTrack: {
    height: 6,
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: 17,
    borderRadius: 3,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 6,
    marginLeft: -14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  thumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  thumbInnerActive: {
    backgroundColor: "#FFFFFF",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#888",
  },
  helpTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 8,
  },
  helpText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 6,
  },
});

export default SliderFilter;
