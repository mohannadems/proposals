import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#B65165",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#B65165", "#D97485"],
};

const LandingPage = () => {
  const scrollY = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const featureAnims = features.map(() => new Animated.Value(0));
  const testimonialAnims = testimonials.map(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      300,
      featureAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();

    Animated.stagger(
      300,
      testimonialAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [350, 250],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroContainer, { height: headerHeight }]}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
              <Text style={styles.heroTitle}>Find Your{"\n"}Perfect Match</Text>
              <Text style={styles.heroSubtitle}>
                Where Meaningful Connections Begin
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <BlurView intensity={100} style={styles.buttonBlur}>
                  <Text style={styles.heroButtonText}>Get Started</Text>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <BlurView intensity={70} style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2M+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150K</Text>
              <Text style={styles.statLabel}>Daily Matches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </BlurView>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    opacity: featureAnims[index],
                    transform: [
                      {
                        translateY: featureAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[COLORS.white, "#F8F9FA"]}
                  style={styles.featureGradient}
                >
                  <View style={styles.featureIcon}>
                    <feature.icon />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Success Stories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.testimonialScroll}
          >
            {testimonials.map((testimonial, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.testimonialCard,
                  {
                    opacity: testimonialAnims[index],
                    transform: [
                      {
                        translateX: testimonialAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.testimonialContentView}>
                  <View style={styles.testimonialImage}>
                    <Text style={styles.testimonialInitials}>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <Text style={styles.testimonialText}>{testimonial.text}</Text>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialLocation}>
                    {testimonial.location}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 320,
    width: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  heroContent: {
    marginTop: 60,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.white,
    lineHeight: 56,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 25,
  },
  heroButton: {
    width: 180,
    height: 50,
    overflow: "hidden",
    borderRadius: 28,
  },
  buttonBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  statsContainer: {
    marginTop: -18,
    marginHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    padding: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -8,
  },
  featureCard: {
    width: (width - 56) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featureGradient: {
    padding: 20,
    alignItems: "center",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: "center",
  },
  testimonialScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  testimonialCard: {
    width: width - 80,
    marginRight: 16,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  testimonialImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: "center",
  },
  testimonialText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  testimonialName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  testimonialLocation: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: "center",
  },
});

// Mock data for features
const FeatureIcon = ({ name }) => (
  <View style={styles.featureIconContainer}>
    <Text style={styles.featureIconText}>{name[0].toUpperCase()}</Text>
  </View>
);

const features = [
  {
    icon: () => <FeatureIcon name="Smart" />,
    title: "Smart Matching",
    description: "AI-powered algorithm finds your perfect match",
  },
  {
    icon: () => <FeatureIcon name="Video" />,
    title: "Video Chat",
    description: "Connect face-to-face before meeting",
  },
  {
    icon: () => <FeatureIcon name="Verified" />,
    title: "Verified Profiles",
    description: "100% real people, verified through AI",
  },
  {
    icon: () => <FeatureIcon name="Events" />,
    title: "Events",
    description: "Join local events and meetups",
  },
];

// Mock data for testimonials
const testimonials = [
  {
    image: "https://example.com/placeholder.jpg",
    text: "I found my soulmate through this app! The smart matching really works.",
    name: "Sarah Johnson",
    location: "New York, NY",
  },
  {
    image: "https://example.com/placeholder.jpg",
    text: "The video chat feature helped me feel safe and comfortable before meeting in person.",
    name: "Michael Chen",
    location: "San Francisco, CA",
  },
  {
    image: "https://example.com/placeholder.jpg",
    text: "The local events feature helped me meet amazing people in my area.",
    name: "Emma Williams",
    location: "London, UK",
  },
];

export default LandingPage;
