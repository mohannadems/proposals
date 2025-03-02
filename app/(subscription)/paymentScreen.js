import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { MotiView, MotiText, AnimatePresence } from "moti";
import * as Haptics from "expo-haptics";
import Svg, {
  Defs,
  Rect,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { SharedElement } from "react-navigation-shared-element";

const { width, height } = Dimensions.get("window");
const CARD_ASPECT_RATIO = 1.586;
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH / CARD_ASPECT_RATIO;

const COLORS = {
  primary: "#9e086c",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#9e086c", "#9e086c"],
  cardGradient: ["#2C3E50", "#3498DB"],
  goldGradient: ["#FFD700", "#FFA500"],
};

const CreditCard = ({ cardDetails, isFlipped, rotateY }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [
            {
              rotateY: rotateY.interpolate({
                inputRange: [0, 180],
                outputRange: ["0deg", "180deg"],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={COLORS.cardGradient}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>

        {!isFlipped ? (
          // Front of card
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.chip} />
              <Feather
                name="wifi"
                size={24}
                color={COLORS.white}
                style={{ transform: [{ rotate: "90deg" }] }}
              />
            </View>

            <Text style={styles.cardNumber}>
              {cardDetails.number || "•••• •••• •••• ••••"}
            </Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardValue}>
                  {cardDetails.name || "YOUR NAME"}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expires</Text>
                <Text style={styles.cardValue}>
                  {cardDetails.expiry || "MM/YY"}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          // Back of card
          <View style={styles.cardBack}>
            <View style={styles.magneticStrip} />
            <View style={styles.cvvContainer}>
              <Text style={styles.cvvLabel}>CVV</Text>
              <View style={styles.cvvStrip}>
                <Text style={styles.cvvText}>{cardDetails.cvv || "•••"}</Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const PaymentMethodButton = ({ icon, label, selected, onPress }) => (
  <MotiView
    animate={{
      scale: selected ? 1 : 0.95,
      opacity: selected ? 1 : 0.7,
    }}
    transition={{
      type: "spring",
      damping: 20,
    }}
  >
    <TouchableOpacity
      onPress={onPress}
      style={[styles.methodButton, selected && styles.methodButtonSelected]}
    >
      <LinearGradient
        colors={selected ? COLORS.primaryGradient : ["#FFF", "#F8F9FA"]}
        style={styles.methodGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView
          intensity={selected ? 0 : 80}
          style={StyleSheet.absoluteFill}
        />
        <Feather
          name={icon}
          size={24}
          color={selected ? COLORS.white : COLORS.text}
        />
        <Text
          style={[styles.methodLabel, selected && styles.methodLabelSelected]}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  </MotiView>
);

const FormInput = ({
  label,
  icon,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  secureTextEntry,
  onFocus,
  onBlur,
}) => (
  <MotiView
    style={styles.inputGroup}
    animate={{ opacity: 1, translateY: 0 }}
    from={{ opacity: 0, translateY: 20 }}
    transition={{ type: "timing", duration: 500 }}
  >
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Feather
        name={icon}
        size={20}
        color={COLORS.text}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor="rgba(28, 28, 30, 0.3)"
      />
    </View>
  </MotiView>
);

export default function PremiumPaymentScreen() {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [isCvvFocused, setIsCvvFocused] = useState(false);

  const rotateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(rotateY, {
      toValue: isCvvFocused ? 180 : 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [isCvvFocused]);

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    return formatted;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Navigate to success screen
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(182,81,101,0.1)", "rgba(88,86,214,0.1)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", duration: 1500 }}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Complete Payment</Text>
              <Text style={styles.headerSubtitle}>Premium Subscription</Text>
            </View>
          </View>

          <View style={styles.cardPreviewContainer}>
            <CreditCard
              cardDetails={cardDetails}
              isFlipped={isCvvFocused}
              rotateY={rotateY}
            />
          </View>

          <View style={styles.paymentMethods}>
            {[
              { id: "card", icon: "credit-card", label: "Credit Card" },
              { id: "apple", icon: "smartphone", label: "Apple Pay" },
              { id: "google", icon: "smartphone", label: "Google Pay" },
            ].map((method) => (
              <PaymentMethodButton
                key={method.id}
                icon={method.icon}
                label={method.label}
                selected={selectedMethod === method.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedMethod(method.id);
                }}
              />
            ))}
          </View>

          <AnimatePresence>
            {selectedMethod === "card" && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={styles.formContainer}
              >
                <FormInput
                  label="Card Number"
                  icon="credit-card"
                  value={cardDetails.number}
                  onChangeText={(text) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      number: formatCardNumber(text),
                    }))
                  }
                  keyboardType="numeric"
                  maxLength={19}
                />

                <FormInput
                  label="Cardholder Name"
                  icon="user"
                  value={cardDetails.name}
                  onChangeText={(text) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      name: text.toUpperCase(),
                    }))
                  }
                />

                <View style={styles.row}>
                  <View
                    style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}
                  >
                    <FormInput
                      label="Expiry Date"
                      icon="calendar"
                      value={cardDetails.expiry}
                      onChangeText={(text) =>
                        setCardDetails((prev) => ({
                          ...prev,
                          expiry: formatExpiry(text),
                        }))
                      }
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </View>

                  <View
                    style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}
                  >
                    <FormInput
                      label="CVV"
                      icon="lock"
                      value={cardDetails.cvv}
                      onChangeText={(text) =>
                        setCardDetails((prev) => ({
                          ...prev,
                          cvv: text,
                        }))
                      }
                      keyboardType="numeric"
                      maxLength={3}
                      secureTextEntry
                      onFocus={() => setIsCvvFocused(true)}
                      onBlur={() => setIsCvvFocused(false)}
                      style={{ flex: 1, marginLeft: 10 }}
                    />
                  </View>
                </View>
              </MotiView>
            )}
          </AnimatePresence>
        </MotiView>
      </ScrollView>

      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "spring", delay: 500 }}
        style={styles.footer}
      >
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.priceValue}>$19.99</Text>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={loading}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.payButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <MotiView
                from={{ rotate: "0deg" }}
                animate={{ rotate: "360deg" }}
                transition={{ type: "timing", duration: 1000, loop: true }}
              >
                <Feather name="loader" size={24} color={COLORS.white} />
              </MotiView>
            ) : (
              <>
                <Text style={styles.payButtonText}>Pay Now</Text>
                <Feather
                  name="arrow-right"
                  size={20}
                  color={COLORS.white}
                  style={{ marginLeft: 8 }}
                />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.secureNote}>
          <Feather name="shield" size={16} color={COLORS.text} />
          <Text style={styles.secureText}>Secure and encrypted payment</Text>
        </View>
      </MotiView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    marginTop: 4,
  },
  cardPreviewContainer: {
    alignItems: "center",
    marginVertical: 20,
    height: CARD_HEIGHT,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backfaceVisibility: "hidden",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    opacity: 0.1,
    transform: [{ skewX: "-20deg" }],
    backgroundColor: COLORS.white,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    width: 45,
    height: 34,
    backgroundColor: "#FFD700",
    borderRadius: 8,
    opacity: 0.8,
  },
  cardNumber: {
    fontSize: 22,
    color: COLORS.white,
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1,
  },
  cardBack: {
    flex: 1,
    transform: [{ rotateY: "180deg" }],
  },
  magneticStrip: {
    height: 40,
    backgroundColor: "#000",
    marginVertical: 20,
  },
  cvvContainer: {
    padding: 20,
  },
  cvvLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 8,
  },
  cvvStrip: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 4,
  },
  cvvText: {
    fontSize: 16,
    textAlign: "right",
    letterSpacing: 2,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  methodButtonSelected: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  methodGradient: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 90,
  },
  methodLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 8,
  },
  methodLabelSelected: {
    color: COLORS.white,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  row: {
    flexDirection: "row",
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  payButton: {
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
  payButtonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  secureText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    opacity: 0.7,
  },
});
