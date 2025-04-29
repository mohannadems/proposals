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
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "../../constants/colors";
import { useRouter } from "expo-router";
import { matchesService } from "../../services/matchesService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useDispatch } from "react-redux";
import { likeUser } from "../../store/slices/userProfileSlice";
import {
  fetchUserLikes,
  setActiveTab,
} from "../../store/slices/userMatchesSlice";
import { showMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.18;
const HEADER_HEIGHT = Platform.OS === "ios" ? 90 : 70;

const LikedMeScreen = () => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const dispatch = useDispatch();

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(profile)/matchProfile",
      params: {
        userId: user.id,
        fromTab: "likes",
      },
    });
  };

  const handleLikeBack = (user) => {
    setSelectedUser(user);
    setShowLikeModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLikeConfirm = async () => {
    if (!selectedUser) {
      setShowLikeModal(false);
      return;
    }

    try {
      setLikeLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const likeResponse = await dispatch(likeUser(selectedUser.id)).unwrap();

      // Close modal and wait a moment for animation
      setShowLikeModal(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const isMatch = likeResponse?.is_match === true;

      if (isMatch) {
        // Navigate to match screen if it's a match
        router.push({
          pathname: `/match-screen`,
          params: { matchedUserId: selectedUser.id },
        });
      } else {
        // Show success message
        showMessage({
          message: "Success",
          description: `You liked ${selectedUser.first_name}!`,
          type: "success",
        });

        dispatch(setActiveTab("Liked"));

        // Refresh the likes list
        fetchLikesData();
      }
    } catch (error) {
      console.error("Error liking user:", error);

      showMessage({
        message: "Error",
        description:
          currentLanguage === "ar"
            ? "حدثت مشكلة في الإعجاب بهذا الملف الشخصي"
            : "There was a problem liking this profile",
        type: "danger",
      });
    } finally {
      setLikeLoading(false);
      setSelectedUser(null);
    }
  };

  const renderProfileCard = ({ item, index }) => {
    const user = item.liked_user;

    const gradientDirection =
      index % 3 === 0
        ? ["#8A2387", "#E94057"]
        : index % 3 === 1
        ? ["#4568DC", "#B06AB3"]
        : ["#0F2027", "#2C5364"];

    let imageUrl = "https://via.placeholder.com/500x500";

    if (user.photos && user.photos.length > 0) {
      const mainPhoto =
        user.photos.find((photo) => photo.is_main === 1) || user.photos[0];
      if (mainPhoto && mainPhoto.url) {
        if (mainPhoto.url.startsWith("http")) {
          imageUrl = mainPhoto.url;
        } else {
          const baseUrl = "https://proposals.world";
          const photoPath = mainPhoto.url.startsWith("/")
            ? mainPhoto.url
            : `/${mainPhoto.url}`;
          imageUrl = `${baseUrl}${photoPath}`;
        }
      }
    }

    return (
      <Animated.View
        style={[
          styles.card,
          {
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [-100, 0, 150 * index, 150 * (index + 1)],
                  outputRange: [1, 1, 1, 0.98],
                  extrapolate: "clamp",
                }),
              },
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0, 150 * index, 150 * (index + 1)],
                  outputRange: [0, 0, 0, -5],
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
          style={styles.cardTouchable}
        >
          <View style={styles.cardInner}>
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                style={styles.imageGradient}
              />
              <View style={styles.likedBadge}>
                <LinearGradient
                  colors={["#FF4D67", "#FF8A9B"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.likedBadgeGradient}
                >
                  <Text style={styles.likedBadgeText}>
                    {currentLanguage === "ar" ? "معجب بك" : "Liked You"}
                  </Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.userInfoContainer}>
                <Text
                  style={styles.name}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {user.first_name} {user.last_name}
                </Text>
                {(user.age || user.location) && (
                  <Text style={styles.userDetails} numberOfLines={1}>
                    {user.age ? `${user.age}, ` : ""}
                    {user.location || ""}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.likeBackButton}
                onPress={() => handleLikeBack(user)}
              >
                <LinearGradient
                  colors={gradientDirection}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.likeBackGradient}
                >
                  <Text style={styles.likeBackText}>
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
          <View style={styles.emptyStateContainer}>
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

      {/* Like Confirmation Modal */}
      <Modal
        visible={showLikeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLikeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentLanguage === "ar" ? "إعجاب متبادل" : "Like Back"}
            </Text>
            <Text style={styles.modalText}>
              {currentLanguage === "ar"
                ? `هل أنت متأكد أنك تريد الإعجاب بـ ${
                    selectedUser?.first_name || ""
                  }؟`
                : `Are you sure you want to like ${
                    selectedUser?.first_name || ""
                  } back?`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLikeModal(false)}
                disabled={likeLoading}
              >
                <Text style={styles.cancelButtonText}>
                  {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLikeConfirm}
                disabled={likeLoading}
              >
                <LinearGradient
                  colors={COLORS.primaryGradient}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                {likeLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {currentLanguage === "ar" ? "نعم" : "Yes"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 65 : 40,
    paddingBottom: 15,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 0,
    zIndex: 10,
    position: "absolute",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: width * 0.08,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    overflow: "visible",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 18,
    overflow: "hidden",
  },
  cardInner: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 18,
  },
  cardImageContainer: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    borderBottomLeftRadius: 18,
  },
  likedBadge: {
    position: "absolute",
    bottom: 10,
    left: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  likedBadgeGradient: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  likedBadgeText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    flexDirection: "column",
  },
  userInfoContainer: {
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 14,
    color: "#718096",
  },
  likeBackButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
  likeBackGradient: {
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  likeBackText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    width: "100%",
  },
  noLikesText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  noLikesSubtext: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#4A5568",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
    marginRight: 10,
  },
  confirmButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#4A5568",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default LikedMeScreen;
