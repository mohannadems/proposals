import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

const { width } = Dimensions.get("window");

const SearchResults = ({ results, onBack }) => {
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate results in when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle share functionality
  const handleShare = async (profile) => {
    try {
      await Share.share({
        message: `Check out this profile: ${profile.name}, ${profile.age} | ${profile.city_name}, ${profile.country_name}`,
        title: "Share Profile",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Handle empty results
  if (!results || results.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <LinearGradient colors={COLORS.primaryGradient} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Search Results</Text>
            <View style={styles.emptySpace} />
          </View>
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/11.jpg")} // Make sure to add this image to your assets
            style={styles.emptyImage}
            defaultSource={require("../../assets/images/11.jpg")}
          />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your preferences to find more matches
          </Text>
          <TouchableOpacity style={styles.returnButton} onPress={onBack}>
            <Text style={styles.returnButtonText}>Return to Search</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <LinearGradient colors={COLORS.primaryGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultsSummary}>
          <Text style={styles.resultCount}>{results.length} matches found</Text>
        </View>
      </LinearGradient>

      <Animated.FlatList
        data={results}
        renderItem={({ item, index }) => {
          // Calculate animation delay based on index
          const itemFade = new Animated.Value(0);
          const itemSlide = new Animated.Value(50);

          // Start item animation with staggered delay
          Animated.parallel([
            Animated.timing(itemFade, {
              toValue: 1,
              duration: 400,
              delay: index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(itemSlide, {
              toValue: 0,
              duration: 400,
              delay: index * 100,
              useNativeDriver: true,
            }),
          ]).start();

          return (
            <Animated.View
              style={[
                styles.resultCardContainer,
                {
                  opacity: itemFade,
                  transform: [{ translateY: itemSlide }],
                },
              ]}
            >
              <View style={styles.resultCard}>
                <Image
                  source={{
                    uri:
                      item.profile_picture || "https://via.placeholder.com/150",
                  }}
                  style={styles.profileImage}
                  defaultSource={require("../../assets/images/11.jpg")} // Make sure to have this default image in assets
                />

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  style={styles.imageOverlay}
                >
                  <Text style={styles.profileName}>
                    {item.name || "User"}, {item.age || "?"}
                  </Text>
                  <Text style={styles.profileLocation}>
                    {item.city_name || "Unknown"}, {item.country_name || ""}
                  </Text>
                </LinearGradient>

                <View style={styles.profileInfo}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Education</Text>
                      <Text style={styles.infoValue}>
                        {item.education_name || "Not specified"}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Occupation</Text>
                      <Text style={styles.infoValue}>
                        {item.job_title || "Not specified"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Marital Status</Text>
                      <Text style={styles.infoValue}>
                        {item.marital_status || "Not specified"}
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Height</Text>
                      <Text style={styles.infoValue}>
                        {item.height || "Not specified"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShare(item)}
                  >
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.viewProfileButton}>
                    <Text style={styles.viewProfileText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          );
        }}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  backButton: {
    padding: 6,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "500",
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  filterButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  emptySpace: {
    width: 50, // Match the width of the back button for center alignment
  },
  resultsSummary: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultCount: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "500",
    opacity: 0.9,
  },
  resultsList: {
    padding: 16,
    paddingBottom: 30,
  },
  resultCardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E1E1E1", // Placeholder color
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileLocation: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileInfo: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    padding: 12,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.divider,
  },
  shareButtonText: {
    color: COLORS.text,
    fontWeight: "500",
  },
  viewProfileButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: "center",
  },
  viewProfileText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  returnButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  returnButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SearchResults;
