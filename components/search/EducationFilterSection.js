import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModernDropdown from "../../components/search/ModernDropdown";

const EducationFilterSection = ({
  t,
  isRTL,
  preferences,
  professionalEducational,
  geographic,
  marriageBudget,
  handlePreferenceChange,
  isFilterDisabled,
  styles,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>
        {t ? t("search.sections.education.title") : "Education & Career"}
      </Text>

      <ModernDropdown
        label={
          t ? t("search.education.educational_level") : "Educational Level"
        }
        value={preferences.preferred_educational_level_id}
        items={(professionalEducational.educationalLevels || []).map(
          (item) => ({
            label: item.name,
            value: item.id,
          })
        )}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_educational_level_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_educational_level")
            : "Select educational level (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_educational_level_id")}
        containerStyle={
          isFilterDisabled("preferred_educational_level_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.education.specialization") : "Specialization"}
        value={preferences.preferred_specialization_id}
        items={(professionalEducational.specializations || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_specialization_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_specialization")
            : "Select specialization (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_specialization_id")}
        containerStyle={
          isFilterDisabled("preferred_specialization_id")
            ? styles.disabledFilter
            : null
        }
      />

      <View
        style={[
          styles.toggleContainerWithLabel,
          isFilterDisabled("preferred_employment_status")
            ? styles.disabledFilter
            : null,
        ]}
      >
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>
            {t ? t("search.education.employment_status") : "Employment Status"}
          </Text>
          {preferences.preferred_employment_status !== null && (
            <TouchableOpacity
              onPress={() => {
                handlePreferenceChange("preferred_employment_status", null);
                if (preferences.preferred_job_title_id) {
                  handlePreferenceChange("preferred_job_title_id", null);
                }
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>
                {t ? t("common.clear") : "Clear"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {preferences.preferred_employment_status !== null ? (
          <View
            style={[styles.toggleButtons, isRTL && styles.toggleButtonsRTL]}
          >
            <TouchableOpacity
              style={[
                styles.toggleButton,
                preferences.preferred_employment_status === true &&
                  styles.activeToggle,
              ]}
              onPress={() =>
                handlePreferenceChange("preferred_employment_status", true)
              }
            >
              <Text
                style={[
                  styles.toggleText,
                  preferences.preferred_employment_status === true &&
                    styles.activeToggleText,
                ]}
              >
                {t ? t("search.education.employed") : "Employed"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                preferences.preferred_employment_status === false &&
                  styles.activeToggle,
              ]}
              onPress={() => {
                handlePreferenceChange("preferred_employment_status", false);
                if (preferences.preferred_job_title_id) {
                  handlePreferenceChange("preferred_job_title_id", null);
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  preferences.preferred_employment_status === false &&
                    styles.activeToggleText,
                ]}
              >
                {t ? t("search.education.not_employed") : "Unemployed"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPreferenceButton}
            onPress={() =>
              handlePreferenceChange("preferred_employment_status", true)
            }
            disabled={isFilterDisabled("preferred_employment_status")}
          >
            <Text style={styles.addPreferenceText}>
              {t
                ? t("search.education.add_employment_preference")
                : "Add employment preference"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {preferences.preferred_employment_status === true && (
        <ModernDropdown
          label={t ? t("search.education.job_title") : "Job Title"}
          value={preferences.preferred_job_title_id}
          items={(professionalEducational.jobTitles || []).map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) =>
            handlePreferenceChange("preferred_job_title_id", value)
          }
          placeholder={
            t
              ? t("search.education.select_job_title")
              : "Select job title (optional)"
          }
          isRTL={isRTL}
          disabled={isFilterDisabled("preferred_job_title_id")}
          containerStyle={
            isFilterDisabled("preferred_job_title_id")
              ? styles.disabledFilter
              : null
          }
        />
      )}

      <ModernDropdown
        label={t ? t("search.education.financial_status") : "Financial Status"}
        value={preferences.preferred_financial_status_id}
        items={(geographic.financialStatuses || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_financial_status_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_financial_status")
            : "Select financial status (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_financial_status_id")}
        containerStyle={
          isFilterDisabled("preferred_financial_status_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.education.marriage_budget") : "Marriage Budget"}
        value={preferences.preferred_marriage_budget_id}
        items={(marriageBudget || []).map((item) => ({
          label: item.name || item.budget || `Budget ${item.id}`,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_marriage_budget_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_marriage_budget")
            : "Select marriage budget (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_marriage_budget_id")}
        containerStyle={
          isFilterDisabled("preferred_marriage_budget_id")
            ? styles.disabledFilter
            : null
        }
      />
    </View>
  );
};

export default EducationFilterSection;
