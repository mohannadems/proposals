import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;
const SWIPE_THRESHOLD = width * 0.3;

const users = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 26,
    location: "New York, NY",
    bio: "Adventure seeker & coffee enthusiast ✨",
    images: ["/placeholder.svg?height=600&width=400"],
    interests: ["Travel", "Photography", "Yoga"],
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 28,
    location: "San Francisco, CA",
    bio: "Tech lover & foodie 🍜",
    images: ["/placeholder.svg?height=600&width=400"],
    interests: ["Cooking", "Gaming", "Hiking"],
  },
  // Add more users as needed
];

const MatchScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: "clamp",
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: gesture.dy },
      duration: 200,
      useNativeDriver: true,
    }).start(() => handleSwipe("right"));
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: gesture.dy },
      duration: 200,
      useNativeDriver: true,
    }).start(() => handleSwipe("left"));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handleSwipe = (direction) => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const renderCard = (user, index) => {
    if (index < currentIndex) return null;

    if (index === currentIndex) {
      const animatedCardStyle = {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate: rotation },
        ],
      };

      return (
        <Animated.View
          key={user.id}
          style={[styles.card, animatedCardStyle]}
          {...panResponder.panHandlers}
        >
          <CardContent user={user} />
        </Animated.View>
      );
    }

    if (index === currentIndex + 1) {
      return (
        <Animated.View
          key={user.id}
          style={[
            styles.card,
            {
              transform: [{ scale: nextCardScale }],
              zIndex: -1,
            },
          ]}
        >
          <CardContent user={user} />
        </Animated.View>
      );
    }

    return null;
  };

  const CardContent = ({ user }) => (
    <>
      <Image source={{ uri: user.images[0] }} style={styles.cardImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <BlurView intensity={80} style={styles.infoContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user.name}, {user.age}
            </Text>
            <Text style={styles.location}>{user.location}</Text>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{user.bio}</Text>
            <View style={styles.interests}>
              {user.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </BlurView>
      </LinearGradient>

      <Animated.View style={[styles.choiceContainer, { opacity: likeOpacity }]}>
        <View style={[styles.choiceBox, styles.likeBox]}>
          <Text style={styles.choiceText}>LIKE</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.choiceContainer, { opacity: nopeOpacity }]}>
        <View style={[styles.choiceBox, styles.nopeBox]}>
          <Text style={styles.choiceText}>NOPE</Text>
        </View>
      </Animated.View>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={styles.progressBar}>
          {users.slice(0, 5).map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index < currentIndex ? styles.progressDotCompleted : null,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.cardContainer}>
        {users.map((user, index) => renderCard(user, index))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={swipeLeft}
        >
          <Feather name="x" size={30} color={COLORS.error} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={swipeRight}
        >
          <Feather name="heart" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.primary,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    position: "absolute",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: COLORS.primary,
  },
  userInfo: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
  },
  bioContainer: {
    gap: 12,
  },
  bio: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: COLORS.white,
  },
  choiceContainer: {
    position: "absolute",
    top: 50,
    padding: 20,
  },
  choiceBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeBox: {
    right: 40,
    borderColor: COLORS.success,
  },
  nopeBox: {
    left: 40,
    borderColor: COLORS.error,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
  },
});

export default MatchScreen;
