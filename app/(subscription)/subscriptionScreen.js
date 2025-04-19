import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.5;

const COLORS = {
  primary: "#9e086c",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#9e086c", "#D97485"],
};

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "9.99",
    duration: "month",
    features: [
      "See who likes you",
      "Unlimited likes",
      "Rewind last swipe",
      "Message before matching",
    ],
    notIncluded: [
      "Priority likes",
      "See who viewed you",
      "Premium support",
      "Profile highlighting",
    ],
    gradient: ["#FF9A9E", "#FAD0C4"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "19.99",
    duration: "month",
    popular: true,
    features: [
      "All Basic features",
      "Priority likes",
      "See who viewed you",
      "Premium support",
      "Profile highlighting",
      "Advanced filters",
      "Read receipts",
      "Monthly boosts",
    ],
    gradient: COLORS.primaryGradient,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "199.99",
    duration: "one-time",
    features: [
      "All Premium features",
      "Lifetime access",
      "Priority support",
      "Early access features",
      "Exclusive events",
      "Custom profile themes",
    ],
    gradient: ["#5856D6", "#8E8FE9"],
  },
];

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

const FeatureItem = ({ text, included = true, delay }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ delay: delay * 100, type: "timing", duration: 500 }}
    style={styles.featureItem}
  >
    <View
      style={[
        styles.featureIcon,
        included ? styles.featureIconIncluded : styles.featureIconExcluded,
      ]}
    >
      <Feather
        name={included ? "check" : "x"}
        size={16}
        color={included ? COLORS.success : COLORS.error}
      />
    </View>
    <Text style={[styles.featureText, !included && styles.featureTextDisabled]}>
      {text}
    </Text>
  </MotiView>
);

const SubscriptionCard = ({ plan, selected, onSelect, style, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        style,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect(plan.id);
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={plan.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            {plan.popular && (
              <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "timing", duration: 500 }}
                style={styles.popularBadge}
              >
                <Feather name="star" size={14} color={plan.gradient[0]} />
                <Text style={[styles.popularText, { color: plan.gradient[0] }]}>
                  Most Popular
                </Text>
              </MotiView>
            )}

            <View style={styles.cardHeader}>
              <Text style={[styles.planName, selected && styles.selectedText]}>
                {plan.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text
                  style={[styles.currency, selected && styles.selectedText]}
                >
                  $
                </Text>
                <Text style={[styles.price, selected && styles.selectedText]}>
                  {plan.price}
                </Text>
                <Text
                  style={[styles.duration, selected && styles.selectedText]}
                >
                  /{plan.duration}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, idx) => (
                <FeatureItem key={idx} text={feature} delay={idx} />
              ))}
              {plan.notIncluded?.map((feature, idx) => (
                <FeatureItem
                  key={`not-${idx}`}
                  text={feature}
                  included={false}
                  delay={plan.features.length + idx}
                />
              ))}
            </View>

            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 300, type: "spring" }}
              style={styles.selectButton}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.selectButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.selectButtonText}>
                  {selected ? "Selected" : "Select Plan"}
                </Text>
              </LinearGradient>
            </MotiView>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["rgba(182,81,101,0.2)", "rgba(88,86,214,0.2)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 1000 }}
        style={styles.header}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="crown" size={24} color={COLORS.white} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Unlock premium features and enhance your dating experience
        </Text>
      </MotiView>

      <View style={styles.benefitsContainer}>
        {[
          { icon: "heart", text: "More Matches" },
          { icon: "message-circle", text: "Priority Messages" },
          { icon: "zap", text: "Premium Features" },
        ].map((item, index) => (
          <MotiView
            key={item.icon}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: index * 100, type: "spring" }}
            style={styles.benefitItem}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.benefitIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name={item.icon} size={20} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.benefitText}>{item.text}</Text>
          </MotiView>
        ))}
      </View>

      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        decelerationRate={0.992}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        bounces={false}
      >
        {subscriptionPlans.map((plan, index) => (
          <SubscriptionCard
            key={plan.id}
            plan={plan}
            selected={selectedPlan === plan.id}
            onSelect={setSelectedPlan}
            index={index}
            style={{
              marginLeft: index === 0 ? 20 : 0,
              marginRight: index === subscriptionPlans.length - 1 ? 20 : 10,
            }}
          />
        ))}
      </Animated.ScrollView>

      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 500 }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.subscribeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text
              style={styles.subscribeText}
              onPress={() => router.push("./paymentScreen")}
            >
              Subscribe Now
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
    textAlign: "center",
    marginHorizontal: 40,
  },
  benefitsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  benefitItem: {
    alignItems: "center",
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  benefitText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  scrollContent: {
    paddingRight: 10,
    alignItems: "center",
    paddingVertical: 20,
  },
  cardContainer: {
    padding: 16,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  cardGradient: {
    borderRadius: 16,
    overflow: "hidden",
    height: "100%",
  },
  cardContent: {
    padding: 14,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  popularText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  planName: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  currency: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 48,
  },
  duration: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 20,
  },
  featuresContainer: {
    flex: 1,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIconIncluded: {
    backgroundColor: "rgba(52, 199, 89, 0.1)",
  },
  featureIconExcluded: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  featureText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  featureTextDisabled: {
    opacity: 0.5,
  },
  selectButton: {
    marginTop: "auto",
    borderRadius: 16,
    overflow: "hidden",
  },
  selectButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  selectButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  subscribeButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  subscribeText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  restoreButton: {
    alignItems: "center",
    marginTop: 16,
  },
  restoreText: {
    color: COLORS.text,
    fontSize: 14,
    opacity: 0.7,
  },
});
