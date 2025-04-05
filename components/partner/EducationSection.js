import React, { memo, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";
import { selectDirectMarriageBudget } from "../../store/slices/profileAttributesSlice";

const EducationSection = ({
  preferences,
  onChange,
  professionalEducational,
  geographic,
  styles,
  onComplete,
  isRTL = false,
  t,
}) => {
  const marriageBudget = useSelector(selectDirectMarriageBudget);
  const dispatch = useDispatch();

  useEffect(() => {}, [
    marriageBudget,
    professionalEducational,
    preferences.preferred_employment_status,
    dispatch,
  ]);

  const getBudgetItems = () => {
    if (!marriageBudget || marriageBudget.length === 0) {
      return [];
    }

    return marriageBudget.map((item) => ({
      label: item.name || item.budget || `Budget ${item.id}`,
      value: item.id,
    }));
  };

  const shouldShowJobTitle = preferences.preferred_employment_status === true;

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          {t
            ? t("search.education.description")
            : "Specify educational and career preferences for your ideal match"}
        </Text>
      </View>

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
          onChange("preferred_educational_level_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_educational_level")
            : "Select educational level (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.education.specialization") : "Specialization"}
        value={preferences.preferred_specialization_id}
        items={(professionalEducational.specializations || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_specialization_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_specialization")
            : "Select specialization (optional)"
        }
        isRTL={isRTL}
      />

      <View style={styles.toggleContainerWithLabel}>
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>
            {t ? t("search.education.employment_status") : "Employment Status"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              onChange("preferred_employment_status", null);
              if (preferences.preferred_job_title_id) {
                onChange("preferred_job_title_id", null);
              }
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>
              {t ? t("common.clear") : "Clear"}
            </Text>
          </TouchableOpacity>
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
              onPress={() => onChange("preferred_employment_status", true)}
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
                onChange("preferred_employment_status", false);
                if (preferences.preferred_job_title_id) {
                  onChange("preferred_job_title_id", null);
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
            onPress={() => onChange("preferred_employment_status", true)}
          >
            <Text style={styles.addPreferenceText}>
              {t
                ? t("search.education.add_employment_preference")
                : "Add employment preference"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {shouldShowJobTitle && (
        <ModernDropdown
          label={t ? t("search.education.job_title") : "Job Title"}
          value={preferences.preferred_job_title_id}
          items={(professionalEducational.jobTitles || []).map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) => onChange("preferred_job_title_id", value)}
          placeholder={
            t
              ? t("search.education.select_job_title")
              : "Select job title (optional)"
          }
          isRTL={isRTL}
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
          onChange("preferred_financial_status_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_financial_status")
            : "Select financial status (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.education.marriage_budget") : "Marriage Budget"}
        value={preferences.preferred_marriage_budget_id}
        items={getBudgetItems()}
        onValueChange={(value) =>
          onChange("preferred_marriage_budget_id", value)
        }
        placeholder={
          t
            ? t("search.education.select_marriage_budget")
            : "Select marriage budget (optional)"
        }
        isRTL={isRTL}
      />

      <TouchableOpacity
        style={styles.completeSectionButton}
        onPress={onComplete}
      >
        <Text style={styles.completeSectionButtonText}>
          {t
            ? t("search.basic_info.save_complete")
            : "Save & Complete This Section"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(EducationSection);
