// components/SearchResults.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const SearchResults = ({ navigation, results = [], onBack }) => {
  // Placeholder for when no image is available
  const renderProfileImage = (match) => {
    return (
      <View style={styles.profileImageContainer}>
        {match.photo_url ? (
          <Image
            source={{ uri: match.photo_url }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
        )}
        <View style={styles.matchPercentage}>
          <Text style={styles.matchPercentageText}>93%</Text>
        </View>
      </View>
    );
  };

  // Render a single attribute (e.g. age, location)
  const renderAttribute = (icon, text) => {
    if (!text) return null;
    return (
      <View style={styles.attribute}>
        <Ionicons name={icon} size={16} color="#777" />
        <Text style={styles.attributeText}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Matches</Text>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item: match }) => (
            <TouchableOpacity
              style={styles.matchCard}
              onPress={() =>
                navigation.navigate("ProfileDetail", { profileId: match.id })
              }
            >
              {renderProfileImage(match)}

              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>
                  {match.name || "Potential Match"}
                </Text>

                <View style={styles.attributesContainer}>
                  {renderAttribute(
                    "calendar-outline",
                    match.age ? `${match.age} years` : null
                  )}
                  {renderAttribute("location-outline", match.city)}
                  {renderAttribute("business-outline", match.job_title)}
                  {renderAttribute("school-outline", match.education)}
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButtonSecondary}>
                    <Ionicons
                      name="bookmark-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButtonPrimary}>
                    <Text style={styles.actionButtonText}>View Profile</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="search" size={50} color="#FFFFFF" />
          </View>
          <Text style={styles.emptyStateTitle}>No matches found</Text>
          <Text style={styles.emptyStateDescription}>
            Try adjusting your search preferences to find potential matches
          </Text>

          <TouchableOpacity style={styles.modifyButton} onPress={onBack}>
            <Text style={styles.modifyButtonText}>Modify Search</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    height: 180,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  matchPercentage: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  matchPercentageText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  matchInfo: {
    padding: 16,
  },
  matchName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  attributesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  attribute: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  attributeText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  actionButtonSecondary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(158, 8, 108, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
  },
  modifyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  modifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SearchResults;
