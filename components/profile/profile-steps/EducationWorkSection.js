import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { COLORS } from "../../../constants/colors";
import { PROFILE_DATA } from "../../../constants/profileData";
import FormDropdown from "../../common/FormDropdown";

const CardHeader = ({ title, iconName, description }) => (
  <View style={styles.cardHeader}>
    <View style={styles.cardHeaderContent}>
      <Icon
        name={iconName}
        size={30}
        color={COLORS.primary}
        style={styles.cardHeaderIcon}
      />
      <View style={styles.cardHeaderText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{description}</Text>
      </View>
    </View>
  </View>
);

const ToggleButton = ({ options, value, onChange, label }) => (
  <View style={styles.toggleSection}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <View style={styles.toggleContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.toggleOption,
            value === option.value && styles.toggleOptionSelected,
          ]}
          onPress={() => onChange(option.value)}
        >
          <View style={styles.toggleOptionContent}>
            <Icon
              name={option.icon}
              size={20}
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
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const EducationWorkSection = () => {
  const { control, watch } = useFormContext();
  const employment_status = watch("employment_status");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Professional Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Craft the story of your educational and career path
        </Text>
      </View>

      {/* Educational Background Card */}
      <View style={styles.card}>
        <CardHeader
          title="Educational Background"
          iconName="school-outline"
          description="Your academic achievements and specialization"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="educational_level_id"
            label="Education Level"
            items={PROFILE_DATA.educational_levels}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon
                name="trending-up"
                size={20}
                color={COLORS.primary}
              />
            }
          />

          <FormDropdown
            control={control}
            name="specialization_id"
            label="Field of Study"
            items={PROFILE_DATA.specializations}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="book-open" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Employment Status Toggle */}
      <Controller
        control={control}
        name="employment_status"
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label="Employment Status"
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

      {/* Job Details Card (Only when Employed) */}
      {employment_status === true && (
        <View style={styles.card}>
          <CardHeader
            title="Job Details"
            iconName="briefcase-outline"
            description="Your professional information"
          />
          <View style={styles.cardContent}>
            <TextInput
              style={styles.textInput}
              placeholder="Job Title"
              placeholderTextColor={COLORS.text + "80"}
            />

            <FormDropdown
              control={control}
              name="position_level"
              label="Position Level"
              items={PROFILE_DATA.position_levels}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <FeatherIcon
                  name="arrow-up-right"
                  size={20}
                  color={COLORS.primary}
                />
              }
            />
          </View>
        </View>
      )}

      {/* Financial Information Card */}
      <View style={styles.card}>
        <CardHeader
          title="Financial Information"
          iconName="currency-usd"
          description="Your financial stability and housing"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="financial_status_id"
            label="Financial Status"
            items={PROFILE_DATA.financial_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon
                name="dollar-sign"
                size={20}
                color={COLORS.primary}
              />
            }
          />

          <FormDropdown
            control={control}
            name="housing_status_id"
            label="Housing Status"
            items={PROFILE_DATA.housing_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="home" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Marital Status Card */}
      <View style={styles.card}>
        <CardHeader
          title="Marital Status"
          iconName="heart-outline"
          description="Your relationship status"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="marital_status_id"
            label="Marital Status"
            items={PROFILE_DATA.marital_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="users" size={20} color={COLORS.primary} />
            }
            required
          />
        </View>
      </View>

      {/* Social Media Presence Card */}
      <View style={styles.card}>
        <CardHeader
          title="Online Presence"
          iconName="web"
          description="Your social media and digital footprint"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="social_media_presence"
            label="Social Media Presence"
            items={PROFILE_DATA.social_media_presences}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="share-2" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Origin Card */}
      <View style={styles.card}>
        <CardHeader
          title="Origin"
          iconName="earth"
          description="Your cultural background"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="origin"
            label="Origin"
            items={PROFILE_DATA.origins}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="globe" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Zodiac Sign Card */}
      <View style={styles.card}>
        <CardHeader
          title="Cosmic Identity"
          iconName="zodiac-sagittarius"
          description="Your astrological sign"
        />
        <View style={styles.cardContent}>
          <FormDropdown
            control={control}
            name="zodiac_sign"
            label="Zodiac Sign"
            items={PROFILE_DATA.zodiac_signs}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon name="stars" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Car Ownership Toggle */}
      <Controller
        control={control}
        name="car_ownership"
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label="Car Ownership"
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
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: COLORS.grayDark,
    lineHeight: 26,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
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
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderIcon: {
    marginRight: 12,
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
  },
  cardContent: {
    padding: 16,
    gap: 16,
  },
  toggleSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
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
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  toggleOption: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  toggleOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionIcon: {
    marginRight: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  toggleTextSelected: {
    color: COLORS.white,
  },
  textInput: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: COLORS.text,
  },
});

export default EducationWorkSection;
