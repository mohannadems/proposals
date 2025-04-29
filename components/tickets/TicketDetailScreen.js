import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  Keyboard,
  FlatList,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getTicketById,
  replyToTicket,
  reset,
} from "../../store/slices/ticketSlice";
import { LanguageContext } from "../../contexts/LanguageContext";
import { COLORS } from "../../constants/colors";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TicketDetailScreen = () => {
  const [reply, setReply] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const { ticketId } = useLocalSearchParams();
  const { currentTicket, replies, isLoading, isSuccess, isError, message } =
    useSelector((state) => state.ticket);
  const { t, isRTL, locale } = useContext(LanguageContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (ticketId) {
      dispatch(getTicketById(ticketId));
    }

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
        // Scroll to bottom when keyboard opens
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      dispatch(reset());
    };
  }, [dispatch, ticketId]);

  // Scroll to bottom when new replies are added
  useEffect(() => {
    if (replies.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [replies]);

  const handleGoBack = () => {
    router.back();
  };

  const handleReply = () => {
    if (!reply.trim()) {
      return;
    }

    dispatch(replyToTicket({ ticketId, message: reply }));
    setReply("");
    Keyboard.dismiss();
  };

  const renderReplyItem = ({ item, index }) => {
    const isMe = item.user_id === currentTicket?.user_id; // Adjust this condition based on your API

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
          isRTL && (isMe ? styles.myMessageRtl : styles.otherMessageRtl),
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <View style={styles.messageHeader}>
            <Text style={styles.messageUser}>
              {item.user
                ? `${item.user.first_name} ${item.user.last_name}`
                : "User"}
            </Text>
            <Text style={styles.messageDate}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          <Text style={[styles.messageText, isRTL && styles.rtlText]}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading || !currentTicket) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{message}</Text>
          <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
            <Text style={styles.goBackButtonText}>
              {t("common.back", "Go Back")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={22}
              color={COLORS.text}
              style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {t("tickets.ticketDetails", "Ticket Details")}
          </Text>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.ticketHeader}>
            <View style={[styles.ticketHeaderTop, isRTL && styles.rtlRow]}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColorLight(currentTicket.status),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: getStatusColor(currentTicket.status) },
                  ]}
                >
                  {t(`status.${currentTicket.status}`, currentTicket.status)}
                </Text>
              </View>
              <Text style={styles.ticketDate}>
                {formatDate(currentTicket.created_at)}
              </Text>
            </View>

            <Text style={[styles.ticketTitle, isRTL && styles.rtlText]}>
              {currentTicket.subject}
            </Text>
          </View>

          <View style={styles.ticketSection}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t("tickets.descriptionTitle", "Description")}
            </Text>
            <Text style={[styles.ticketDescription, isRTL && styles.rtlText]}>
              {currentTicket.description}
            </Text>
          </View>

          <View style={styles.conversationContainer}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t("tickets.conversation", "Conversation")}
            </Text>

            {replies && replies.length > 0 ? (
              <View style={styles.messagesContainer}>
                {replies.map((reply, index) => (
                  <View key={index}>
                    {renderReplyItem({ item: reply, index })}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.messagePlaceholder}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={40}
                  color={COLORS.textLight + "80"}
                />
                <Text style={styles.placeholderText}>
                  {t(
                    "tickets.noRepliesYet",
                    "No replies yet. Start the conversation by sending a message."
                  )}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View
          style={[
            styles.replyContainer,
            {
              paddingBottom: keyboardVisible ? 12 : Math.max(insets.bottom, 12),
            },
          ]}
        >
          <TextInput
            style={[styles.replyInput, isRTL && styles.rtlText]}
            placeholder={t("tickets.replyPlaceholder", "Write your reply...")}
            placeholderTextColor={COLORS.textLight + "80"}
            value={reply}
            onChangeText={setReply}
            multiline
            textAlign={isRTL ? "right" : "left"}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !reply.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleReply}
            activeOpacity={reply.trim() ? 0.7 : 1}
            disabled={!reply.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={reply.trim() ? COLORS.white : COLORS.white + "80"}
              style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";

  // For demonstration purposes - in real app, use a proper date formatter
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

// Helper function to get light status color for badges
const getStatusColorLight = (status) => {
  switch (status) {
    case "open":
      return "rgba(76, 175, 80, 0.15)";
    case "pending":
      return "rgba(255, 152, 0, 0.15)";
    case "closed":
      return "rgba(244, 67, 54, 0.15)";
    case "resolved":
      return "rgba(33, 150, 243, 0.15)";
    default:
      return "rgba(33, 150, 243, 0.15)";
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  goBackButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
  },

  // Header styles
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },

  // Scroll view styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  // Ticket details styles
  ticketHeader: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  ticketHeaderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  ticketDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    lineHeight: 24,
  },
  ticketSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  ticketDescription: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },

  // Conversation styles
  conversationContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    minHeight: 200,
  },
  messagesContainer: {
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "90%",
  },
  myMessage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  otherMessage: {
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  myMessageRtl: {
    alignSelf: "flex-start",
    marginRight: "auto",
    marginLeft: 0,
  },
  otherMessageRtl: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    marginRight: 0,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: "100%",
  },
  myBubble: {
    backgroundColor: COLORS.primary + "15",
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F0F2F5",
    borderTopLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text,
  },
  messageDate: {
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  messagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: "80%",
  },

  // Reply container styles
  replyContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "flex-end",
  },
  replyInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: "#F5F7FA",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 8,
    fontSize: 15,
    color: COLORS.text,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.primary + "80",
  },
});

export default TicketDetailScreen;
