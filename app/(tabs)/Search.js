import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PROFILE_DATA } from "../../constants/profileData";
import AgeRangeModal from "../../components/common/AgeRangeModal";
import { FlatList } from "react-native";
import withProfileCompletion from "../../components/profile/withProfileCompletion";
const COLORS = {
  primary: "#B65165",
  primaryLight: "#D97485",
  primaryGradient: ["#B65165", "#D97485"],
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
};

const initialFilters = {
  nationality: "no_preference",
  jordanianOrigin: "no_preference",
  religiousLevel: "no_preference",
  countryOfResidence: "no_preference",
  cityInJordan: "no_preference",
  ageRange: { min: 18, max: 50 },
  educationLevel: "no_preference",
  specialization: "no_preference",
  occupation: "no_preference",
  isEmployed: "no_preference",
  financialStatus: "no_preference",
  height: "no_preference",
  weight: "no_preference",
  maritalStatus: "no_preference",
  childrenPlans: "no_preference",
  languages: [],
  lifestyle: {
    pets: "no_preference",
    smoking: "no_preference",
    drinking: "no_preference",
    exercise: "no_preference",
    socialMedia: "no_preference",
    sleepHabits: "no_preference",
  },
  marriageBudget: "no_preference",
};

const AnimatedSelectField = ({
  label,
  icon,
  value,
  options,
  onPress,
  displayValue,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
    <View style={styles.fieldContainer}>
      <View style={styles.labelContainer}>
        <FontAwesome5
          name={icon}
          size={16}
          color={COLORS.primary}
          style={styles.labelIcon}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.selectButtonText}>
            {displayValue ||
              options.find((opt) => opt.value === value)?.label ||
              "Select..."}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
const countryEmojis = {
  jordanian: "🇯🇴",
  egyptian: "🇪🇬",
  lebanese: "🇱🇧",
  syrian: "🇸🇾",
  palestinian: "🇵🇸",
  no_preference: "🌍",
};
const SelectModal = ({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 45,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const renderItem = ({ item, index }) => {
    const itemAnimation = Animated.multiply(
      opacityAnim,
      new Animated.Value(1 - index * 0.1)
    );

    const emoji = countryEmojis[item.value.toLowerCase()] || "🌍";

    return (
      <Animated.View
        style={[
          styles.optionContainer,
          {
            opacity: itemAnimation,
            transform: [
              {
                translateY: itemAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedValue === item.value && styles.selectedOption,
          ]}
          onPress={() => {
            onSelect(item.value);
            onClose();
          }}
        >
          <LinearGradient
            colors={
              selectedValue === item.value
                ? COLORS.primaryGradient
                : ["#fff", "#fff"]
            }
            style={styles.optionGradient}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>{emoji}</Text>
              <Text
                style={[
                  styles.optionText,
                  selectedValue === item.value && styles.selectedOptionText,
                ]}
              >
                {item.label}
              </Text>
            </View>
            {selectedValue === item.value && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color={COLORS.white}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.modalHeader}
          >
            <View>
              <Text style={styles.modalTitle}>{title} ✨</Text>
              <Text style={styles.modalSubtitle}>Select your preference</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>

          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={() => (
              <View style={styles.searchSection}>
                <View style={styles.noPreferenceContainer}>
                  <TouchableOpacity
                    style={[
                      styles.noPreferenceButton,
                      selectedValue === "no_preference" &&
                        styles.selectedOption,
                    ]}
                    onPress={() => {
                      onSelect("no_preference");
                      onClose();
                    }}
                  >
                    <LinearGradient
                      colors={
                        selectedValue === "no_preference"
                          ? COLORS.primaryGradient
                          : ["#fff", "#fff"]
                      }
                      style={styles.noPreferenceGradient}
                    >
                      <Text style={styles.optionEmoji}>🌍</Text>
                      <Text
                        style={[
                          styles.noPreferenceText,
                          selectedValue === "no_preference" &&
                            styles.selectedOptionText,
                        ]}
                      >
                        No Preference
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            renderItem={renderItem}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
const PartnerSearchScreen = () => {
  const [showAgeRangeModal, setShowAgeRangeModal] = useState(false);

  const handleAgeRangePress = () => {
    setShowAgeRangeModal(true);
  };
  const [filters, setFilters] = useState(initialFilters);
  const userProfile = useSelector((state) => state.profile.data);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    options: [],
    selectedValue: "",
    onSelect: () => {},
    title: "",
  });

  const religiousLevels = {
    male: [
      { label: "Select Please", value: "no_preference" },
      { label: "Very Religious", value: "very_religious" },
      { label: "Religious", value: "religious" },
      { label: "Moderate", value: "moderate" },
      { label: "Somewhat Religious", value: "somewhat" },
      { label: "Less Religious", value: "less_religious" },
    ],
    female: [
      { label: "Select Please", value: "no_preference" },
      { label: "Wears Jilbab", value: "jilbab" },
      { label: "Wears Hijab (Religious)", value: "religious_hijab" },
      { label: "Wears Hijab", value: "hijab" },
      { label: "No Hijab (Religious)", value: "religious_no_hijab" },
      { label: "No Hijab", value: "no_hijab" },
    ],
  };

  const renderHeader = () => (
    <LinearGradient colors={COLORS.primaryGradient} style={styles.header}>
      <View style={styles.headerBackground}>
        <Text style={styles.headerTitle}>Find Your Soulmate 💝</Text>
        <Text style={styles.headerSubtitle}>Perfect Match Awaits You ✨</Text>
      </View>
    </LinearGradient>
  );

  const renderSelectField = (
    label,
    value,
    options,
    onValueChange,
    displayValue
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          setModalConfig({
            visible: true,
            options,
            selectedValue: value,
            onSelect: onValueChange,
            title: label,
          });
        }}
      >
        <Text style={styles.selectButtonText}>
          {displayValue ||
            options.find((opt) => opt.value === value)?.label ||
            "Select..."}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );

  const renderAgeRangeField = () => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Age Range</Text>
      <View style={styles.ageRangeContainer}>
        <TouchableOpacity
          style={styles.ageButton}
          onPress={() => {
            /* Add age selector modal */
          }}
        >
          <Text style={styles.ageButtonText}>
            {filters.ageRange.min} - {filters.ageRange.max}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
  const handleCountrySelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.countries.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.country,
      onSelect: (value) => {
        setFilters({
          ...filters,
          country: value,
          city: "no_preference", // Reset city when country changes
        });
      },
      title: "Select Country",
    });
  };
  const handleCitySelect = () => {
    const cityOptions = PROFILE_DATA.cities[filters.country] || [];
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...cityOptions.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.city,
      onSelect: (value) => setFilters({ ...filters, city: value }),
      title: "Select City",
    });
  };
  const handleEducationSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.educational_levels.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.educationLevel,
      onSelect: (value) => setFilters({ ...filters, educationLevel: value }),
      title: "Select Education Level",
    });
  };

  const handleSpecializationSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.specializations.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.specialization,
      onSelect: (value) => setFilters({ ...filters, specialization: value }),
      title: "Select Specialization",
    });
  };

  const handleSmokingSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.smoking_tools.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.smoking,
      onSelect: (value) => setFilters({ ...filters, smoking: value }),
      title: "Select Smoking Preference",
    });
  };

  const handleSocialMediaSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.social_media_presences.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.socialMedia,
      onSelect: (value) => setFilters({ ...filters, socialMedia: value }),
      title: "Select Social Media Presence",
    });
  };

  const handleHobbiesSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.hobbies.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.hobbies,
      onSelect: (value) => setFilters({ ...filters, hobbies: value }),
      title: "Select Hobbies",
    });
  };

  const handleHeightSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.heights.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.height,
      onSelect: (value) => setFilters({ ...filters, height: value }),
      title: "Select Height",
    });
  };

  const handleWeightSelect = () => {
    setModalConfig({
      visible: true,
      options: [
        { label: "Select Please", value: "no_preference" },
        ...PROFILE_DATA.weights.map((item) => ({
          label: item.name,
          value: item.id.toString(),
        })),
      ],
      selectedValue: filters.weight,
      onSelect: (value) => setFilters({ ...filters, weight: value }),
      title: "Select Build",
    });
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchCard}>
          {/* Essential Filters Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Essential Details ✨</Text>

            <AnimatedSelectField
              label="Nationality 🌍"
              icon="globe"
              value={filters.nationality}
              options={[
                { label: "Select Please", value: "no_preference" },
                ...PROFILE_DATA.nationalities.map((item) => ({
                  label: item.name,
                  value: item.id.toString(),
                })),
              ]}
              onPress={() => {
                setModalConfig({
                  visible: true,
                  options: [
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.nationalities.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ],
                  selectedValue: filters.nationality,
                  onSelect: (value) =>
                    setFilters({ ...filters, nationality: value }),
                  title: "Select Nationality",
                });
              }}
            />

            <AnimatedSelectField
              label="Religious Level 🕌"
              icon="pray"
              value={filters.religiousLevel}
              options={
                userProfile?.gender === "male"
                  ? religiousLevels.female
                  : religiousLevels.male
              }
              onPress={() => {
                setModalConfig({
                  visible: true,
                  options:
                    userProfile?.gender === "male"
                      ? religiousLevels.female
                      : religiousLevels.male,
                  selectedValue: filters.religiousLevel,
                  onSelect: (value) =>
                    setFilters({ ...filters, religiousLevel: value }),
                  title: "Select Religious Level",
                });
              }}
            />

            <AnimatedSelectField
              label="Age Range 📅"
              icon="calendar-alt"
              value="age_range"
              displayValue={`${filters.ageRange.min} - ${filters.ageRange.max} years`}
              options={[]}
              onPress={handleAgeRangePress}
            />
          </View>

          {/* Location Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Location 📍</Text>

            <AnimatedSelectField
              label="Country"
              icon="map-marker-alt"
              value={filters.country}
              options={[
                { label: "Select Please", value: "no_preference" },
                ...PROFILE_DATA.countries.map((item) => ({
                  label: item.name,
                  value: item.id.toString(),
                })),
              ]}
              onPress={() => handleCountrySelect()}
            />

            {filters.country !== "no_preference" && (
              <AnimatedSelectField
                label="City"
                icon="city"
                value={filters.city}
                options={[
                  { label: "Select Please", value: "no_preference" },
                  ...(PROFILE_DATA.cities[filters.country] || []).map(
                    (item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })
                  ),
                ]}
                onPress={() => handleCitySelect()}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.advancedButton}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.advancedButtonText}>
              {showAdvanced ? "Show Less Filters ↑" : "Show More Filters ↓"}
            </Text>
          </TouchableOpacity>

          {showAdvanced && (
            <>
              {/* Education & Career Section */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Education & Career 🎓</Text>

                <AnimatedSelectField
                  label="Education Level"
                  icon="graduation-cap"
                  value={filters.educationLevel}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.educational_levels.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleEducationSelect()}
                />

                <AnimatedSelectField
                  label="Specialization"
                  icon="book"
                  value={filters.specialization}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.specializations.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleSpecializationSelect()}
                />
              </View>

              {/* Lifestyle Section */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Lifestyle 🌟</Text>

                <AnimatedSelectField
                  label="Smoking"
                  icon="smoking"
                  value={filters.smoking}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.smoking_tools.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleSmokingSelect()}
                />

                <AnimatedSelectField
                  label="Social Media Presence"
                  icon="share-alt"
                  value={filters.socialMedia}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.social_media_presences.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleSocialMediaSelect()}
                />

                <AnimatedSelectField
                  label="Hobbies"
                  icon="heart"
                  value={filters.hobbies}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.hobbies.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleHobbiesSelect()}
                />
              </View>

              {/* Physical Attributes Section */}
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Physical Attributes 👤</Text>

                <AnimatedSelectField
                  label="Height"
                  icon="ruler-vertical"
                  value={filters.height}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.heights.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleHeightSelect()}
                />

                <AnimatedSelectField
                  label="Build"
                  icon="child"
                  value={filters.weight}
                  options={[
                    { label: "Select Please", value: "no_preference" },
                    ...PROFILE_DATA.weights.map((item) => ({
                      label: item.name,
                      value: item.id.toString(),
                    })),
                  ]}
                  onPress={() => handleWeightSelect()}
                />
              </View>
            </>
          )}

          <TouchableOpacity style={styles.searchButton} activeOpacity={0.8}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>Find Your Match ✨</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SelectModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        options={modalConfig.options}
        selectedValue={modalConfig.selectedValue}
        onSelect={modalConfig.onSelect}
        title={modalConfig.title}
      />

      <AgeRangeModal
        visible={showAgeRangeModal}
        onClose={() => setShowAgeRangeModal(false)}
        currentRange={filters.ageRange}
        onSelect={(range) => {
          setFilters({
            ...filters,
            ageRange: range,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  headerBackground: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: COLORS.white,
    fontSize: 18,
    opacity: 0.9,
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 130 : 110,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  advancedButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginVertical: 10,
  },
  advancedButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  searchButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  searchButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: `${COLORS.primary}15`,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: 0.5,
    textAlign: "center",
    paddingBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 24,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "80%",
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
  listContent: {
    padding: 16,
  },
  searchSection: {
    marginBottom: 20,
  },
  noPreferenceContainer: {
    marginBottom: 16,
  },
  noPreferenceButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noPreferenceGradient: {
    padding: 16,
    alignItems: "center",
  },
  noPreferenceText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  optionContainer: {
    marginBottom: 12,
  },
  optionButton: {
    borderRadius: 12,
    overflow: "hidden",
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
  optionGradient: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOption: {
    borderWidth: 0,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "80%",
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
  listContent: {
    padding: 16,
  },
  searchSection: {
    marginBottom: 20,
  },
  noPreferenceContainer: {
    marginBottom: 16,
  },
  noPreferenceButton: {
    borderRadius: 16,
    overflow: "hidden",
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
  noPreferenceGradient: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  noPreferenceText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  optionContainer: {
    marginBottom: 12,
  },
  optionButton: {
    borderRadius: 16,
    overflow: "hidden",
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
  optionGradient: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOption: {
    borderWidth: 0,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
export default withProfileCompletion(PartnerSearchScreen);
