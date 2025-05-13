import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
export default StyleSheet.create({
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
