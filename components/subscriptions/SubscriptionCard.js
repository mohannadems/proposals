// components/SubscriptionCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const SubscriptionCard = ({ plan, isSelected, onSelect, index }) => {
  const isPremium = plan.package_name === "Premium";
  const isGold = plan.package_name === "Gold";

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
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, isGold && styles.goldText]}>
          {plan.package_name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceSymbol, isGold && styles.goldText]}>$</Text>
          <Text style={[styles.price, isGold && styles.goldText]}>
            {plan.price}
          </Text>
          <Text style={[styles.period, isGold && styles.goldText]}>/month</Text>
        </View>
      </View>

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={isGold ? "#FFD700" : COLORS.primary}
          />
          <Text style={[styles.featureText, isGold && styles.goldText]}>
            Contact with {plan.contact_limit} people
          </Text>
        </View>

        {isPremium && (
          <View style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.featureText}>Advanced matching algorithm</Text>
          </View>
        )}

        {isGold && (
          <>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={[styles.featureText, styles.goldText]}>
                Premium matching & profile boost
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#FFD700" />
              <Text style={[styles.featureText, styles.goldText]}>
                VIP customer support
              </Text>
            </View>
          </>
        )}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderColor: COLORS.primary,
  },
  goldCard: {
    backgroundColor: "#FFF8DC",
    borderColor: "#FFD700",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  goldText: {
    color: "#B8860B",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  period: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  features: {
    marginTop: 16,
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
  selectedIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
  },
});

export default SubscriptionCard;
