import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import ModernDropdown from "../../components/search/ModernDropdown";
import MultiSelectChips from "../../components/search/MultiSelectChips";

const LifestyleFilterSection = ({
  t,
  isRTL,
  preferences,
  lifestyleInterests,
  personalAttributes,
  religiosityLevels,
  handlePreferenceChange,
  isFilterDisabled,
  isMaxFiltersSelected,
  validationErrors,
  setValidationErrors,
  styles,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>
        {t ? t("search.sections.lifestyle.title") : "Lifestyle & Habits"}
      </Text>

      <View
        style={[
          styles.toggleContainerWithLabel,
          isFilterDisabled("preferred_smoking_status")
            ? styles.disabledFilter
            : null,
        ]}
      >
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>
            {t ? t("search.lifestyle.smoking_status") : "Smoking Status"}
          </Text>
          {preferences.preferred_smoking_status !== null && (
            <TouchableOpacity
              onPress={() => {
                handlePreferenceChange("preferred_smoking_status", null);
                handlePreferenceChange("preferred_smoking_tools", []);
                setValidationErrors((prev) => ({
                  ...prev,
                  smokingTools: false,
                }));
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>
                {t ? t("common.clear") : "Clear"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {preferences.preferred_smoking_status !== null ? (
          <View
            style={[styles.toggleButtons, isRTL && styles.toggleButtonsRTL]}
          >
            <TouchableOpacity
              style={[
                styles.toggleButton,
                preferences.preferred_smoking_status === true &&
                  styles.activeToggle,
              ]}
              onPress={() => {
                handlePreferenceChange("preferred_smoking_status", true);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  preferences.preferred_smoking_status === true &&
                    styles.activeToggleText,
                ]}
              >
                {t ? t("search.lifestyle.smoker") : "Smoker"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPreferenceButton}
            onPress={() => {
              handlePreferenceChange("preferred_smoking_status", true);

              if (!preferences.preferred_smoking_tools?.length) {
                const defaultTool = (
                  lifestyleInterests.smokingTools || []
                ).find((tool) => tool.name === "Cigarettes");
                if (defaultTool) {
                  handlePreferenceChange("preferred_smoking_tools", [
                    defaultTool.id,
                  ]);
                  setValidationErrors((prev) => ({
                    ...prev,
                    smokingTools: false,
                  }));
                }
              }
            }}
            disabled={isFilterDisabled("preferred_smoking_status")}
          >
            <Text style={styles.addPreferenceText}>
              {t
                ? t("search.lifestyle.add_smoking_preference")
                : "Add smoking preference"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {preferences.preferred_smoking_status === true && (
        <View
          style={[
            styles.chipSelectorContainer,
            validationErrors.smokingTools && {
              borderColor: "red",
              borderWidth: 1,
              padding: 15,
              borderRadius: 8,
            },
          ]}
        >
          <View style={styles.toggleLabelRow}>
            <Text
              style={[
                styles.inputLabel,
                validationErrors.smokingTools && { color: "red" },
              ]}
            >
              {t ? t("search.lifestyle.smoking_tools") : "Smoking Tools"}{" "}
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            {validationErrors.smokingTools && (
              <Text style={{ color: "red", fontSize: 12 }}>
                {t ? t("common.required") : "Required"}
              </Text>
            )}
          </View>
          <MultiSelectChips
            items={(lifestyleInterests.smokingTools || []).map((item) => ({
              id: item.id,
              name: item.name,
            }))}
            selectedItems={preferences.preferred_smoking_tools || []}
            onSelectItem={(items) => {
              handlePreferenceChange("preferred_smoking_tools", items);
              if (items.length > 0) {
                setValidationErrors((prev) => ({
                  ...prev,
                  smokingTools: false,
                }));
              }
            }}
            isRTL={isRTL}
          />
          {validationErrors.smokingTools && (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                padding: 15,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {t
                ? t("search.lifestyle.errors.select_smoking_tool")
                : "Please select at least one smoking tool."}
            </Text>
          )}
        </View>
      )}

      <ModernDropdown
        label={t ? t("search.lifestyle.drinking_status") : "Drinking Status"}
        value={preferences.preferred_drinking_status_id}
        items={(lifestyleInterests.drinkingStatuses || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_drinking_status_id", value)
        }
        placeholder={
          t
            ? t("search.lifestyle.select_drinking_status")
            : "Select drinking status (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_drinking_status_id")}
        containerStyle={
          isFilterDisabled("preferred_drinking_status_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.lifestyle.sports_activity") : "Sports Activity"}
        value={preferences.preferred_sports_activity_id}
        items={(lifestyleInterests.sportsActivities || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_sports_activity_id", value)
        }
        placeholder={
          t
            ? t("search.lifestyle.select_sports_activity")
            : "Select sports activity (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_sports_activity_id")}
        containerStyle={
          isFilterDisabled("preferred_sports_activity_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.lifestyle.sleep_habit") : "Sleep Habit"}
        value={preferences.preferred_sleep_habit_id}
        items={(personalAttributes.sleepHabits || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_sleep_habit_id", value)
        }
        placeholder={
          t
            ? t("search.lifestyle.select_sleep_habit")
            : "Select sleep habit (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_sleep_habit_id")}
        containerStyle={
          isFilterDisabled("preferred_sleep_habit_id")
            ? styles.disabledFilter
            : null
        }
      />

      <View
        style={[
          styles.chipSelectorContainer,
          isFilterDisabled("preferred_pets_id") ? styles.disabledFilter : null,
        ]}
      >
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>
            {t ? t("search.lifestyle.pets") : "Pets"}
          </Text>
          {preferences.preferred_pets_id?.length > 0 && (
            <TouchableOpacity
              onPress={() => handlePreferenceChange("preferred_pets_id", [])}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>
                {t ? t("common.clear") : "Clear"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <MultiSelectChips
          items={(lifestyleInterests.pets || []).map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          selectedItems={preferences.preferred_pets_id || []}
          onSelectItem={(items) => {
            // Check if this is a new filter selection
            const isNewSelection =
              !preferences.preferred_pets_id ||
              preferences.preferred_pets_id.length === 0;

            if (isMaxFiltersSelected && isNewSelection && items.length > 0) {
              Alert.alert(
                t ? t("search.max_filters.title") : "Maximum Filters Reached",
                t
                  ? t("search.max_filters.message")
                  : "You've selected the maximum of 10 filters for the perfect match. To add this filter, please remove another one first.",
                [{ text: t ? t("common.ok") : "OK" }]
              );
              return;
            }

            handlePreferenceChange("preferred_pets_id", items);
          }}
          isRTL={isRTL}
          disabled={isFilterDisabled("preferred_pets_id")}
        />
      </View>

      <ModernDropdown
        label={
          t ? t("search.lifestyle.religiosity_level") : "Religiosity Level"
        }
        value={preferences.preferred_religiosity_level_id}
        items={(religiosityLevels || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_religiosity_level_id", value)
        }
        placeholder={
          t
            ? t("search.lifestyle.select_religiosity_level")
            : "Select religiosity level (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_religiosity_level_id")}
        containerStyle={
          isFilterDisabled("preferred_religiosity_level_id")
            ? styles.disabledFilter
            : null
        }
      />
    </View>
  );
};

export default LifestyleFilterSection;
