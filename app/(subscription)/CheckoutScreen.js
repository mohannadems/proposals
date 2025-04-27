// screens/CheckoutScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";

const CheckoutScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [scaleAnim] = useState(new Animated.Value(1));

  // Construct plan object from individual parameters
  const plan = params?.package_name
    ? {
        package_name: params.package_name,
        price: params.price,
        contact_limit: params.contact_limit,
      }
    : null;

  const paymentMethods = [
    { id: "card", icon: "card", label: "Credit/Debit Card" },
    { id: "apple", icon: "logo-apple", label: "Apple Pay" },
    { id: "google", icon: "logo-google", label: "Google Pay" },
  ];

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Payment Method", "Please select a payment method");
      return;
    }

    if (
      selectedPaymentMethod === "card" &&
      (!cardNumber || !expiryDate || !cvv || !cardHolderName)
    ) {
      Alert.alert("Card Details", "Please fill in all card details");
      return;
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Implement payment logic here
      alert("Payment processing would happen here");
    });
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(" ").substring(0, 19);
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color={COLORS.error} />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>No plan selected</Text>
          <Text style={styles.errorSubtext}>
            Please go back and select a plan to continue.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.errorButtonGradient}
            >
              <Text style={styles.errorButtonText}>Go Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <LinearGradient
              colors={[COLORS.white, "#f8f9fa"]}
              style={styles.summaryCard}
            >
              <View style={styles.planHeader}>
                <View style={styles.planBadge}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.planBadgeGradient}
                  >
                    <Text style={styles.planBadgeText}>
                      {plan.package_name.charAt(0)}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.package_name} Plan</Text>
                  <Text style={styles.planDescription}>
                    {plan.contact_limit} contacts per month
                  </Text>
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Monthly Subscription</Text>
                  <Text style={styles.priceValue}>${plan.price}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Discount</Text>
                  <Text style={[styles.priceValue, styles.discountText]}>
                    -$0.00
                  </Text>
                </View>
                <View style={[styles.priceRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>${plan.price}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    selectedPaymentMethod === method.id &&
                      styles.selectedPaymentMethod,
                  ]}
                  onPress={() => setSelectedPaymentMethod(method.id)}
                >
                  <Ionicons
                    name={method.icon}
                    size={24}
                    color={
                      selectedPaymentMethod === method.id
                        ? COLORS.primary
                        : "#666"
                    }
                  />
                  <Text
                    style={[
                      styles.paymentMethodText,
                      selectedPaymentMethod === method.id &&
                        styles.selectedPaymentMethodText,
                    ]}
                  >
                    {method.label}
                  </Text>
                  {selectedPaymentMethod === method.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card Details Form */}
          {selectedPaymentMethod === "card" && (
            <View style={styles.cardForm}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) =>
                      setExpiryDate(formatExpiryDate(text))
                    }
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            activeOpacity={0.8}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <LinearGradient
                colors={COLORS.primaryGradient}
                style={styles.payButtonGradient}
              >
                <Text style={styles.payButtonText}>Pay ${plan.price}</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.securePayment}>
            <Ionicons name="shield-checkmark" size={16} color="#666" />
            <Text style={styles.secureText}>Secure Payment</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
  },
  contentContainer: {
    padding: 20,
  },
  orderSummary: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  planBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 12,
  },
  planBadgeGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  planBadgeText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  planDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  discountText: {
    color: COLORS.success,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: "#f8f9fa",
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: "#666",
  },
  selectedPaymentMethodText: {
    color: COLORS.text,
    fontWeight: "600",
  },
  cardForm: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payButton: {
    width: "100%",
    marginBottom: 16,
  },
  payButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  securePayment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginTop: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  errorButton: {
    marginTop: 24,
    width: "100%",
    maxWidth: 200,
  },
  errorButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
