// components/report/ReportUserModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  I18nManager,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import COLORS from "../../constants/colors";
import {
  reportUser,
  resetReportState,
  selectReportLoading,
  selectReportError,
  selectReportSuccess,
  selectReportReasons,
} from "../../store/slices/reportSlice";
import { LanguageContext } from "../../contexts/LanguageContext";

const { height } = Dimensions.get("window");

const ReportUserModal = ({ visible, onClose, userId, userName }) => {
  const dispatch = useDispatch();
  const { t, isRTL } = React.useContext(LanguageContext);

  // Redux selectors
  const loading = useSelector(selectReportLoading);
  const error = useSelector(selectReportError);
  const success = useSelector(selectReportSuccess);
  const reportReasons = useSelector(selectReportReasons);

  // Local state
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReasonEn, setOtherReasonEn] = useState("");
  const [otherReasonAr, setOtherReasonAr] = useState("");
  const [animateHeight, setAnimateHeight] = useState(0);

  // Set modal height with animation
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        setAnimateHeight(height * 0.6);
      }, 100);
    } else {
      setAnimateHeight(0);
    }
  }, [visible]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedReason(null);
      setOtherReasonEn("");
      setOtherReasonAr("");
      dispatch(resetReportState());
    }
  }, [visible, dispatch]);

  // Close modal when report is successful
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [success, onClose]);

  // Handle reason selection
  const handleSelectReason = (reason) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReason(reason);
  };

  // Submit report
  const handleSubmit = () => {
    if (!selectedReason) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const reasonObj = reportReasons.find((r) => r.id === selectedReason);

    const reportData = {
      reported_id: userId,
      reason_en: reasonObj.value,
      reason_ar: reasonObj.label_ar,
      status: "pending",
    };

    if (reasonObj.value === "other") {
      if (!otherReasonEn.trim() && !otherReasonAr.trim()) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      reportData.other_reason_en = otherReasonEn.trim();
      reportData.other_reason_ar = otherReasonAr.trim();
    }

    dispatch(reportUser(reportData));
  };

  // Get the label for a reason based on current language
  const getReasonLabel = (reason) => {
    const reasonObj = reportReasons.find((r) => r.id === reason);
    return isRTL ? reasonObj.label_ar : reasonObj.label_en;
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoid}
            >
              <View
                style={[
                  styles.modalContainer,
                  { height: animateHeight },
                  isRTL && styles.rtlContainer,
                ]}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.handle} />
                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      isRTL ? { left: 0 } : { right: 0 },
                    ]}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <View
                  style={[
                    styles.titleContainer,
                    isRTL && { flexDirection: "row-reverse" },
                  ]}
                >
                  <MaterialIcons
                    name="report-problem"
                    size={28}
                    color={COLORS.error}
                  />
                  <Text
                    style={[
                      styles.title,
                      isRTL ? { marginRight: 10 } : { marginLeft: 10 },
                    ]}
                  >
                    {isRTL ? `الإبلاغ عن ${userName}` : `Report ${userName}`}
                  </Text>
                </View>

                {/* Content */}
                {success ? (
                  <View style={styles.successContainer}>
                    <View style={styles.successIconContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={60}
                        color="#4CAF50"
                      />
                    </View>
                    <Text style={styles.successText}>
                      {isRTL
                        ? "تم إرسال البلاغ بنجاح"
                        : "Report submitted successfully"}
                    </Text>
                    <Text style={styles.successSubtext}>
                      {isRTL
                        ? "سيقوم فريقنا بمراجعة البلاغ قريبًا."
                        : "Our team will review the report shortly."}
                    </Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.content}
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
                      {isRTL
                        ? "يرجى اختيار سبب الإبلاغ:"
                        : "Please select a reason for reporting:"}
                    </Text>

                    {/* Reason options */}
                    <View style={styles.reasonsContainer}>
                      {reportReasons.map((reason) => (
                        <TouchableOpacity
                          key={reason.id}
                          style={[
                            styles.reasonOption,
                            selectedReason === reason.id &&
                              styles.selectedReason,
                            isRTL && styles.rtlReasonOption,
                          ]}
                          onPress={() => handleSelectReason(reason.id)}
                        >
                          <Text
                            style={[
                              styles.reasonText,
                              selectedReason === reason.id &&
                                styles.selectedReasonText,
                              isRTL && styles.rtlText,
                            ]}
                          >
                            {isRTL ? reason.label_ar : reason.label_en}
                          </Text>
                          {selectedReason === reason.id && (
                            <View style={styles.checkmark}>
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="white"
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Other reason input */}
                    {selectedReason === 5 && (
                      <View style={styles.otherReasonContainer}>
                        <Text
                          style={[
                            styles.otherReasonLabel,
                            isRTL && styles.rtlText,
                          ]}
                        >
                          {isRTL
                            ? "يرجى تحديد السبب:"
                            : "Please specify the reason:"}
                        </Text>

                        {/* First language input (based on current UI language) */}
                        <TextInput
                          style={[
                            styles.otherReasonInput,
                            isRTL && styles.rtlInput,
                          ]}
                          placeholder={
                            isRTL
                              ? "اذكر السبب بالعربية"
                              : "Describe the issue in English"
                          }
                          placeholderTextColor="#999"
                          value={isRTL ? otherReasonAr : otherReasonEn}
                          onChangeText={
                            isRTL ? setOtherReasonAr : setOtherReasonEn
                          }
                          multiline
                          textAlign={isRTL ? "right" : "left"}
                          textAlignVertical="top"
                        />

                        {/* Second language input */}
                        <Text
                          style={[
                            styles.otherReasonLabel,
                            { marginTop: 12 },
                            isRTL && styles.rtlText,
                          ]}
                        >
                          {isRTL
                            ? "أيضًا بالإنجليزية (اختياري):"
                            : "Also in Arabic (optional):"}
                        </Text>

                        <TextInput
                          style={[
                            styles.otherReasonInput,
                            isRTL
                              ? { textAlign: "left" }
                              : { textAlign: "right" },
                          ]}
                          placeholder={
                            isRTL
                              ? "Describe the issue in English"
                              : "اذكر السبب بالعربية"
                          }
                          placeholderTextColor="#999"
                          value={isRTL ? otherReasonEn : otherReasonAr}
                          onChangeText={
                            isRTL ? setOtherReasonEn : setOtherReasonAr
                          }
                          multiline
                          textAlignVertical="top"
                        />
                      </View>
                    )}

                    {/* Error message */}
                    {error && (
                      <View
                        style={[
                          styles.errorContainer,
                          isRTL && { flexDirection: "row-reverse" },
                        ]}
                      >
                        <Ionicons
                          name="alert-circle"
                          size={20}
                          color={COLORS.error}
                        />
                        <Text
                          style={[
                            styles.errorText,
                            isRTL ? { marginRight: 8 } : { marginLeft: 8 },
                            isRTL && styles.rtlText,
                          ]}
                        >
                          {isRTL
                            ? "حدث خطأ ما. يرجى المحاولة مرة أخرى."
                            : error}
                        </Text>
                      </View>
                    )}

                    {/* Submit button */}
                    <TouchableOpacity
                      style={[
                        styles.submitButton,
                        (!selectedReason ||
                          (selectedReason === 5 &&
                            !otherReasonEn.trim() &&
                            !otherReasonAr.trim())) &&
                          styles.disabledButton,
                      ]}
                      onPress={handleSubmit}
                      disabled={
                        loading ||
                        !selectedReason ||
                        (selectedReason === 5 &&
                          !otherReasonEn.trim() &&
                          !otherReasonAr.trim())
                      }
                    >
                      {loading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.submitButtonText}>
                          {isRTL ? "إرسال البلاغ" : "Submit Report"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </ScrollView>
                )}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardAvoid: {
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    height: 0,
  },
  rtlContainer: {
    direction: "rtl",
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    position: "relative",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
  },
  closeButton: {
    position: "absolute",
    top: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  rtlText: {
    textAlign: "right",
  },
  reasonsContainer: {
    marginBottom: 20,
  },
  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E8EC",
  },
  rtlReasonOption: {
    flexDirection: "row-reverse",
  },
  selectedReason: {
    backgroundColor: "rgba(74, 111, 161, 0.08)",
    borderColor: COLORS.primary,
  },
  reasonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedReasonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  otherReasonContainer: {
    marginBottom: 20,
  },
  otherReasonLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  otherReasonInput: {
    backgroundColor: "#F5F7FA",
    borderWidth: 1,
    borderColor: "#E5E8EC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    color: COLORS.text,
  },
  rtlInput: {
    textAlign: "right",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.08)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
  },
  successSubtext: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    opacity: 0.8,
  },
});

export default ReportUserModal;
