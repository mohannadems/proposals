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
import styles from "../../styles/CheckoutScreenStyles";
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

  const plan = params?.package_name
    ? {
        package_name: params.package_name,
        price: params.price,
        contact_limit: params.contact_limit,
      }
    : null;

  const isArabicName = /[\u0600-\u06FF]/.test(plan?.package_name || "");

  const arabicToEnglishMap = {
    أساسي: "Basic",
    بريميوم: "Premium",
    ذهبي: "Gold",
  };

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

export default CheckoutScreen;
