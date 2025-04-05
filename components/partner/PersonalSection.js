import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";

const PersonalSection = ({
  preferences,
  onChange,
  personalAttributes,
  onComplete,
  styles,
  isRTL = false,
  t,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          {t
            ? t("search.personal.description")
            : "Set preferences for physical and personal attributes"}
        </Text>
      </View>

      <ModernDropdown
        label={t ? t("search.personal.height") : "Height"}
        value={preferences.preferred_height_id}
        items={personalAttributes.heights.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_height_id", value)}
        placeholder={
          t ? t("search.personal.select_height") : "Select height (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.personal.weight") : "Weight"}
        value={preferences.preferred_weight_id}
        items={personalAttributes.weights.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_weight_id", value)}
        placeholder={
          t ? t("search.personal.select_weight") : "Select weight (optional)"
        }
        isRTL={isRTL}
      />

      <ModernDropdown
        label={t ? t("search.personal.marital_status") : "Marital Status"}
        value={preferences.preferred_marital_status_id}
        items={personalAttributes.maritalStatuses.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_marital_status_id", value)
        }
        placeholder={
          t
            ? t("search.personal.select_marital_status")
            : "Select marital status (optional)"
        }
        isRTL={isRTL}
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
          onChange("preferred_social_media_presence_id", value)
        }
        placeholder={
          t
            ? t("search.personal.select_social_media")
            : "Select social media presence (optional)"
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

export default memo(PersonalSection);
