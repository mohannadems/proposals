// components/SubscriptionCard.js
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";

const { width } = Dimensions.get("window");

const SubscriptionCard = ({ plan, isSelected, onSelect, index }) => {
  const { isRTL, t } = useContext(LanguageContext);

  // Check if the plan name is in Arabic
  const isArabicName = /[\u0600-\u06FF]/.test(plan.package_name);

  // Map Arabic plan names to English for logic
  const planNameMap = {
    أساسي: "Basic",
    بريميوم: "Premium",
    ذهبي: "Gold",
  };

  // Get the English equivalent for logic checks
  const englishPlanName = isArabicName
    ? planNameMap[plan.package_name]
    : plan.package_name;

  const isPremium = englishPlanName === "Premium";
  const isGold = englishPlanName === "Gold";

  return (
    <TouchableOpacity
      onPress={() => onSelect(plan, index)}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        isGold && styles.goldCard,
      ]}
    >
      {isPremium && (
        <View style={[styles.popularBadge, isRTL && styles.popularBadgeRTL]}>
          <Text style={styles.popularText}>
            {t ? t("subscription.most_popular") : "MOST POPULAR"}
          </Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            isGold && styles.goldText,
            isRTL && styles.textRTL,
          ]}
        >
          {plan.package_name}
        </Text>
        <View
          style={[styles.priceContainer, isRTL && styles.priceContainerRTL]}
        >
          <Text style={[styles.priceSymbol, isGold && styles.goldText]}>$</Text>
          <Text style={[styles.price, isGold && styles.goldText]}>
            {plan.price}
          </Text>
          <Text
            style={[
              styles.period,
              isGold && styles.goldText,
              isRTL ? styles.periodRTL : styles.periodLTR,
            ]}
          >
            {t ? t("subscription.per_month") : "/month"}
          </Text>
        </View>
      </View>

      <View style={styles.features}>
        <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={isGold ? "#FFD700" : COLORS.primary}
          />
          <Text
            style={[
              styles.featureText,
              isGold && styles.goldText,
              isRTL ? styles.featureTextRTL : styles.featureTextLTR,
            ]}
          >
            {t
              ? t("subscription.contact_with_people", {
                  count: plan.contact_limit,
                })
              : `Contact with ${plan.contact_limit} people`}
          </Text>
        </View>

        {isPremium && (
          <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
            <Text
              style={[
                styles.featureText,
                isRTL ? styles.featureTextRTL : styles.featureTextLTR,
              ]}
            >
              {t
                ? t("subscription.advanced_matching")
                : "Advanced matching algorithm"}
            </Text>
          </View>
        )}

        {isGold && (
          <>
            <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
              <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
              <Text
                style={[
                  styles.featureText,
                  styles.goldText,
                  isRTL ? styles.featureTextRTL : styles.featureTextLTR,
                ]}
              >
                {t
                  ? t("subscription.premium_matching")
                  : "Premium matching & profile boost"}
              </Text>
            </View>
            <View style={[styles.featureRow, isRTL && styles.featureRowRTL]}>
              <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
              <Text
                style={[
                  styles.featureText,
                  styles.goldText,
                  isRTL ? styles.featureTextRTL : styles.featureTextLTR,
                ]}
              >
                {t ? t("subscription.vip_support") : "VIP customer support"}
              </Text>
            </View>
          </>
        )}
      </View>

      {isSelected && (
        <View
          style={[
            styles.selectedIndicator,
            isRTL && styles.selectedIndicatorRTL,
          ]}
        >
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    width: width - 50,
    alignSelf: "center",
  },
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  goldCard: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFD700",
  },
  popularBadge: {
    position: "absolute",
    top: -14,
    right: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  popularBadgeRTL: {
    right: undefined,
    left: 24,
  },
  popularText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  goldText: {
    color: "#B8860B",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceContainerRTL: {
    flexDirection: "row-reverse",
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  price: {
    fontSize: 42,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  period: {
    fontSize: 18,
    color: "#666",
  },
  periodLTR: {
    marginLeft: 6,
  },
  periodRTL: {
    marginRight: 6,
  },
  features: {
    marginTop: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureRowRTL: {
    flexDirection: "row-reverse",
  },
  featureText: {
    fontSize: 18,
    color: COLORS.text,
    flex: 1,
  },
  featureTextLTR: {
    marginLeft: 16,
  },
  featureTextRTL: {
    marginRight: 16,
    textAlign: "right",
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 5,
  },
  selectedIndicatorRTL: {
    right: undefined,
    left: 5,
  },
  textRTL: {
    textAlign: "right",
  },
});

export default SubscriptionCard;
