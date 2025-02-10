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
import ProfileCompletionAlert from "../../components/profile/ProfileCompletionAlert";
const { width } = Dimensions.get("window");
import { fetchProfile } from "../../store/slices/profile.slice";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  const scrollY = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const featureAnims = features.map(() => new Animated.Value(0));
  const testimonialAnims = testimonials.map(() => new Animated.Value(0));
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

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
    <>
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
          <Animated.View
            style={[styles.heroContainer, { height: headerHeight }]}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View
                style={[styles.heroContent, { opacity: fadeAnim }]}
              >
                <Text style={styles.heroTitle}>
                  Find Your{"\n"}Perfect Match
                </Text>
                <Text style={styles.heroSubtitle}>
                  Where Meaningful Connections Begin
                </Text>
                <TouchableOpacity style={styles.heroButton}>
                  <View style={styles.buttonBlur}>
                    <Text style={styles.heroButtonText}>Get Started</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statsCard}>
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
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Features</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.featureCardContainer,
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
                  <View style={styles.featureCard}>
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
                  </View>
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
                    {/* Centered Image */}
                    <View style={styles.testimonialImageWrapper}>
                      <Image
                        source={testimonial.image}
                        style={styles.testimonialImageStyle}
                      />
                    </View>

                    {/* Testimonial Content */}
                    <Text style={styles.testimonialText}>
                      {testimonial.text}
                    </Text>
                    <Text style={styles.testimonialName}>
                      {testimonial.name}
                    </Text>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: COLORS.white,
    shadowOffset: {
      width: 0,
      height: 10, // Height of the shadow
    },
    shadowOpacity: 0.2, // Opacity of the shadow
    shadowRadius: 15, // Spread of the shadow
    elevation: 12, // Required for Android shadows
    shadowColor: COLORS.text, // Color of the shadow
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
    zIndex: 100,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderColor: COLORS.primary,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
    borderRadius: 20,
    overflow: "hidden",
    background: "transparent",
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
    color: COLORS.text,
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
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
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
  featureCardContainer: {
    width: (width - 56) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
  },
  featureGradient: {
    padding: 20,
    alignItems: "center",
  },
  testimonialContentView: {
    alignItems: "center", // Center content horizontally
    padding: 20,
  },
  testimonialImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 35,
    overflow: "hidden",
    marginBottom: 10,
  },
  testimonialImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  testimonialText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
  testimonialName: {
    fontWeight: "bold",
    textAlign: "center",
  },
  testimonialLocation: {
    color: "gray",
    textAlign: "center",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25, // Circular shape
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  featureIconText: {
    fontSize: 24,
    color: "#ffffff", // Text color
    fontWeight: "bold",
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
    image: require("../../assets/images/11.jpg"),
    text: "I found my soulmate through this app! The smart matching really works.",
    name: "Sarah Johnson",
    location: "New York, NY",
  },
  {
    image: require("../../assets/images/222.jpg"),
    text: "The video chat feature helped me feel safe and comfortable before meeting in person.",
    name: "Michael Chen",
    location: "San Francisco, CA",
  },
  {
    image: require("../../assets/images/5555.jpg"),
    text: "The local events feature helped me meet amazing people in my area.",
    name: "Emma Williams",
    location: "London, UK",
  },
];

export default LandingPage;
