import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { PROFILE_DATA } from "../../../constants/profileData";
import SelectableGrid from "./SelectableGrid";
import FormDropdown from "../../common/FormDropdown";
import { COLORS } from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { FadeIn } from "react-native-reanimated";

const { height } = Dimensions.get("window");

const CardHeader = ({ title, iconName, description }) => (
  <View style={styles.cardHeader}>
    <View style={styles.cardHeaderContent}>
      <MaterialIcon
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

const LifestyleSection = () => {
  const { control, watch, setValue } = useFormContext();
  const smoking_status = watch("smoking_status");

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Lifestyle Journey</Text>
        <Text style={styles.sectionSubtitle}>
          Craft a vibrant portrait of your unique self
        </Text>
      </View>

      {/* Origin & Residence Card */}
      <View style={styles.card}>
        <CardHeader
          title="Origin & Residence"
          iconName="public"
          description="Roots and current home that shape you"
        />

        <View style={styles.formContainer}>
          {/* Nationality Dropdown */}
          <FormDropdown
            control={control}
            name="nationality_id"
            label="Nationality"
            items={PROFILE_DATA.nationalities}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="flag" size={20} color={COLORS.primary} />
            }
            required
          />

          {/* Country of Residence Dropdown */}
          <FormDropdown
            control={control}
            name="country_of_residence_id"
            label="Country of Residence"
            items={PROFILE_DATA.countries}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="map-pin" size={20} color={COLORS.primary} />
            }
            required
          />

          {/* City Dropdown */}
          <FormDropdown
            control={control}
            name="city_id"
            label="City"
            items={PROFILE_DATA.cities[watch("country_of_residence_id") || 1]}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="map" size={20} color={COLORS.primary} />
            }
            required
          />
        </View>
      </View>

      {/* Physical Attributes Card */}
      <View style={styles.card}>
        <CardHeader
          title="Physical Attributes"
          iconName="accessibility"
          description="Your unique physical characteristics"
        />
        <View style={styles.formContainer}>
          <View style={styles.rowContainer}>
            <FormDropdown
              control={control}
              name="height"
              label="Height"
              items={PROFILE_DATA.heights}
              containerStyle={styles.halfWidth}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <FeatherIcon name="arrow-up" size={20} color={COLORS.primary} />
              }
            />
            <FormDropdown
              control={control}
              name="weight"
              label="Weight"
              items={PROFILE_DATA.weights}
              containerStyle={styles.halfWidth}
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
              label="Hair Color"
              items={PROFILE_DATA.hair_colors}
              containerStyle={styles.halfWidth}
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
              label="Skin Color"
              items={PROFILE_DATA.skin_colors}
              containerStyle={styles.halfWidth}
              placeholderTextColor={COLORS.text + "80"}
              leftIcon={
                <MaterialIcon name="palette" size={20} color={COLORS.primary} />
              }
            />
          </View>
        </View>
      </View>

      {/* Hobbies & Interests Card */}
      <View style={styles.card}>
        <CardHeader
          title="Hobbies & Interests"
          iconName="interests"
          description="Explore the passions that define you"
        />
        <View style={styles.formContainer}>
          <SelectableGrid
            control={control}
            name="hobbies"
            items={PROFILE_DATA.hobbies}
            maxSelect={3}
            numColumns={3}
            renderItem={(item, isSelected) => (
              <View
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
                    name={
                      {
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
                      }[item.name] || "apps"
                    }
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
                  {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
      {/* Lifestyle Choices Card */}
      <View style={styles.card}>
        <CardHeader
          title="Lifestyle Choices"
          iconName="lifestyle"
          description="Your personal preferences and habits"
        />
        <View style={styles.formContainer}>
          <FormDropdown
            control={control}
            name="smoking_status"
            label="Smoking Status"
            items={[
              { id: 1, name: "Non-smoker" },
              { id: 2, name: "Regular smoker" },
              { id: 3, name: "Social smoker" },
            ]}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="wind" size={20} color={COLORS.primary} />
            }
            required
          />

          {watch("smoking_status") > 1 && (
            <Animated.View entering={FadeIn.duration(400)}>
              <SelectableGrid
                control={control}
                name="smoking_tools"
                items={PROFILE_DATA.smoking_tools}
                label="Smoking Preferences"
                multiple
              />
            </Animated.View>
          )}

          <FormDropdown
            control={control}
            name="drinking_status_id"
            label="Drinking Status"
            items={PROFILE_DATA.drinking_statuses}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="coffee" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Physical Activity Card */}
      <View style={styles.card}>
        <CardHeader
          title="Physical Activity"
          iconName="fitness-center"
          description="Your approach to health and wellness"
        />
        <View style={styles.formContainer}>
          <FormDropdown
            control={control}
            name="sports_activity_id"
            label="Sports Activity"
            items={PROFILE_DATA.sports_activities}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <MaterialIcon name="sports" size={20} color={COLORS.primary} />
            }
          />
        </View>
      </View>

      {/* Pets Card */}
      <View style={styles.card}>
        <CardHeader
          title="Pets"
          iconName="pets"
          description="Your furry or feathered companions"
        />
        <View style={styles.formContainer}>
          <SelectableGrid
            control={control}
            name="pets"
            items={PROFILE_DATA.pets}
            multiple
            numColumns={3}
            renderItem={(item, isSelected) => (
              <View
                style={[styles.petItem, isSelected && styles.petItemSelected]}
              >
                <View
                  style={[
                    styles.petIconContainer,
                    isSelected && styles.petIconContainerSelected,
                  ]}
                >
                  <Icon
                    name={
                      {
                        Cat: "cat",
                        Dog: "dog",
                        Bird: "duck",
                        Fish: "fish",
                        Hamster: "rodent",
                        Rabbit: "rabbit",
                        Reptile: "snake",
                        Other: "paw",
                      }[item.name] || "paw"
                    }
                    size={30}
                    color={isSelected ? COLORS.white : COLORS.primary}
                  />
                </View>
                <Text
                  style={[styles.petText, isSelected && styles.petTextSelected]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      {/* Religion Card */}
      <View style={styles.card}>
        <CardHeader
          title="Spiritual Beliefs"
          iconName="temple-buddhist"
          description="Your spiritual perspective"
        />
        <View style={styles.formContainer}>
          <FormDropdown
            control={control}
            name="religion_id"
            label="Religion"
            items={PROFILE_DATA.religions}
            placeholderTextColor={COLORS.text + "80"}
            leftIcon={
              <FeatherIcon name="moon" size={20} color={COLORS.primary} />
            }
            required
          />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    lineHeight: 24,
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
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.grayDark,
  },
  formContainer: {
    padding: 16,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  hobbyItem: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    padding: 8,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    height: 110,
  },
  hobbyItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  hobbyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  hobbyIconContainerSelected: {
    backgroundColor: COLORS.primaryLight + "30",
  },
  hobbyText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
  },
  hobbyTextSelected: {
    color: COLORS.white,
  },
  petItem: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 16,
    padding: 8,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    height: 110,
  },
  petItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  petIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  petIconContainerSelected: {
    backgroundColor: COLORS.primaryLight + "30",
  },
  petText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
  },
  petTextSelected: {
    color: COLORS.white,
  },
});

export default LifestyleSection;
