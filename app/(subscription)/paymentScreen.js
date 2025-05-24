import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SubscriptionCard from "../../components/subscriptions/SubscriptionCard";
import COLORS from "../../constants/colors";
import {
  fetchSubscriptionCards,
  selectPlan,
} from "../../store/slices/subscriptionSlice";
import { useRouter } from "expo-router";
import { LanguageContext } from "../../contexts/LanguageContext";
import styles from "../../styles/PaymentScreenStyles";
const { width } = Dimensions.get("window");

const PaymentScreen = ({ route }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isRTL, t } = useContext(LanguageContext);
  const { subscriptionCards, loading, error, selectedPlan } = useSelector(
    (state) => state.subscription
  );
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  const params = route?.params || {};
  const { preselectedPlan } = params;

  useEffect(() => {
    dispatch(fetchSubscriptionCards());
  }, [dispatch]);

  useEffect(() => {
    if (preselectedPlan && subscriptionCards.length > 0) {
      const index = subscriptionCards.findIndex(
        (plan) => plan.package_name === preselectedPlan.package_name
      );
      if (index !== -1) {
        handleSelectPlan(subscriptionCards[index], index);
      }
    }
  }, [preselectedPlan, subscriptionCards]);

  const handleSelectPlan = (plan, index) => {
    setSelectedCardIndex(index);
    dispatch(selectPlan(plan));
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      Alert.alert(
        t ? t("subscription.select_plan_title") : "Please select a plan",
        t
          ? t("subscription.select_plan_message")
          : "You need to choose a subscription plan to continue.",
        [{ text: t ? t("common.ok") : "OK", style: "default" }]
      );
      return;
    }
    router.push({
      pathname: "/(subscription)/CheckoutScreen",
      params: {
        package_name: selectedPlan.package_name,
        price: selectedPlan.price,
        contact_limit: selectedPlan.contact_limit,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.headerGradient}
      >
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t ? t("subscription.choose_plan") : "Choose Your Plan"}
          </Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isRTL && { alignItems: "flex-end" }}
      >
        <Text style={[styles.title, isRTL && styles.textRTL]}>
          {t ? t("subscription.upgrade_experience") : "Upgrade Your Experience"}
        </Text>
        <Text style={[styles.subtitle, isRTL && styles.textRTL]}>
          {t
            ? t("subscription.select_perfect_plan")
            : "Select the perfect plan for your needs"}
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.cardsContainer}>
          {subscriptionCards.map((plan, index) => (
            <SubscriptionCard
              key={index}
              plan={plan}
              isSelected={selectedCardIndex === index}
              onSelect={handleSelectPlan}
              index={index}
              isRTL={isRTL}
            />
          ))}
        </View>

        <View style={styles.featuresList}>
          <Text style={[styles.allPlansTitle, isRTL && styles.textRTL]}>
            {t ? t("subscription.all_plans_include") : "All Plans Include:"}
          </Text>
          <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text
              style={[
                styles.featureText,
                isRTL ? styles.featureTextRTL : styles.featureTextLTR,
              ]}
            >
              {t ? t("subscription.unlimited_swipes") : "Unlimited swipes"}
            </Text>
          </View>
          <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text
              style={[
                styles.featureText,
                isRTL ? styles.featureTextRTL : styles.featureTextLTR,
              ]}
            >
              {t ? t("subscription.message_encryption") : "Message encryption"}
            </Text>
          </View>
          <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text
              style={[
                styles.featureText,
                isRTL ? styles.featureTextRTL : styles.featureTextLTR,
              ]}
            >
              {t
                ? t("subscription.profile_visibility")
                : "Profile visibility control"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            !selectedPlan && styles.subscribeButtonDisabled,
          ]}
          onPress={handleSubscribe}
          disabled={!selectedPlan}
        >
          <LinearGradient
            colors={selectedPlan ? COLORS.primaryGradient : ["#ccc", "#aaa"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {selectedPlan
                ? t
                  ? t("subscription.subscribe_to", {
                      plan: selectedPlan.package_name,
                    })
                  : `Subscribe to ${selectedPlan.package_name}`
                : t
                ? t("subscription.select_plan")
                : "Select a Plan"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
