import React, { useRef } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/colors";
const matches = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    bio: "Adventurous soul seeking new experiences",
    image: require("../../assets/images/11.jpg"),
    interests: ["Hiking", "Photography", "Cooking"],
    compatibility: 95,
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 25,
    bio: "Passionate about art and travel",
    image: require("../../assets/images/222.jpg"),
    interests: ["Painting", "Yoga", "Reading"],
    compatibility: 88,
  },
  {
    id: 3,
    name: "Michael Johnson",
    age: 32,
    bio: "Tech enthusiast and coffee lover",
    image: require("../../assets/images/444.jpg"),
    interests: ["Coding", "Coffee tasting", "Running"],
    compatibility: 92,
  },
  {
    id: 4,
    name: "Emily Brown",
    age: 27,
    bio: "Nature lover and animal rights advocate",
    image: require("../../assets/images/3333.jpg"),
    interests: ["Volunteering", "Gardening", "Meditation"],
    compatibility: 90,
  },
  {
    id: 5,
    name: "David Lee",
    age: 30,
    bio: "Fitness junkie with a passion for healthy living",
    image: require("../../assets/images/5555.jpg"),
    interests: ["Weightlifting", "Nutrition", "Hiking"],
    compatibility: 87,
  },
];

const MatchCard = ({ match, onPress }) => (
  <TouchableOpacity style={styles.matchCard} onPress={onPress}>
    <Image source={match.image} style={styles.matchImage} />
    <LinearGradient
      colors={["transparent", "rgba(0,0,0,0.8)"]}
      style={styles.gradient}
    >
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>
          {match.name}, {match.age}
        </Text>
        <Text style={styles.matchBio}>{match.bio}</Text>
        <View style={styles.interestsContainer}>
          {match.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
    <View style={styles.compatibilityBadge}>
      <Text style={styles.compatibilityText}>{match.compatibility}%</Text>
    </View>
  </TouchableOpacity>
);

export default function MatchesScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [180, 80],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const collapsedHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View
            style={[styles.headerContent, { opacity: headerOpacity }]}
          >
            <Text style={styles.headerSubtitle}>Discover Your</Text>
            <Text style={styles.headerTitle}>Perfect Match</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.collapsedHeaderContent,
              { opacity: collapsedHeaderOpacity },
            ]}
          >
            <Text style={styles.collapsedHeaderTitle}>Matches</Text>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      <Animated.FlatList
        data={matches}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() =>
              router.push({
                pathname: "/(profile)/personProfile",
                params: { person: JSON.stringify(item) },
              })
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 30,
  },
  collapsedHeaderContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 35,
  },
  collapsedHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
  },
  content: {
    paddingTop: 190,
    paddingHorizontal: 16,
  },
  matchCard: {
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 20,
  },
  matchInfo: {
    justifyContent: "flex-end",
  },
  matchName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 8,
  },
  matchBio: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  interestTag: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  compatibilityBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  compatibilityText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
