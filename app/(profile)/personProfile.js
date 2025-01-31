import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { useLocalSearchParams, router } from "expo-router";

const { width } = Dimensions.get("window");

const PersonProfile = () => {
  const { person } = useLocalSearchParams();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  let matchData;
  try {
    matchData = JSON.parse(person);
  } catch (error) {
    console.error("Error parsing person data:", error);
    matchData = {};
  }

  const safeMatchData = {
    name: matchData.name || "Unknown",
    age: matchData.age || "N/A",
    image: matchData.image || "default_image_url",
    compatibility: matchData.compatibility || 0,
    bio: matchData.bio || "No bio available",
    interests: matchData.interests || [],
    photos: matchData.photos || [],
    occupation: matchData.occupation || "Not specified",
    education: matchData.education || "Not specified",
    height: matchData.height || "Not specified",
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
            <Image source={safeMatchData.image} style={styles.profileImage} />
            <Text style={styles.name}>
              {safeMatchData.name}, {safeMatchData.age}
            </Text>
            <Text style={styles.compatibility}>
              {safeMatchData.compatibility}% Match
            </Text>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioText}>{safeMatchData.bio}</Text>
        <View style={styles.attributesContainer}>
          <View style={styles.attributeItem}>
            <Ionicons
              name="briefcase-outline"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.attributeTextContainer}>
              <Text style={styles.attributeLabel}>Occupation</Text>
              <Text style={styles.attributeValue}>
                {safeMatchData.occupation}
              </Text>
            </View>
          </View>
          <View style={styles.attributeItem}>
            <Ionicons name="school-outline" size={24} color={COLORS.primary} />
            <View style={styles.attributeTextContainer}>
              <Text style={styles.attributeLabel}>Education</Text>
              <Text style={styles.attributeValue}>
                {safeMatchData.education}
              </Text>
            </View>
          </View>
          <View style={styles.attributeItem}>
            <Ionicons name="resize-outline" size={24} color={COLORS.primary} />
            <View style={styles.attributeTextContainer}>
              <Text style={styles.attributeLabel}>Height</Text>
              <Text style={styles.attributeValue}>{safeMatchData.height}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {safeMatchData.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photoGrid}>
          {safeMatchData.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.gridPhoto}
            />
          ))}
        </View>
      </View>

      <View style={styles.expandableSectionsContainer}>
        {["Lifestyle", "Background", "Preferences"].map((section) => (
          <View key={section} style={styles.expandableWrapper}>
            <TouchableOpacity
              style={[
                styles.expandableSection,
                expandedSection === section && styles.expandedSection,
              ]}
              onPress={() => toggleSection(section)}
            >
              <Text style={styles.expandableSectionTitle}>{section}</Text>
              <View style={styles.expandableIcon}>
                <Ionicons
                  name={expandedSection === section ? "remove" : "add"}
                  size={24}
                  color={COLORS.primary}
                />
              </View>
            </TouchableOpacity>
            {expandedSection === section && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedContentText}>
                  Content for {section}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    width: "100%",
  },
  headerGradient: {
    width: "100%",
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    height: 350,
  },
  headerTopRow: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerButton: {
    padding: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  compatibility: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bioSection: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginTop: -30,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bioText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 24,
    textAlign: "center",
    fontStyle: "italic",
  },
  attributesContainer: {
    marginTop: 10,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: COLORS.lightBackground,
    padding: 10,
    borderRadius: 10,
  },
  attributeTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  attributeLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  attributeValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  interestTag: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  interestText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridPhoto: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  expandableSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginBottom: 1,
  },
  expandableSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  expandedContent: {
    padding: 20,
    backgroundColor: COLORS.lightBackground,
  },
  expandableSectionsContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  expandableWrapper: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandableSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  expandedSection: {
    backgroundColor: COLORS.lightBackground,
  },
  expandableSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  expandableIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  expandedContent: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  expandedContentText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
});

export default PersonProfile;
