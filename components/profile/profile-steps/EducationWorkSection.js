import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
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

import { COLORS } from "../../../constants/colors";
import { PROFILE_DATA } from "../../../constants/profileData";
import FormDropdown from "../../common/FormDropdown";

const { width, height } = Dimensions.get("window");

// Animation configurations
const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 200,
};

const FADE_IN_CONFIG = {
  duration: 600,
};

// Reusable animated components
const AnimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedText = Reanimated.createAnimatedComponent(Text);
const AnimatedTouchableOpacity =
  Reanimated.createAnimatedComponent(TouchableOpacity);
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
        <View style={styles.headerIconContainer}>
          <Icon
            name={iconName}
            size={30}
            color={COLORS.primary}
            style={styles.cardHeaderIcon}
          />
          <Text style={styles.headerEmoji}>{emoji}</Text>
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

const ToggleButton = ({ options, value, onChange, label }) => {
  return (
    <AnimatedView
      entering={FadeInUp.duration(600)}
      style={styles.toggleSection}
    >
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleContainer}>
        {options.map((option, index) => (
          <AnimatedTouchableOpacity
            key={option.value}
            entering={FadeIn.delay(index * 200).duration(400)}
            style={[
              styles.toggleOption,
              value === option.value && styles.toggleOptionSelected,
            ]}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.toggleOptionContent}>
              <Icon
                name={option.icon}
                size={24}
                color={value === option.value ? COLORS.white : COLORS.primary}
                style={styles.toggleOptionIcon}
              />
              <Text
                style={[
                  styles.toggleText,
                  value === option.value && styles.toggleTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </View>
          </AnimatedTouchableOpacity>
        ))}
      </View>
    </AnimatedView>
  );
};
const EducationWorkSection = () => {
  const { control, watch } = useFormContext();
  const employment_status = watch("employment_status");

  // Card configurations with emojis
  const cardConfigs = {
    education: {
      title: "Educational Background",
      iconName: "school-outline",
      description: "Your academic achievements and specialization",
      emoji: "🎓",
    },
    employment: {
      title: "Employment Status",
      iconName: "briefcase-outline",
      description: "Your current work situation",
      emoji: "💼",
    },
    jobDetails: {
      title: "Job Details",
      iconName: "briefcase-outline",
      description: "Your professional information",
      emoji: "👔",
    },
    financial: {
      title: "Financial Information",
      iconName: "currency-usd",
      description: "Your financial stability and housing",
      emoji: "💰",
    },
    marital: {
      title: "Marital Status",
      iconName: "heart-outline",
      description: "Your relationship status",
      emoji: "💑",
    },
    social: {
      title: "Online Presence",
      iconName: "web",
      description: "Your social media and digital footprint",
      emoji: "🌐",
    },
    origin: {
      title: "Origin",
      iconName: "earth",
      description: "Your cultural background",
      emoji: "🌍",
    },
    zodiac: {
      title: "Cosmic Identity",
      iconName: "zodiac-sagittarius",
      description: "Your astrological sign",
      emoji: "⭐",
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <AnimatedView
        entering={FadeInDown.duration(800).springify()}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionEmoji}>✨</Text>
        <Text style={styles.sectionTitle}>Your Professional Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Craft the story of your educational and career path 🚀
        </Text>
      </AnimatedView>

      {/* Educational Background Card */}
      <AnimatedView
        entering={FadeInUp.delay(100).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.education} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="educational_level_id"
            label="Education Level 📚"
            items={PROFILE_DATA.educational_levels}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon
                name="trending-up"
                size={20}
                color={COLORS.primary}
              />
            }
            containerStyle={styles.dropdownAnimated}
          />

          <FormDropdown
            control={control}
            name="specialization_id"
            label="Field of Study 📖"
            items={PROFILE_DATA.specializations}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="book-open" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </View>
      </AnimatedView>

      {/* Employment Status Toggle */}
      <AnimatedView entering={FadeInUp.delay(200).duration(600)}>
        <Controller
          control={control}
          name="employment_status"
          render={({ field: { value, onChange } }) => (
            <ToggleButton
              label="Employment Status 💼"
              value={value}
              onChange={onChange}
              options={[
                {
                  value: true,
                  label: "Employed",
                  icon: "briefcase-outline",
                },
                {
                  value: false,
                  label: "Not Employed",
                  icon: "account-off-outline",
                },
              ]}
            />
          )}
        />
      </AnimatedView>

      {/* Job Details Card (Only when Employed) */}
      {employment_status === true && (
        <AnimatedView
          entering={FadeInDown.duration(400).springify()}
          style={styles.card}
        >
          <CardHeader {...cardConfigs.jobDetails} />
          <View style={styles.cardContent}>
            <TextInput
              style={styles.enhancedTextInput}
              placeholder="Job Title"
              placeholderTextColor={COLORS.text + "80"}
            />

            <FormDropdown
              control={control}
              name="position_level"
              label="Position Level 📈"
              items={PROFILE_DATA.position_levels}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <FeatherIcon
                  name="arrow-up-right"
                  size={20}
                  color={COLORS.primary}
                />
              }
              containerStyle={styles.dropdownAnimated}
            />
          </View>
        </AnimatedView>
      )}
      {/* Financial Information Card */}
      <AnimatedView
        entering={FadeInUp.delay(300).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.financial} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="financial_status_id"
            label="Financial Status 💵"
            items={PROFILE_DATA.financial_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon
                name="dollar-sign"
                size={20}
                color={COLORS.primary}
              />
            }
            containerStyle={styles.dropdownAnimated}
          />

          <FormDropdown
            control={control}
            name="housing_status_id"
            label="Housing Status 🏠"
            items={PROFILE_DATA.housing_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="home" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </View>
      </AnimatedView>

      {/* Marital Status Card */}
      <AnimatedView
        entering={FadeInUp.delay(400).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.marital} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="marital_status_id"
            label="Marital Status 💑"
            items={PROFILE_DATA.marital_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="users" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
            required
          />
        </View>
      </AnimatedView>

      {/* Social Media Presence Card */}
      <AnimatedView
        entering={FadeInUp.delay(500).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.social} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="social_media_presence"
            label="Social Media Presence 📱"
            items={PROFILE_DATA.social_media_presences}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="share-2" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </View>
      </AnimatedView>
      {/* Origin Card */}
      <AnimatedView
        entering={FadeInUp.delay(600).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.origin} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="origin"
            label="Origin 🌏"
            items={PROFILE_DATA.origins}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="globe" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </View>
      </AnimatedView>

      {/* Zodiac Sign Card */}
      <AnimatedView
        entering={FadeInUp.delay(700).duration(600)}
        style={styles.card}
      >
        <CardHeader {...cardConfigs.zodiac} />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="zodiac_sign"
            label="Zodiac Sign ✨"
            items={PROFILE_DATA.zodiac_signs}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon name="stars" size={20} color={COLORS.primary} />
            }
            containerStyle={styles.dropdownAnimated}
          />
        </View>
      </AnimatedView>

      {/* Car Ownership Toggle */}
      <AnimatedView entering={FadeInUp.delay(800).duration(600)}>
        <Controller
          control={control}
          name="car_ownership"
          render={({ field: { value, onChange } }) => (
            <ToggleButton
              label="Car Ownership 🚗"
              value={value}
              onChange={onChange}
              options={[
                {
                  value: true,
                  label: "Yes",
                  icon: "car-outline",
                },
                {
                  value: false,
                  label: "No",
                  icon: "car-off",
                },
              ]}
            />
          )}
        />
      </AnimatedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
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
  sectionEmoji: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 20,
  },
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
  cardContent: {
    padding: 20,
    gap: 16,
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 20,
    marginLeft: 4,
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
  enhancedTextInput: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  toggleSection: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
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
  toggleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 15,
  },
  toggleOption: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  toggleOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  toggleTextSelected: {
    color: COLORS.white,
  },
  dropdownAnimated: {
    transform: [{ scale: 1 }],
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
  },
  toggleOptionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginRight: 5,
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

  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export default EducationWorkSection;
