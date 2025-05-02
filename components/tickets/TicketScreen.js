import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTickets,
  createTicket,
  reset,
} from "../../store/slices/ticketSlice";
import { LanguageContext } from "../../contexts/LanguageContext";
import { COLORS } from "../../constants/colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TicketScreen = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tickets, isLoading, isError, message } = useSelector(
    (state) => state.ticket
  );
  const { t, isRTL } = useContext(LanguageContext);

  useEffect(() => {
    fetchTickets();

    // Set up keyboard listeners
    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
          })
        : Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
          });

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardHeight(0);
          })
        : Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
          });

    return () => {
      dispatch(reset());
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [dispatch]);

  useEffect(() => {
    if (showForm) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 12,
          bounciness: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Reset form values when closed
        setSubject("");
        setDescription("");
      });
      slideAnim.setValue(-50);
    }
  }, [showForm]);

  const fetchTickets = useCallback(() => {
    setRefreshing(true);
    dispatch(getAllTickets()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const handleCreateTicket = () => {
    if (!subject.trim()) {
      Alert.alert(
        t("common.error", "Error"),
        t("tickets.subjectRequired", "Subject is required")
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        t("common.error", "Error"),
        t("tickets.descriptionRequired", "Description is required")
      );
      return;
    }

    // First close the form
    setShowForm(false);

    // Then dispatch the action after a small delay
    setTimeout(() => {
      dispatch(createTicket({ subject, description }));
    }, 100);
  };

  const handleSelectTicket = (id) => {
    // Navigate to ticket detail screen
    router.push({
      pathname: "/(tickets)/TicketDetailScreen",
      params: { ticketId: id },
    });
  };

  const renderTicketItem = ({ item, index }) => {
    const itemOpacity = new Animated.Value(0);
    const itemTranslate = new Animated.Value(20);

    // Animate each item with a staggered delay
    Animated.parallel([
      Animated.timing(itemOpacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(itemTranslate, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    return (
      <AnimatedTouchable
        style={[
          styles.ticketItem,
          {
            opacity: itemOpacity,
            transform: [{ translateY: itemTranslate }],
          },
        ]}
        onPress={() => handleSelectTicket(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.ticketStatusBadge}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
        </View>

        <View style={styles.ticketContent}>
          <View style={styles.ticketHeader}>
            <Text
              style={[styles.ticketSubject, isRTL && styles.rtlText]}
              numberOfLines={1}
            >
              {item.subject}
            </Text>
            <Text style={styles.ticketDate}>{formatDate(item.created_at)}</Text>
          </View>

          <Text
            style={[styles.ticketDescription, isRTL && styles.rtlText]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={[styles.ticketFooter, isRTL && styles.rtlRow]}>
            <View style={[styles.statusContainer, isRTL && styles.rtlRow]}>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {t(`status.${item.status}`, item.status)}
              </Text>
            </View>

            <View style={[styles.ticketAction, isRTL && styles.rtlRow]}>
              <Text style={styles.viewDetailsText}>
                {t("tickets.viewDetails", "View details")}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={16}
                color={COLORS.textLight}
                style={{
                  marginLeft: isRTL ? 0 : 4,
                  marginRight: isRTL ? 4 : 0,
                  transform: [{ scaleX: isRTL ? -1 : 1 }],
                }}
              />
            </View>
          </View>
        </View>
      </AnimatedTouchable>
    );
  };

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Image
        source={require("../../assets/images/notfound.png")}
        style={styles.errorImage}
        resizeMode="contain"
      />
      <Text style={styles.errorTitle}>{t("common.error", "Error")}</Text>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={fetchTickets}>
        <Text style={styles.retryButtonText}>{t("common.retry", "Retry")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/notfound.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>
        {t("tickets.noTicketsTitle", "No Support Tickets")}
      </Text>
      <Text style={styles.emptyText}>
        {t("tickets.noTickets", "You have no support tickets yet.")}
      </Text>
      <TouchableOpacity
        style={styles.createFirstButton}
        onPress={() => setShowForm(true)}
      >
        <Text style={styles.createFirstButtonText}>
          {t("tickets.createFirst", "Create Your First Ticket")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFloatingButton = () => (
    <TouchableOpacity
      style={[
        styles.floatingButton,
        {
          right: isRTL ? null : 20,
          left: isRTL ? 20 : null,
          bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20,
        },
      ]}
      onPress={() => setShowForm(true)}
      activeOpacity={0.8}
    >
      <MaterialIcons name="add" size={24} color={COLORS.white} />
    </TouchableOpacity>
  );

  if (isLoading && !tickets.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <View style={styles.container}>
        {isError ? (
          renderErrorState()
        ) : (
          <>
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTicketItem}
              contentContainerStyle={[
                styles.listContainer,
                tickets.length === 0 && styles.emptyListContainer,
              ]}
              ListEmptyComponent={!isLoading && renderEmptyList()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchTickets}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
              showsVerticalScrollIndicator={false}
            />

            {tickets.length > 0 && !showForm && renderFloatingButton()}
          </>
        )}

        {/* Create Ticket Form Modal */}
        <Modal
          visible={showForm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowForm(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback onPress={() => setShowForm(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <Animated.View
                    style={[
                      styles.formContainer,
                      {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                      },
                    ]}
                  >
                    <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>
                        {t("tickets.newTicket", "New Ticket")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowForm(false)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      >
                        <MaterialIcons
                          name="close"
                          size={24}
                          color={COLORS.text}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formContent}>
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                          {t("tickets.subject", "Subject")}
                        </Text>
                        <TextInput
                          style={[styles.input, isRTL && styles.rtlText]}
                          placeholder={t(
                            "tickets.subjectPlaceholder",
                            "Enter ticket subject..."
                          )}
                          placeholderTextColor={COLORS.textLight + "80"}
                          value={subject}
                          onChangeText={setSubject}
                          textAlign={isRTL ? "right" : "left"}
                          maxLength={100}
                        />
                      </View>

                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>
                          {t("tickets.description", "Description")}
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            styles.textArea,
                            isRTL && styles.rtlText,
                          ]}
                          placeholder={t(
                            "tickets.descriptionPlaceholder",
                            "Describe your issue in detail..."
                          )}
                          placeholderTextColor={COLORS.textLight + "80"}
                          value={description}
                          onChangeText={setDescription}
                          multiline
                          textAlignVertical="top"
                          textAlign={isRTL ? "right" : "left"}
                        />
                      </View>
                    </View>

                    <View style={styles.formActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowForm(false)}
                      >
                        <Text style={styles.cancelButtonText}>
                          {t("common.cancel", "Cancel")}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleCreateTicket}
                      >
                        <Text style={styles.submitButtonText}>
                          {t("common.submit", "Submit")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";

  // For demonstration purposes, return as is
  // In a real app, you'd parse and format the date
  return dateString;
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "#4CAF50"; // Green
    case "pending":
      return "#FF9800"; // Orange
    case "closed":
      return "#F44336"; // Red
    case "resolved":
      return "#2196F3"; // Blue
    default:
      return COLORS.primary;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
  },
  rtlAlignSelf: {
    alignSelf: "flex-end",
  },

  // Ticket List Styles
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  ticketItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    flexDirection: "row",
    overflow: "hidden",
  },
  ticketStatusBadge: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    marginLeft: -16,
    marginVertical: -16,
    marginRight: 16,
  },
  statusIndicator: {
    width: "100%",
    height: "100%",
  },
  ticketContent: {
    flex: 1,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  ticketDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  ticketDescription: {
    fontSize: 14,
    color: COLORS.text + "CC",
    marginBottom: 12,
    lineHeight: 20,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ticketAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.textLight,
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: "center",
    padding: 24,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  createFirstButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  createFirstButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },

  // Error State Styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorImage: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },

  // Floating Action Button
  floatingButton: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Create Ticket Form Modal
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  formContainer: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: "80%",
  },
  formHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  formContent: {
    padding: 16,
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
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    color: COLORS.text,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    marginLeft: 8,
  },
  submitButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TicketScreen;
