"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import { matchesService } from "../../services/matchesService";
import { BASE_URL } from "../../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const HEADER_HEIGHT = Platform.OS === "ios" ? 100 : 80;

const LikedMeScreen = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Load language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const lang = (await AsyncStorage.getItem("userLanguage")) || "en";
        setCurrentLanguage(lang);
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };
    loadLanguage();
  }, []);

  const fetchLikesData = async () => {
    try {
      setError(null);
      const likesData = await matchesService.getLikes();
      setLikes(likesData);
    } catch (error) {
      console.error("Error fetching likes:", error);
      setError(error.message || "Error fetching likes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLikesData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLikesData();
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const handleCardPress = (user) => {
    router.push({
      pathname: "/(profile)/matchProfile",
      params: {
        userId: user.id,
        fromTab: "likes",
      },
    });
  };

  const handleLikeBack = async (user) => {
    const likeBackText =
      currentLanguage === "ar" ? "إعجاب متبادل" : "Like Back";
    const confirmText =
      currentLanguage === "ar"
        ? `هل أنت متأكد أنك تريد الإعجاب بـ ${user.first_name}؟`
        : `Are you sure you want to like ${user.first_name} back?`;
    const cancelText = currentLanguage === "ar" ? "إلغاء" : "Cancel";
    const yesText = currentLanguage === "ar" ? "نعم" : "Yes";

    Alert.alert(likeBackText, confirmText, [
      {
        text: cancelText,
        style: "cancel",
      },
      {
        text: yesText,
        onPress: async () => {
          try {
            // TODO: Implement your like API call here
            // await matchesService.likeUser(user.id);
            console.log("Liking back user:", user.id);
            await fetchLikesData();
          } catch (error) {
            const errorText =
              currentLanguage === "ar"
                ? "فشل في الإعجاب. يرجى المحاولة مرة أخرى."
                : "Failed to like user back. Please try again.";
            Alert.alert(currentLanguage === "ar" ? "خطأ" : "Error", errorText);
          }
        },
      },
    ]);
  };

  const renderProfileCard = ({ item, index }) => {
    const user = item.liked_user;
    const gradientDirection =
      index % 2 === 0 ? ["#9e086c", "#c7097e"] : ["#c7097e", "#9e086c"];

    const mainPhoto =
      user.photos?.find((photo) => photo.is_main) || user.photos?.[0];
    const imageUrl = mainPhoto?.url
      ? `${mainPhoto.url.startsWith("http") ? "" : BASE_URL}${mainPhoto.url}`
      : "https://via.placeholder.com/500x500";

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-100, 0, 100 * index, 100 * (index + 1)],
                  outputRange: [1, 1, 1, 0.95],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleCardPress(user)}
          activeOpacity={0.9}
        >
          <View style={styles.cardImageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.imageGradient}
              start={{ x: 0, y: 0.6 }}
              end={{ x: 0, y: 1 }}
            />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {user.first_name} {user.last_name}
              </Text>
              <TouchableOpacity style={styles.favoriteButton}>
                <View style={styles.favoriteIconContainer}>
                  <Text style={styles.favoriteIcon}>♥</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => handleLikeBack(user)}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>
                    {currentLanguage === "ar" ? "إعجاب متبادل" : "Like Back"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLikesData}>
          <Text style={styles.retryButtonText}>
            {currentLanguage === "ar" ? "إعادة المحاولة" : "Retry"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!likes || likes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />

        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslate }],
            },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {currentLanguage === "ar" ? "معجبون بك" : "Likes You"}
            </Text>
          </View>
        </Animated.View>

        <View
          style={[styles.centerContent, { paddingTop: HEADER_HEIGHT + 20 }]}
        >
          <Text style={styles.noLikesText}>
            {currentLanguage === "ar"
              ? "لم يعجب بك أحد بعد"
              : "No one has liked you yet"}
          </Text>
          <Text style={styles.noLikesSubtext}>
            {currentLanguage === "ar"
              ? "استمر في التمرير للعثور على تطابقاتك!"
              : "Keep swiping to find your matches!"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {currentLanguage === "ar" ? "معجبون بك" : "Likes You"}
          </Text>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={likes}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          { paddingTop: HEADER_HEIGHT + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
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
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    zIndex: 10,
    position: "absolute",
    width: "100%",
  },
  headerContent: {
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: width * 0.09,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginBottom: 30,
    overflow: "hidden",
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
    width: CARD_WIDTH,
    alignSelf: "center",
    transform: [{ translateY: 0 }],
  },
  cardImageContainer: {
    position: "relative",
    height: height * 0.25,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  cardContent: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(158, 8, 108, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error || "#ff0000",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  noLikesText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  noLikesSubtext: {
    fontSize: 16,
    color: COLORS.textLight || COLORS.text,
    opacity: 0.7,
  },
});

export default LikedMeScreen;
