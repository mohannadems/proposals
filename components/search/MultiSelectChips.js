import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { COLORS } from "../../constants/colors";

class MultiSelectChips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedValues: {},
    };
  }

  componentDidMount() {
    this.initializeAnimatedValues();
  }

  componentDidUpdate(prevProps) {
    // Check if items array has changed
    if (prevProps.items !== this.props.items) {
      this.initializeAnimatedValues();
    }
  }

  initializeAnimatedValues = () => {
    const { items } = this.props;
    const animatedValues = { ...this.state.animatedValues };

    // Create animated values for new items
    items.forEach((item) => {
      if (!animatedValues[item.id]) {
        animatedValues[item.id] = new Animated.Value(0);
      }
    });

    this.setState({ animatedValues }, this.animateChipsIn);
  };

  animateChipsIn = () => {
    const { items } = this.props;
    const animations = items.map((item, index) => {
      const anim = this.state.animatedValues[item.id];
      return Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      });
    });

    Animated.stagger(50, animations).start();
  };

  // Animate a single chip when selected/deselected
  animateChipSelect = (id) => {
    const anim = this.state.animatedValues[id];

    if (anim) {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  handleToggleItem = (id) => {
    const { selectedItems, onSelectItem, disabled } = this.props;

    if (disabled) {
      return;
    }

    let newSelectedItems;

    // Convert to Set for easier operations if array
    const selectedSet = new Set(selectedItems || []);

    if (selectedSet.has(id)) {
      // Remove item if already selected
      selectedSet.delete(id);
      newSelectedItems = Array.from(selectedSet);
    } else {
      // Add item if not selected
      newSelectedItems = [...(selectedItems || []), id];
    }

    this.animateChipSelect(id);
    onSelectItem(newSelectedItems);
  };

  render() {
    const { items, selectedItems, isRTL, disabled } = this.props;
    const { animatedValues } = this.state;

    // Convert selectedItems to a Set for easier checking
    const selectedSet = new Set(selectedItems || []);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          isRTL && styles.containerRTL,
          disabled && styles.disabledContainer,
        ]}
      >
        {items.map((item) => {
          const isSelected = selectedSet.has(item.id);
          const animValue = animatedValues[item.id] || new Animated.Value(1);

          // Scale animation for each chip
          const scale = animValue.interpolate({
            inputRange: [0, 1, 1.1],
            outputRange: [0.8, 1, 1.1],
          });

          // Opacity animation for each chip
          const opacity = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale }],
                opacity: disabled ? 0.5 : opacity,
              }}
            >
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.selectedChip]}
                onPress={() => this.handleToggleItem(item.id)}
                activeOpacity={0.7}
                disabled={disabled}
              >
                {isSelected && (
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkIconText}>✓</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.selectedChipText,
                    isRTL && styles.textRTL,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingVertical: 8,
  },
  containerRTL: {
    flexDirection: "row-reverse",
  },
  disabledContainer: {
    opacity: 0.6,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginRight: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedChip: {
    backgroundColor: COLORS.lightPrimary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedChipText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  textRTL: {
    textAlign: "right",
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  checkIconText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default MultiSelectChips;
