// components/search/sections/PersonalSection.js
import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/SearchScreen";
import ModernDropdown from "../search/ModernDropdown";

const PersonalSection = ({
  preferences,
  onChange,
  personalAttributes,
  onComplete,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionDescription}>
        <Text style={styles.descriptionText}>
          Set preferences for physical and personal attributes
        </Text>
      </View>

      <ModernDropdown
        label="Height"
        value={preferences.preferred_height_id}
        items={personalAttributes.heights.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_height_id", value)}
        placeholder="Select height (optional)"
      />

      <ModernDropdown
        label="Weight"
        value={preferences.preferred_weight_id}
        items={personalAttributes.weights.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) => onChange("preferred_weight_id", value)}
        placeholder="Select weight (optional)"
      />

      <ModernDropdown
        label="Marital Status"
        value={preferences.preferred_marital_status_id}
        items={personalAttributes.maritalStatuses.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onValueChange={(value) =>
          onChange("preferred_marital_status_id", value)
        }
        placeholder="Select marital status (optional)"
      />

      <ModernDropdown
        label="Social Media Presence"
        value={preferences.preferred_social_media_presence_id}
        items={[
          { label: "Active on social media", value: 1 },
          { label: "Moderate social media use", value: 2 },
          { label: "Limited social media use", value: 3 },
          { label: "No social media presence", value: 4 },
        ]}
        onValueChange={(value) =>
          onChange("preferred_social_media_presence_id", value)
        }
        placeholder="Select social media presence (optional)"
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

export default memo(PersonalSection);
