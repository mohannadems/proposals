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
  onComplete,
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
          Specify educational and career preferences for your ideal match
        </Text>
      </View>

      <ModernDropdown
        label="Educational Level"
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
        placeholder="Select educational level (optional)"
      />

      <ModernDropdown
        label="Specialization"
        value={preferences.preferred_specialization_id}
        items={(professionalEducational.specializations || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_specialization_id", value)
        }
        placeholder="Select specialization (optional)"
      />

      <View style={styles.toggleContainerWithLabel}>
        <View style={styles.toggleLabelRow}>
          <Text style={styles.inputLabel}>Employment Status</Text>
          <TouchableOpacity
            onPress={() => {
              onChange("preferred_employment_status", null);
              if (preferences.preferred_job_title_id) {
                onChange("preferred_job_title_id", null);
              }
            }}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>

        {preferences.preferred_employment_status !== null ? (
          <View style={styles.toggleButtons}>
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
                Employed
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
                Unemployed
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addPreferenceButton}
            onPress={() => onChange("preferred_employment_status", true)}
          >
            <Text style={styles.addPreferenceText}>
              Add employment preference
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {shouldShowJobTitle && (
        <ModernDropdown
          label="Job Title"
          value={preferences.preferred_job_title_id}
          items={(professionalEducational.jobTitles || []).map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          onValueChange={(value) => onChange("preferred_job_title_id", value)}
          placeholder="Select job title (optional)"
        />
      )}

      <ModernDropdown
        label="Financial Status"
        value={preferences.preferred_financial_status_id}
        items={(geographic.financialStatuses || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_financial_status_id", value)
        }
        placeholder="Select financial status (optional)"
      />

      <ModernDropdown
        label="Marriage Budget"
        value={preferences.preferred_marriage_budget_id}
        items={getBudgetItems()}
        onValueChange={(value) =>
          onChange("preferred_marriage_budget_id", value)
        }
        placeholder="Select marriage budget (optional)"
      />

      <TouchableOpacity
        style={styles.completeSectionButton}
        onPress={onComplete}
      >
        <Text style={styles.completeSectionButtonText}>
          Save & Complete This Section
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(EducationSection);
