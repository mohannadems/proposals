import React from "react";
import { View, Text } from "react-native";
import ModernDropdown from "../../components/search/ModernDropdown";

const PersonalFilterSection = ({
  t,
  isRTL,
  preferences,
  personalAttributes,
  handlePreferenceChange,
  isFilterDisabled,
  styles,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>
        {t ? t("search.sections.personal.title") : "Personal Attributes"}
      </Text>

      <ModernDropdown
        label={t ? t("search.personal.height") : "Height"}
        value={preferences.preferred_height_id}
        items={(personalAttributes.heights || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_height_id", value)
        }
        placeholder={
          t ? t("search.personal.select_height") : "Select height (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_height_id")}
        containerStyle={
          isFilterDisabled("preferred_height_id") ? styles.disabledFilter : null
        }
      />

      <ModernDropdown
        label={t ? t("search.personal.weight") : "Weight"}
        value={preferences.preferred_weight_id}
        items={(personalAttributes.weights || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_weight_id", value)
        }
        placeholder={
          t ? t("search.personal.select_weight") : "Select weight (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_weight_id")}
        containerStyle={
          isFilterDisabled("preferred_weight_id") ? styles.disabledFilter : null
        }
      />

      <ModernDropdown
        label={t ? t("search.personal.marital_status") : "Marital Status"}
        value={preferences.preferred_marital_status_id}
        items={(personalAttributes.maritalStatuses || []).map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_marital_status_id", value)
        }
        placeholder={
          t
            ? t("search.personal.select_marital_status")
            : "Select marital status (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_marital_status_id")}
        containerStyle={
          isFilterDisabled("preferred_marital_status_id")
            ? styles.disabledFilter
            : null
        }
      />

      <ModernDropdown
        label={t ? t("search.personal.social_media") : "Social Media Presence"}
        value={preferences.preferred_social_media_presence_id}
        items={[
          {
            label: t
              ? t("search.personal.social_media_options.active")
              : "Active on social media",
            value: 1,
          },
          {
            label: t
              ? t("search.personal.social_media_options.moderate")
              : "Moderate social media use",
            value: 2,
          },
          {
            label: t
              ? t("search.personal.social_media_options.limited")
              : "Limited social media use",
            value: 3,
          },
          {
            label: t
              ? t("search.personal.social_media_options.none")
              : "No social media presence",
            value: 4,
          },
        ]}
        onValueChange={(value) =>
          handlePreferenceChange("preferred_social_media_presence_id", value)
        }
        placeholder={
          t
            ? t("search.personal.select_social_media")
            : "Select social media presence (optional)"
        }
        isRTL={isRTL}
        disabled={isFilterDisabled("preferred_social_media_presence_id")}
        containerStyle={
          isFilterDisabled("preferred_social_media_presence_id")
            ? styles.disabledFilter
            : null
        }
      />
    </View>
  );
};

export default PersonalFilterSection;
