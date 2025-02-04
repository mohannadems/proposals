import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

const PopularRange = ({ label, range, emoji, isSelected, onSelect }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={() => onSelect(range)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.popularRange, isSelected && styles.popularRangeSelected]}
      >
        <LinearGradient
          colors={isSelected ? COLORS.primaryGradient : ["#fff", "#fff"]}
          style={styles.popularRangeGradient}
        >
          <Text style={styles.popularRangeEmoji}>{emoji}</Text>
          <Text
            style={[
              styles.popularRangeLabel,
              isSelected && styles.popularRangeLabelSelected,
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.popularRangeAge,
              isSelected && styles.popularRangeAgeSelected,
            ]}
          >
            {range.min}-{range.max}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ModernAgeRangeModal = ({ visible, onClose, currentRange, onSelect }) => {
  const defaultRange = { min: 18, max: 50 };
  const [range, setRange] = useState(currentRange || defaultRange);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const popularRanges = [
    { label: "Early 20s", range: { min: 18, max: 25 }, emoji: "✨" },
    { label: "Late 20s", range: { min: 25, max: 30 }, emoji: "💫" },
    { label: "Early 30s", range: { min: 30, max: 35 }, emoji: "⭐️" },
    { label: "Mid 30s+", range: { min: 35, max: 45 }, emoji: "🌟" },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalHeader}
          >
            <View>
              <Text style={styles.modalTitle}>Age Preference</Text>
              <Text style={styles.modalSubtitle}>
                Find your perfect match ✨
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.content}>
            <View style={styles.currentRange}>
              <Text style={styles.currentRangeLabel}>Selected Range</Text>
              <Text style={styles.currentRangeText}>
                {range.min} - {range.max}
              </Text>
              <Text style={styles.currentRangeSubtext}>years old</Text>
            </View>

            <View style={styles.sliderSection}>
              <View style={styles.sliderHeader}>
                <Text style={styles.sliderTitle}>Custom Range</Text>
                <Ionicons name="options" size={20} color={COLORS.primary} />
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabelContainer}>
                  <Text style={styles.sliderLabel}>Min Age: {range.min}</Text>
                  <Text style={styles.sliderLabel}>Max Age: {range.max}</Text>
                </View>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={range.max}
                  value={range.min}
                  onValueChange={(value) =>
                    setRange({ ...range, min: Math.round(value) })
                  }
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.primary}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={range.min}
                  maximumValue={80}
                  value={range.max}
                  onValueChange={(value) =>
                    setRange({ ...range, max: Math.round(value) })
                  }
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.border}
                  thumbTintColor={COLORS.primary}
                />
              </View>
            </View>

            <View style={styles.popularSection}>
              <View style={styles.popularHeader}>
                <Text style={styles.popularTitle}>Quick Select</Text>
                <Text style={styles.popularSubtitle}>Popular age ranges</Text>
              </View>
              <View style={styles.popularGrid}>
                {popularRanges.map((item, index) => (
                  <PopularRange
                    key={index}
                    label={item.label}
                    range={item.range}
                    emoji={item.emoji}
                    isSelected={
                      range.min === item.range.min &&
                      range.max === item.range.max
                    }
                    onSelect={setRange}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onSelect(range);
                onClose();
              }}
            >
              <LinearGradient
                colors={COLORS.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Set Age Range</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  modalSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 24,
  },
  currentRange: {
    alignItems: "center",
    marginBottom: 32,
  },
  currentRangeLabel: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginBottom: 8,
  },
  currentRangeText: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  currentRangeSubtext: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    marginTop: 4,
  },
  sliderSection: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  sliderLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  popularSection: {
    marginBottom: 24,
  },
  popularHeader: {
    marginBottom: 16,
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  popularSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginTop: 4,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  popularRange: {
    width: (width - 60) / 2,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popularRangeGradient: {
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  popularRangeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  popularRangeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  popularRangeLabelSelected: {
    color: COLORS.white,
  },
  popularRangeAge: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  popularRangeAgeSelected: {
    color: COLORS.white,
    opacity: 1,
  },
  applyButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  applyButtonGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default ModernAgeRangeModal;
