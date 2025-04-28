// screens/CheckoutScreen.js
import React, { useState, useContext } from "react";
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
  I18nManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LanguageContext } from "../../contexts/LanguageContext";

const CheckoutScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isRTL, t } = useContext(LanguageContext);
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

  // Check if the plan name is already in Arabic
  const isArabicName = /[\u0600-\u06FF]/.test(plan?.package_name || "");

  // Map Arabic to English for badge letter
  const arabicToEnglishMap = {
    أساسي: "Basic",
    بريميوم: "Premium",
    ذهبي: "Gold",
  };

  // Get the appropriate badge letter
  const badgeLetter = plan
    ? isArabicName
      ? plan.package_name.charAt(0)
      : plan.package_name.charAt(0)
    : "";

  const paymentMethods = [
    {
      id: "card",
      icon: "card",
      label: t ? t("checkout.credit_card") : "Credit/Debit Card",
    },
    {
      id: "apple",
      icon: "logo-apple",
      label: t ? t("checkout.apple_pay") : "Apple Pay",
    },
    {
      id: "google",
      icon: "logo-google",
      label: t ? t("checkout.google_pay") : "Google Pay",
    },
  ];

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert(
        t ? t("checkout.payment_method") : "Payment Method",
        t
          ? t("checkout.select_payment_method")
          : "Please select a payment method"
      );
      return;
    }

    if (
      selectedPaymentMethod === "card" &&
      (!cardNumber || !expiryDate || !cvv || !cardHolderName)
    ) {
      Alert.alert(
        t ? t("checkout.card_details") : "Card Details",
        t ? t("checkout.fill_card_details") : "Please fill in all card details"
      );
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
      alert(
        t
          ? t("checkout.payment_processing")
          : "Payment processing would happen here"
      );
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
          <Text style={[styles.errorTitle, isRTL && styles.textRTL]}>
            {t ? t("checkout.oops") : "Oops!"}
          </Text>
          <Text style={[styles.errorText, isRTL && styles.textRTL]}>
            {t ? t("checkout.no_plan_selected") : "No plan selected"}
          </Text>
          <Text style={[styles.errorSubtext, isRTL && styles.textRTL]}>
            {t
              ? t("checkout.go_back_select")
              : "Please go back and select a plan to continue."}
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.errorButtonGradient}
            >
              <Text style={styles.errorButtonText}>
                {t ? t("common.go_back") : "Go Back"}
              </Text>
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
              {t ? t("checkout.checkout") : "Checkout"}
            </Text>
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
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t ? t("checkout.order_summary") : "Order Summary"}
            </Text>
            <LinearGradient
              colors={[COLORS.white, "#f8f9fa"]}
              style={styles.summaryCard}
            >
              <View style={[styles.planHeader, isRTL && styles.planHeaderRTL]}>
                <View style={styles.planBadge}>
                  <LinearGradient
                    colors={COLORS.primaryGradient}
                    style={styles.planBadgeGradient}
                  >
                    <Text style={styles.planBadgeText}>{badgeLetter}</Text>
                  </LinearGradient>
                </View>
                <View style={styles.planInfo}>
                  <Text style={[styles.planName, isRTL && styles.textRTL]}>
                    {plan.package_name} {t ? t("checkout.plan") : "Plan"}
                  </Text>
                  <Text
                    style={[styles.planDescription, isRTL && styles.textRTL]}
                  >
                    {t
                      ? t("checkout.contacts_per_month", {
                          count: plan.contact_limit,
                        })
                      : `${plan.contact_limit} contacts per month`}
                  </Text>
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <View style={[styles.priceRow, isRTL && styles.priceRowRTL]}>
                  <Text style={[styles.priceLabel, isRTL && styles.textRTL]}>
                    {t
                      ? t("checkout.monthly_subscription")
                      : "Monthly Subscription"}
                  </Text>
                  <Text style={styles.priceValue}>${plan.price}</Text>
                </View>
                <View style={[styles.priceRow, isRTL && styles.priceRowRTL]}>
                  <Text style={[styles.priceLabel, isRTL && styles.textRTL]}>
                    {t ? t("checkout.discount") : "Discount"}
                  </Text>
                  <Text style={[styles.priceValue, styles.discountText]}>
                    -$0.00
                  </Text>
                </View>
                <View
                  style={[
                    styles.priceRow,
                    styles.totalRow,
                    isRTL && styles.priceRowRTL,
                  ]}
                >
                  <Text style={[styles.totalLabel, isRTL && styles.textRTL]}>
                    {t ? t("checkout.total_amount") : "Total Amount"}
                  </Text>
                  <Text style={styles.totalValue}>${plan.price}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentSection}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t ? t("checkout.payment_method") : "Payment Method"}
            </Text>
            <View style={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethod,
                    selectedPaymentMethod === method.id &&
                      styles.selectedPaymentMethod,
                    isRTL && styles.paymentMethodRTL,
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
                      isRTL && styles.textRTL,
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
              <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
                {t ? t("checkout.card_details") : "Card Details"}
              </Text>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                  {t ? t("checkout.card_number") : "Card Number"}
                </Text>
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={
                    isRTL ? "3456 9012 5678 1234" : "1234 5678 9012 3456"
                  }
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                  textAlign={isRTL ? "right" : "left"}
                />
              </View>

              <View style={[styles.row, isRTL && styles.rowRTL]}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                    {t ? t("checkout.expiry_date") : "Expiry Date"}
                  </Text>
                  <TextInput
                    style={[styles.input, isRTL && styles.inputRTL]}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) =>
                      setExpiryDate(formatExpiryDate(text))
                    }
                    keyboardType="numeric"
                    maxLength={5}
                    textAlign={isRTL ? "right" : "left"}
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                    {t ? t("checkout.cvv") : "CVV"}
                  </Text>
                  <TextInput
                    style={[styles.input, isRTL && styles.inputRTL]}
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    textAlign={isRTL ? "right" : "left"}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, isRTL && styles.textRTL]}>
                  {t ? t("checkout.cardholder_name") : "Cardholder Name"}
                </Text>
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={isRTL ? "محمد أحمد" : "John Doe"}
                  value={cardHolderName}
                  onChangeText={setCardHolderName}
                  autoCapitalize="words"
                  textAlign={isRTL ? "right" : "left"}
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
                style={[
                  styles.payButtonGradient,
                  isRTL && styles.payButtonGradientRTL,
                ]}
              >
                <Text style={styles.payButtonText}>
                  {t
                    ? t("checkout.pay_amount", { amount: plan.price })
                    : `Pay $${plan.price}`}
                </Text>
                <Ionicons
                  name={isRTL ? "arrow-back" : "arrow-forward"}
                  size={20}
                  color={COLORS.white}
                />
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <View
            style={[styles.securePayment, isRTL && styles.securePaymentRTL]}
          >
            <Ionicons name="shield-checkmark" size={16} color="#666" />
            <Text style={styles.secureText}>
              {t ? t("checkout.secure_payment") : "Secure Payment"}
            </Text>
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
  headerRTL: {
    flexDirection: "row-reverse",
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
  textRTL: {
    textAlign: "right",
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
  planHeaderRTL: {
    flexDirection: "row-reverse",
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
  priceRowRTL: {
    flexDirection: "row-reverse",
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
  paymentMethodRTL: {
    flexDirection: "row-reverse",
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
    backgroundColor: "#f8f9fa",
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    marginRight: 12,
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
  inputRTL: {
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  rowRTL: {
    flexDirection: "row-reverse",
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
  payButtonGradientRTL: {
    flexDirection: "row-reverse",
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
    marginLeft: 8,
  },
  securePayment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  securePaymentRTL: {
    flexDirection: "row-reverse",
  },
  secureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginRight: 4,
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
