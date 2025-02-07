import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { Easing } from "react-native-reanimated";

import { useFormContext } from "react-hook-form";
import { PROFILE_DATA } from "../../../constants/profileData";
import SelectableGrid from "./SelectableGrid";
import FormDropdown from "../../common/FormDropdown";
import { COLORS } from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { FadeInRight } from "react-native-reanimated";
import Reanimated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
// Add these constants at the top of your file, before the component definitions
const HOBBY_ICONS = {
  Photography: "camera-outline",
  Gardening: "leaf-outline",
  Painting: "palette-outline",
  Cycling: "bicycle",
  Hiking: "compass-outline",
  Reading: "book-open-outline",
  Cooking: "food-variant",
  Music: "music-note-outline",
  Travel: "airplane",
  Gaming: "gamepad-variant-outline",
  Writing: "pencil-outline",
  Dancing: "dance-ballroom",
  Shopping: "shopping-outline",
  Sports: "basketball",
  Movies: "movie-outline",
};

const HOBBY_EMOJIS = {
  Photography: "📸",
  Gardening: "🌱",
  Painting: "🎨",
  Cycling: "🚴‍♂️",
  Hiking: "🏃‍♂️",
  Reading: "📚",
  Cooking: "👨‍🍳",
  Music: "🎵",
  Travel: "✈️",
  Gaming: "🎮",
  Writing: "✍️",
  Dancing: "💃",
  Shopping: "🛍️",
  Sports: "⚽",
  Movies: "🎬",
};

const PET_ICONS = {
  Cat: "cat",
  Dog: "dog",
  Bird: "duck",
  Fish: "fish",
  Hamster: "rodent",
  Rabbit: "rabbit",
  Reptile: "snake",
  Other: "paw",
};

const PET_EMOJIS = {
  Cat: "🐱",
  Dog: "🐕",
  Bird: "🦜",
  Fish: "🐠",
  Hamster: "🐹",
  Rabbit: "🐰",
  Reptile: "🦎",
  Other: "🐾",
};
// Enhanced animation configurations
const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 200,
};

const FADE_IN_CONFIG = {
  duration: 600,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

// Reusable animated components
const AnimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedText = Reanimated.createAnimatedComponent(Text);
// Enhanced CardHeader with animations and emojis
const CardHeader = ({ title, iconName, description, emoji }) => {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scaleValue.value, SPRING_CONFIG) }],
  }));

  return (
    <AnimatedView
      entering={FadeInDown.duration(600).springify()}
      style={[styles.cardHeader, animatedStyle]}
    >
      <View style={styles.cardHeaderContent}>
        <View style={styles.iconContainer}>
          <MaterialIcon
            name={iconName}
            size={30}
            color={COLORS.primary}
            style={styles.cardHeaderIcon}
          />
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.cardHeaderText}>
          <AnimatedText
            entering={FadeInRight.duration(800)}
            style={styles.cardTitle}
          >
            {title}
          </AnimatedText>
          <AnimatedText
            entering={FadeInRight.delay(200).duration(800)}
            style={styles.cardSubtitle}
          >
            {description}
          </AnimatedText>
        </View>
      </View>
    </AnimatedView>
  );
};

// Card wrapper component with animations
const AnimatedCard = ({ children, delay = 0 }) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, SPRING_CONFIG);
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedView
      style={[styles.card, animatedStyle]}
      entering={FadeInUp.delay(delay).duration(600).springify()}
    >
      {children}
    </AnimatedView>
  );
};
const LifestyleSection = () => {
  const { control, watch, setValue } = useFormContext();
  const smoking_status = watch("smoking_status");

  // Card configurations with emojis
  const cardConfigs = {
    origin: {
      title: "Origin & Residence",
      iconName: "public",
      description: "Roots and current home that shape you",
      emoji: "🌍",
    },
    preferences: {
      title: "Personal Preferences",
      iconName: "stars",
      description: "Your lifestyle choices and preferences",
      emoji: "✨",
    },
    physical: {
      title: "Physical Attributes",
      iconName: "accessibility",
      description: "Your unique physical characteristics",
      emoji: "💪",
    },
    hobbies: {
      title: "Hobbies & Interests",
      iconName: "interests",
      description: "Explore the passions that define you",
      emoji: "🎨",
    },
    lifestyle: {
      title: "Lifestyle Choices",
      iconName: "lifestyle",
      description: "Your personal preferences and habits",
      emoji: "🌟",
    },
    activity: {
      title: "Physical Activity",
      iconName: "fitness-center",
      description: "Your approach to health and wellness",
      emoji: "🏃‍♂️",
    },
    pets: {
      title: "Pets",
      iconName: "pets",
      description: "Your furry or feathered companions",
      emoji: "🐾",
    },
    spiritual: {
      title: "Spiritual Beliefs",
      iconName: "temple-buddhist",
      description: "Your spiritual perspective",
      emoji: "🙏",
    },
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <AnimatedView
        entering={FadeInDown.duration(800).springify()}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionEmoji}>✨</Text>
        <Text style={styles.sectionTitle}>Your Lifestyle Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Craft a vibrant portrait of your unique self 🌈
        </Text>
      </AnimatedView>

      <AnimatedCard delay={100}>
        <CardHeader {...cardConfigs.origin} />
        <AnimatedView
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.formContainer}
        >
          <FormDropdown
            control={control}
            name="nationality_id"
            label="Nationality 🌎"
            items={PROFILE_DATA.nationalities}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="flag" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />

          <FormDropdown
            control={control}
            name="country_of_residence_id"
            label="Country of Residence 📍"
            items={PROFILE_DATA.countries}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="map-pin" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />

          <FormDropdown
            control={control}
            name="city_id"
            label="City 🏙️"
            items={PROFILE_DATA.cities[watch("country_of_residence_id") || 1]}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="map" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />
        </AnimatedView>
      </AnimatedCard>

      {/* Personal Preferences Card */}
      <AnimatedCard delay={200}>
        <CardHeader {...cardConfigs.preferences} />
        <AnimatedView
          entering={FadeInUp.delay(300).duration(600)}
          style={styles.formContainer}
        >
          <FormDropdown
            control={control}
            name="marriage_budget_id"
            label="Marriage Budget 💍"
            items={PROFILE_DATA.marriageBudget}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon
                name="account-balance-wallet"
                size={20}
                color={COLORS.primary}
              />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />

          <FormDropdown
            control={control}
            name="sleep_habit_id"
            label="Sleep Habits 😴"
            items={PROFILE_DATA.sleep_habits}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon
                name="nightlight-round"
                size={20}
                color={COLORS.primary}
              />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />

          <FormDropdown
            control={control}
            name="religiosity_level_id"
            label="Religiosity Level 🕊️"
            items={PROFILE_DATA.religiosityLevels}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon name="person" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />
        </AnimatedView>
      </AnimatedCard>
      {/* Physical Attributes Card */}
      <AnimatedCard delay={300}>
        <CardHeader {...cardConfigs.physical} />
        <AnimatedView
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.formContainer}
        >
          <View style={styles.rowContainer}>
            <FormDropdown
              control={control}
              name="height"
              label="Height 📏"
              items={PROFILE_DATA.heights}
              containerStyle={[styles.halfWidth, styles.dropdownAnimated]}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <FeatherIcon name="arrow-up" size={20} color={COLORS.primary} />
              }
            />
            <FormDropdown
              control={control}
              name="weight"
              label="Weight ⚖️"
              items={PROFILE_DATA.weights}
              containerStyle={[styles.halfWidth, styles.dropdownAnimated]}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <MaterialIcon
                  name="fitness-center"
                  size={20}
                  color={COLORS.primary}
                />
              }
            />
          </View>
          <View style={styles.rowContainer}>
            <FormDropdown
              control={control}
              name="hair_color_id"
              label="Hair Color 💁‍♂️"
              items={PROFILE_DATA.hair_colors}
              containerStyle={[styles.halfWidth, styles.dropdownAnimated]}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <MaterialIcon
                  name="color-lens"
                  size={20}
                  color={COLORS.primary}
                />
              }
            />
            <FormDropdown
              control={control}
              name="skin_color_id"
              label="Skin Color 🎨"
              items={PROFILE_DATA.skin_colors}
              containerStyle={[styles.halfWidth, styles.dropdownAnimated]}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <MaterialIcon name="palette" size={20} color={COLORS.primary} />
              }
            />
          </View>
        </AnimatedView>
      </AnimatedCard>

      {/* Hobbies & Interests Card */}
      <AnimatedCard delay={400}>
        <CardHeader {...cardConfigs.hobbies} />
        <AnimatedView
          entering={FadeInUp.delay(500).duration(600)}
          style={styles.formContainer}
        >
          <SelectableGrid
            control={control}
            name="hobbies"
            items={PROFILE_DATA.hobbies}
            maxSelect={3}
            numColumns={3}
            renderItem={(item, isSelected) => (
              <Reanimated.View
                entering={FadeIn.delay(Math.random() * 500).duration(600)}
                style={[
                  styles.hobbyItem,
                  isSelected && styles.hobbyItemSelected,
                ]}
              >
                <View
                  style={[
                    styles.hobbyIconContainer,
                    isSelected && styles.hobbyIconContainerSelected,
                  ]}
                >
                  <Icon
                    name={HOBBY_ICONS[item.name] || "apps"}
                    size={30}
                    color={isSelected ? COLORS.white : COLORS.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.hobbyText,
                    isSelected && styles.hobbyTextSelected,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.name} {HOBBY_EMOJIS[item.name] || ""}
                </Text>
              </Reanimated.View>
            )}
          />
        </AnimatedView>
      </AnimatedCard>
      {/* Lifestyle Choices Card */}
      <AnimatedCard delay={500}>
        <CardHeader {...cardConfigs.lifestyle} />
        <AnimatedView
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.formContainer}
        >
          <FormDropdown
            control={control}
            name="smoking_status"
            label="Smoking Status 🚭"
            items={[
              { id: 1, name: "Non-smoker" },
              { id: 2, name: "Regular smoker" },
              { id: 3, name: "Social smoker" },
            ]}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="wind" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />

          {watch("smoking_status") > 1 && (
            <Reanimated.View
              entering={FadeInDown.duration(400).springify()}
              style={styles.preferencesContainer}
            >
              <SelectableGrid
                control={control}
                name="smoking_tools"
                items={PROFILE_DATA.smoking_tools}
                label="Smoking Preferences"
                multiple
                renderItem={(item, isSelected) => (
                  <Reanimated.View
                    entering={FadeIn.delay(Math.random() * 300).duration(400)}
                    style={[
                      styles.preferenceItem,
                      isSelected && styles.preferenceItemSelected,
                    ]}
                  >
                    <Text style={styles.preferenceText}>{item.name}</Text>
                  </Reanimated.View>
                )}
              />
            </Reanimated.View>
          )}

          <FormDropdown
            control={control}
            name="drinking_status_id"
            label="Drinking Status ☕"
            items={PROFILE_DATA.drinking_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="coffee" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </AnimatedView>
      </AnimatedCard>

      {/* Physical Activity Card */}
      {/* Pets Card */}
      <AnimatedCard delay={700}>
        <CardHeader {...cardConfigs.pets} />
        <AnimatedView
          entering={FadeInUp.delay(800).duration(600)}
          style={styles.formContainer}
        >
          <SelectableGrid
            control={control}
            name="pets"
            items={PROFILE_DATA.pets}
            multiple
            numColumns={3}
            renderItem={(item, isSelected) => (
              <Reanimated.View
                entering={FadeIn.delay(Math.random() * 300).duration(400)}
                style={[styles.petItem, isSelected && styles.petItemSelected]}
              >
                <View
                  style={[
                    styles.petIconContainer,
                    isSelected && styles.petIconContainerSelected,
                  ]}
                >
                  <Icon
                    name={PET_ICONS[item.name] || "paw"}
                    size={30}
                    color={isSelected ? COLORS.white : COLORS.primary}
                  />
                </View>
                <Text
                  style={[styles.petText, isSelected && styles.petTextSelected]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.name} {PET_EMOJIS[item.name] || "🐾"}
                </Text>
              </Reanimated.View>
            )}
          />
        </AnimatedView>
      </AnimatedCard>

      {/* Religion Card */}
      <AnimatedCard delay={800}>
        <CardHeader {...cardConfigs.spiritual} />
        <AnimatedView
          entering={FadeInUp.delay(900).duration(600)}
          style={styles.formContainer}
        >
          <FormDropdown
            control={control}
            name="religion_id"
            label="Religion 🕊️"
            items={PROFILE_DATA.religions}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="moon" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />
          <View style={styles.spiritualNote}>
            <Text style={styles.noteText}>
              Express your spiritual journey with peace ✨
            </Text>
          </View>
        </AnimatedView>
      </AnimatedCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // Section Header Styles
  sectionHeader: {
    marginVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  sectionEmoji: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 16,
    includeFontPadding: false,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderIcon: {
    marginRight: 8,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.grayDark,
    lineHeight: 20,
  },

  // Form Container and Elements
  formContainer: {
    padding: 20,
    gap: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  dropdownAnimated: {
    transform: [{ scale: 1 }],
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
  },

  // Icon Containers
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  // Additional Elements
  spiritualNote: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    borderRadius: 12,
    alignItems: "center",
  },
  noteText: {
    color: COLORS.primary,
    fontWeight: "500",
    textAlign: "center",
  },
  activityLevel: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    borderRadius: 12,
    alignItems: "center",
  },
  activityLevelText: {
    color: COLORS.primary,
    fontWeight: "500",
    textAlign: "center",
  },
  hobbyItem: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderWidth: 2,
    borderColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hobbyItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.05 }],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  hobbyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  hobbyIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ scale: 1.05 }],
  },
  hobbyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  hobbyTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },

  // Pet Items
  petItem: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    padding: 16,
    margin: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderWidth: 2,
    borderColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  petItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    transform: [{ scale: 1.05 }],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  petIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  petIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: [{ scale: 1.05 }],
  },
  petText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  petTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
export default LifestyleSection;
