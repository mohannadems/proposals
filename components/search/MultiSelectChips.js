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
      animatedValues: props.items.map(() => new Animated.Value(0)),
    };
  }

  componentDidMount() {
    // Animate chips in when component mounts
    this.animateChipsIn();
  }

  animateChipsIn = () => {
    const animations = this.state.animatedValues.map((anim, index) => {
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
  animateChipSelect = (index) => {
    Animated.sequence([
      Animated.timing(this.state.animatedValues[index], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  handleToggleItem = (id, index) => {
    const { selectedItems, onSelectItem } = this.props;
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

    this.animateChipSelect(index);
    onSelectItem(newSelectedItems);
  };

  render() {
    const { items, selectedItems } = this.props;

    // Convert selectedItems to a Set for easier checking
    const selectedSet = new Set(selectedItems || []);

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {items.map((item, index) => {
          const isSelected = selectedSet.has(item.id);

          // Scale animation for each chip
          const scale = this.state.animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          // Opacity animation for each chip
          const opacity = this.state.animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });

          return (
            <Animated.View
              key={item.id}
              style={{
                transform: [{ scale }],
                opacity,
              }}
            >
              <TouchableOpacity
                style={[styles.chip, isSelected && styles.selectedChip]}
                onPress={() => this.handleToggleItem(item.id, index)}
                activeOpacity={0.7}
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
