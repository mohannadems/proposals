import React, { useState, useRef, useContext } from "react";
import * as Updates from "expo-updates";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";

const ProfileDropdownMenu = ({ onLogout, onLanguageChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
    left: 0,
  });
  const menuButtonRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { t, isRTL, locale } = useContext(LanguageContext);
  const screenWidth = Dimensions.get("window").width;

  const openMenu = () => {
    menuButtonRef.current.measure((fx, fy, width, height, px, py) => {
      const statusBarHeight =
        Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0;

      const position = {
        top: py + height + 5 + statusBarHeight,
      };

      const dropdownWidth = 360;

      if (isRTL) {
        position.left = px + width - dropdownWidth;

        if (position.left < 5) {
          position.left = 5;
        }
      } else {
        position.right = screenWidth - (px + width) - 5;

        if (position.right < 5) {
          position.right = 5;
        }
      }

      setDropdownPosition(position);
      setIsVisible(true);

      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }).start();
    });
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const handleOptionPress = (action) => {
    closeMenu();
    setTimeout(() => {
      if (action) action();
    }, 100);
  };

  const handleLanguageToggle = () => {
    const newLanguage = locale === "en" ? "ar" : "en";

    closeMenu();

    setTimeout(() => {
      const currentLanguageName = locale === "en" ? "English" : "العربية";
      const newLanguageName = newLanguage === "en" ? "English" : "العربية";
      const changeMessage = t
        ? t("language.change_message")
            .replace("{current}", currentLanguageName)
            .replace("{new}", newLanguageName)
        : `Are you sure you want to change the language from ${currentLanguageName} to ${newLanguageName}?`;
      Alert.alert(
        t("language.change_title") || "Change Language",
        changeMessage,
        [
          {
            text: t("common.cancel") || "Cancel",
            style: "cancel",
          },
          {
            text: t("common.confirm") || "Confirm",
            style: "default",
            onPress: async () => {
              try {
                if (onLanguageChange) {
                  await onLanguageChange(newLanguage);
                }

                if (
                  typeof Updates !== "undefined" &&
                  Updates &&
                  typeof Updates.reloadAsync === "function"
                ) {
                  setTimeout(async () => {
                    try {
                      await Updates.reloadAsync();
                    } catch (reloadError) {
                      console.error("Failed to reload app:", reloadError);

                      Alert.alert(
                        t("language.reload_failed_title") || "Reload Failed",
                        t("language.reload_failed_message") ||
                          "Please restart the app manually to apply the language change.",
                        [{ text: t("common.ok") || "OK" }]
                      );
                    }
                  }, 300);
                } else {
                  Alert.alert(
                    t("language.restart_required_title") || "Restart Required",
                    t("language.restart_required_message") ||
                      "Please restart the app to apply the language change.",
                    [{ text: t("common.ok") || "OK" }]
                  );
                }
              } catch (error) {
                console.error("Error changing language:", error);

                Alert.alert(
                  t("language.change_error_title") || "Error",
                  t("language.change_error_message") ||
                    "Failed to change language. Please try again.",
                  [{ text: t("common.ok") || "OK" }]
                );
              }
            },
          },
        ]
      );
    }, 300);
  };
  const menuItems = [
    {
      icon: "language",
      label: t ? t("profile.language") : "Language",
      sublabel: locale === "en" ? "العربية" : "English",
      onPress: handleLanguageToggle,
      color: COLORS.primary,
    },
    {
      icon: "confirmation-number",
      label: t ? t("profile.tickets") : "My Tickets",
      sublabel: t ? t("profile.support_tickets") : "View your support tickets",
      onPress: () => router.push("/(tickets)/TicketScreen"),
      color: COLORS.primary,
    },
    {
      icon: "crown",
      customIcon: true,
      label: t ? t("profile.subscription") : "Subscription",
      sublabel: t ? t("profile.upgrade_plan") : "Upgrade your plan",
      onPress: () => router.push("/(subscription)/paymentScreen"),
      color: "#FFD700",
    },
    {
      divider: true,
    },
    {
      icon: "logout",
      label: t ? t("profile.logout") : "Logout",
      onPress: onLogout,
      color: COLORS.error,
    },
  ];

  const renderIcon = (item) => {
    if (item.customIcon && item.icon === "crown") {
      return (
        <Ionicons
          name="diamond"
          size={20}
          color={item.color}
          style={[
            styles.menuIcon,
            { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 },
          ]}
        />
      );
    }
    return (
      <MaterialIcons
        name={item.icon}
        size={20}
        color={item.color || COLORS.text}
        style={[
          styles.menuIcon,
          { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 },
        ]}
      />
    );
  };

  return (
    <View>
      <TouchableOpacity
        ref={menuButtonRef}
        style={styles.menuButton}
        onPress={openMenu}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconContainer}>
          <MaterialIcons name="more-vert" size={24} color={COLORS.white} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.dropdown,
                  {
                    top: dropdownPosition.top,
                    ...(isRTL
                      ? { left: dropdownPosition.left }
                      : { right: dropdownPosition.right }),
                    opacity: slideAnim,
                    transform: [
                      {
                        scale: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {Platform.OS === "ios" ? (
                  <BlurView
                    intensity={80}
                    tint="light"
                    style={styles.blurContainer}
                  >
                    {renderMenuItems()}
                  </BlurView>
                ) : (
                  <View style={styles.androidContainer}>
                    {renderMenuItems()}
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );

  function renderMenuItems() {
    return menuItems.map((item, index) => {
      if (item.divider) {
        return <View key={index} style={styles.divider} />;
      }

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            index === 0 && styles.firstMenuItem,
            index === menuItems.length - 1 && styles.lastMenuItem,
          ]}
          onPress={() => handleOptionPress(item.onPress)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemContent}>
            {renderIcon(item)}
            <View style={styles.menuTextContainer}>
              <Text
                style={[styles.menuText, item.color && { color: item.color }]}
              >
                {item.label}
              </Text>
              {item.sublabel && (
                <Text style={styles.menuSublabel}>{item.sublabel}</Text>
              )}
            </View>
          </View>
          {item.icon === "language" && (
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={COLORS.text}
              style={[
                { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 },
                { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
              ]}
            />
          )}
        </TouchableOpacity>
      );
    });
  }
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 6,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  dropdown: {
    position: "absolute",
    borderRadius: 16,
    minWidth: 220,
    ...Platform.select({
      ios: {
        backgroundColor: "transparent",
      },
      android: {
        backgroundColor: COLORS.white,
        elevation: 8,
      },
    }),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  androidContainer: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.white,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  firstMenuItem: {
    paddingTop: 16,
  },
  lastMenuItem: {
    paddingBottom: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  menuSublabel: {
    fontSize: 12,
    color: COLORS.text + "80",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

export default ProfileDropdownMenu;
