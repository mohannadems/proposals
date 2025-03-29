import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../store/slices/profile.slice";
import styles from "../../styles/home";
import i18n from "../i18n";
import { I18nManager } from "react-native";
import { router } from "expo-router";
import COLORS from "../../constants/colors";

const LandingPage = () => {
  const dispatch = useDispatch();
  const scrollY = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const featureAnims = features.map(() => new Animated.Value(0));
  const testimonialAnims = testimonials.map(() => new Animated.Value(0));
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
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
  }, [currentLanguage]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [350, 250],
    extrapolate: "clamp",
  });

  const changeLanguage = (lang) => {
    i18n.locale = lang;
    const isRTL = lang === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
    setCurrentLanguage(lang);
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
            colors={COLORS.primaryGradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
              <Text style={styles.heroTitle}>
                {i18n.t("Find Your Perfect Match")}
              </Text>
              <Text style={styles.heroSubtitle}>
                {i18n.t("Where Meaningful Connections Begin")}
              </Text>
              <TouchableOpacity
                style={styles.heroButton}
                onPress={() => {
                  router.push("/(profile)/fillProfileData");
                }}
              >
                <View style={styles.buttonBlur}>
                  <Text style={styles.heroButtonText}>
                    {i18n.t("Get Started")}
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
              <Text style={styles.statLabel}>{i18n.t("Active Users")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>150K</Text>
              <Text style={styles.statLabel}>{i18n.t("Daily Matches")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>{i18n.t("Success Rate")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t("Premium Features")}</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t("Success Stories")}</Text>
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
                  <View style={styles.testimonialImageWrapper}>
                    <Image
                      source={testimonial.image}
                      style={styles.testimonialImageStyle}
                    />
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

        <View style={styles.languageButtons}>
          <TouchableOpacity
            onPress={() => changeLanguage("en")}
            style={styles.languageButton}
          >
            <Text>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeLanguage("ar")}
            style={styles.languageButton}
          >
            <Text>العربية</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const FeatureIcon = ({ name }) => (
  <View style={styles.featureIconContainer}>
    <Text style={styles.featureIconText}>{name[0].toUpperCase()}</Text>
  </View>
);

const features = [
  {
    icon: () => <FeatureIcon name="Values" />,
    title: "Values-Based Matching",
    description: "Find partners who share your Islamic values",
    height: 200,
  },
  {
    icon: () => <FeatureIcon name="Privacy" />,
    title: "Privacy Protection",
    description: "Maintain modesty with privacy features",
    height: 200,
  },
  {
    icon: () => <FeatureIcon name="Guardian" />,
    title: "Guardian Involvement",
    description: "Include your wali in the process",
    height: 180,
  },
  {
    icon: () => <FeatureIcon name="Compatibility" />,
    title: "Compatibility Quiz",
    description: "Questions on deen, family and lifestyle",
    height: 180,
  },
];

const testimonials = [
  {
    image: require("../../assets/images/11.jpg"),
    text: "This app helped me find someone who truly shares my Islamic values. The guardian feature was especially helpful for my family.",
    name: "Aisha Rahman",
    location: "London, UK",
  },
  {
    image: require("../../assets/images/222.jpg"),
    text: "I appreciated how the app let me filter by prayer habits and other important religious practices. I found my husband here!",
    name: "Muhammad Qasim",
    location: "Dubai, UAE",
  },
  {
    image: require("../../assets/images/5555.jpg"),
    text: "The values-based matching helped me connect with sisters who share my commitment to the deen. Alhamdulillah!",
    name: "Fatima Hassan",
    location: "Toronto, Canada",
  },
];

export default LandingPage;
