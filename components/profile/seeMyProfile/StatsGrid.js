import React from "react";
import { View } from "react-native";
import StatItem from "./StatItem";
import styles from "../../../styles/seeMyprofile";
const StatsGrid = ({ stats, profile }) => {
  return (
    <View style={styles.statsGrid}>
      {stats.height && (
        <StatItem
          label="Height"
          value={stats.height}
          icon="ruler"
          iconFamily="MaterialCommunityIcons"
        />
      )}
      {stats.weight && (
        <StatItem label="Weight" value={stats.weight} icon="cloud" />
      )}
      {stats.marital_status && (
        <StatItem
          label="Marital Status"
          value={stats.marital_status}
          icon="user"
        />
      )}
      {stats.children !== null && (
        <StatItem label="Children" value={stats.children} icon="users" />
      )}
      <StatItem label="Smoking" value={stats.smoking} icon="x-circle" />
      {stats.drinking && (
        <StatItem
          label="Drinking"
          value={stats.drinking}
          icon="glass-wine"
          iconFamily="MaterialCommunityIcons"
        />
      )}
      {stats.employment && (
        <StatItem
          label="Employment"
          value={stats.employment}
          icon="briefcase"
        />
      )}
      {stats.education && (
        <StatItem label="Education" value={stats.education} icon="book" />
      )}
      {stats.religion && (
        <StatItem label="Religion" value={stats.religion} icon="heart" />
      )}
      {stats.zodiac && (
        <StatItem label="Zodiac" value={stats.zodiac} icon="star" />
      )}
      {stats.sports && (
        <StatItem
          label="Sports Activity"
          value={stats.sports}
          icon="activity"
        />
      )}
      {stats.sleep && (
        <StatItem label="Sleep Habit" value={stats.sleep} icon="moon" />
      )}
      {profile.pets && profile.pets.length > 0 && (
        <StatItem label="Pets" value={profile.pets.join(", ")} icon="github" />
      )}
    </View>
  );
};

export default StatsGrid;
