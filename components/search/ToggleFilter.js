// components/search/ToggleFilter.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { COLORS } from "../../constants/colors";

class ToggleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: props.value || false,
    };

    this.thumbPosition = new Animated.Value(props.value ? 1 : 0);
    this.backgroundColorAnimation = new Animated.Value(props.value ? 1 : 0);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ isEnabled: this.props.value });
      Animated.parallel([
        Animated.timing(this.thumbPosition, {
          toValue: this.props.value ? 1 : 0,
          duration: 250,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false,
        }),
        Animated.timing(this.backgroundColorAnimation, {
          toValue: this.props.value ? 1 : 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }

  toggle = () => {
    const newState = !this.state.isEnabled;
    this.setState({ isEnabled: newState });
    this.props.onToggle(newState);

    Animated.parallel([
      Animated.timing(this.thumbPosition, {
        toValue: newState ? 1 : 0,
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
      Animated.timing(this.backgroundColorAnimation, {
        toValue: newState ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  render() {
    const { isEnabled } = this.state;

    // Interpolate thumb position
    const thumbLeft = this.thumbPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 32],
    });

    // Interpolate background color
    const backgroundColor = this.backgroundColorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(120, 120, 128, 0.16)", COLORS.primary],
    });

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.toggle}
          style={styles.touchableArea}
        >
          <Animated.View style={[styles.track, { backgroundColor }]}>
            <Animated.View style={[styles.thumb, { left: thumbLeft }]} />
          </Animated.View>
        </TouchableOpacity>

        <Text style={[styles.stateText, isEnabled && styles.stateTextActive]}>
          {isEnabled ? "Yes" : "No"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  touchableArea: {
    padding: 5,
  },
  track: {
    width: 60,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  stateText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  stateTextActive: {
    color: COLORS.primary,
  },
});

export default ToggleFilter;
