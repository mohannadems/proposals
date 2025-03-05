// components/SliderFilter.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, PanResponder, Animated } from "react-native";
import { COLORS } from "../../constants/colors";

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

  useEffect(() => {
    // Set initial positions based on values
    const initialStartPosition =
      ((startValue - minValue) / (maxValue - minValue)) * sliderWidth;
    const initialEndPosition =
      ((endValue - minValue) / (maxValue - minValue)) * sliderWidth;

    startPosition.setValue(initialStartPosition);
    endPosition.setValue(initialEndPosition);
  }, [sliderWidth, startValue, endValue, minValue, maxValue]);

  const startPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.dx + startPosition._value;

      // Constrain to slider bounds and don't go past end thumb
      newPosition = Math.max(0, newPosition);
      newPosition = Math.min(endPosition._value - 15, newPosition);

      startPosition.setValue(newPosition);

      // Calculate and update the value
      const newStartValue = Math.round(
        (newPosition / sliderWidth) * (maxValue - minValue) + minValue
      );
      setStartVal(newStartValue);

      if (onValueChange) {
        onValueChange(newStartValue, endVal);
      }
    },
    onPanResponderRelease: () => {
      // Save the current position for the next gesture
      startPosition.setOffset(0);
      startPosition.setValue(startPosition._value);
    },
  });

  const endPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.dx + endPosition._value;

      // Constrain to slider bounds and don't go before start thumb
      newPosition = Math.min(sliderWidth, newPosition);
      newPosition = Math.max(startPosition._value + 15, newPosition);

      endPosition.setValue(newPosition);

      // Calculate and update the value
      const newEndValue = Math.round(
        (newPosition / sliderWidth) * (maxValue - minValue) + minValue
      );
      setEndVal(newEndValue);

      if (onValueChange) {
        onValueChange(startVal, newEndValue);
      }
    },
    onPanResponderRelease: () => {
      // Save the current position for the next gesture
      endPosition.setOffset(0);
      endPosition.setValue(endPosition._value);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.valueDisplay}>
        <Text style={styles.valueText}>{startVal}</Text>
        <Text style={styles.toText}>to</Text>
        <Text style={styles.valueText}>{endVal}</Text>
      </View>

      <View
        style={styles.sliderContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setSliderWidth(width);
        }}
      >
        <View style={styles.track} />

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
            },
          ]}
          {...startPanResponder.panHandlers}
        >
          <View style={styles.thumbInner} />
        </Animated.View>

        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: endPosition }],
            },
          ]}
          {...endPanResponder.panHandlers}
        >
          <View style={styles.thumbInner} />
        </Animated.View>
      </View>

      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{minValue}</Text>
        <Text style={styles.rangeLabel}>{maxValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
    marginBottom: 20,
  },
  valueDisplay: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  valueText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    backgroundColor: "rgba(158, 8, 108, 0.08)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  toText: {
    fontSize: 14,
    color: "#777",
    marginHorizontal: 8,
  },
  sliderContainer: {
    height: 30,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  selectedTrack: {
    height: 4,
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: 13,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    top: 4,
    marginLeft: -11,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  thumbInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#999",
  },
});

export default SliderFilter;
