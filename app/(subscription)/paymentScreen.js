// screens/PaymentScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");

const PaymentScreen = ({ route }) => {
  const dispatch = useDispatch();
  const router = useRouter();
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
        "Please select a plan",
        "You need to choose a subscription plan to continue.",
        [{ text: "OK", style: "default" }]
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Upgrade Your Experience</Text>
        <Text style={styles.subtitle}>
          Select the perfect plan for your needs
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
            />
          ))}
        </View>

        <View style={styles.featuresList}>
          <Text style={styles.allPlansTitle}>All Plans Include:</Text>
          <View style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.featureText}>Unlimited swipes</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.featureText}>Message encryption</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.featureText}>Profile visibility control</Text>
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
                ? `Subscribe to ${selectedPlan.package_name}`
                : "Select a Plan"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  featuresList: {
    marginTop: 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  allPlansTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subscribeButton: {
    overflow: "hidden",
    borderRadius: 12,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
  },
});

export default PaymentScreen;
