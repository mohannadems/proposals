import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import wrappedScreen from "../../components/profile/wrappedScreen";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../store/slices/profile.slice";
import createHomeStyles from "../../styles/home";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";

const featureIconStyles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

const FeatureIcon = ({ name }) => (
  <View style={featureIconStyles.container}>
    <Text style={featureIconStyles.text}>{name[0].toUpperCase()}</Text>
  </View>
);

const features = [
  {
    key: "values_based",
    icon: () => <FeatureIcon name="Values" />,
    height: 200,
  },
  {
    key: "privacy",
    icon: () => <FeatureIcon name="Privacy" />,
    height: 200,
  },
  {
    key: "guardian",
    icon: () => <FeatureIcon name="Guardian" />,
    height: 180,
  },
  {
    key: "compatibility",
    icon: () => <FeatureIcon name="Compatibility" />,
    height: 180,
  },
];

const testimonials = [
  {
    key: "aisha",
    image: require("../../assets/images/11.jpg"),
  },
  {
    key: "muhammad",
    image: require("../../assets/images/222.jpg"),
  },
  {
    key: "fatima",
    image: require("../../assets/images/5555.jpg"),
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createHomeStyles(isRTL);

  const scrollY = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const featureAnims = features.map(() => new Animated.Value(0));
  const testimonialAnims = testimonials.map(() => new Animated.Value(0));

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    fadeAnim.setValue(0);
    featureAnims.forEach((anim) => anim.setValue(0));
    testimonialAnims.forEach((anim) => anim.setValue(0));

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
  }, [isRTL]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [350, 250],
    extrapolate: "clamp",
  });

  const safeTranslate = (key, fallback) => {
    try {
      const translated = t(key);
      console.log(`Translation for ${key}:`, translated);
      return translated || fallback;
    } catch (error) {
      console.error(`Translation error for ${key}:`, error);
      return fallback;
    }
  };

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
        <Animated.View style={[styles.heroContainer, { height: headerHeight }]}>
          <LinearGradient
            colors={COLORS.primaryGradient || ["#6366F1", "#8B5CF6"]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
              <Text style={styles.heroTitle}>
                {safeTranslate("home.find_match", "Find Your Match")}
              </Text>
              <Text style={styles.heroSubtitle}>
                {safeTranslate(
                  "home.connections_begin",
                  "Begin Meaningful Connections"
                )}
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => {
                  router.push("/(profile)/fillProfileData");
                }}
              >
                <View style={styles.buttonBlur}>
                  <Text style={styles.heroButtonText}>
                    {safeTranslate("home.get_started", "Get Started")}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2M+</Text>
              <Text style={styles.statLabel}>
                {safeTranslate("home.active_users", "Active Users")}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150K</Text>
              <Text style={styles.statLabel}>
                {safeTranslate("home.daily_matches", "Daily Matches")}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>
                {safeTranslate("home.success_rate", "Success Rate")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {safeTranslate("home.premium_features", "Premium Features")}
          </Text>
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
                <View style={[styles.featureCard, { height: feature.height }]}>
                  <LinearGradient
                    colors={[COLORS.white, "#F8F9FA"]}
                    style={styles.featureGradient}
                  >
                    <View style={styles.featureIcon}>{feature.icon()}</View>
                    <Text style={styles.featureTitle}>
                      {safeTranslate(
                        `home.features.${feature.key}.title`,
                        `${feature.key} Feature`
                      )}
                    </Text>
                    <Text style={styles.featureDescription}>
                      {safeTranslate(
                        `home.features.${feature.key}.description`,
                        `Description for ${feature.key} feature`
                      )}
                    </Text>
                  </LinearGradient>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {safeTranslate("home.success_stories", "Success Stories")}
          </Text>
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
                      { scaleX: isRTL ? -1 : 1 },
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
                  <View style={styles.testimonialImageWrapper}>
                    <Image
                      source={testimonial.image}
                      style={styles.testimonialImageStyle}
                    />
                  </View>
                  <Text style={styles.testimonialText}>
                    {safeTranslate(
                      `home.testimonials.${testimonial.key}.text`,
                      `Testimonial for ${testimonial.key}`
                    )}
                  </Text>
                  <Text style={styles.testimonialName}>
                    {safeTranslate(
                      `home.testimonials.${testimonial.key}.name`,
                      `${testimonial.key} Name`
                    )}
                  </Text>
                  <Text style={styles.testimonialLocation}>
                    {safeTranslate(
                      `home.testimonials.${testimonial.key}.location`,
                      `${testimonial.key} Location`
                    )}
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

export default LandingPage;
