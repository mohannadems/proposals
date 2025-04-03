import React, { useContext } from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import * as Haptics from "expo-haptics";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function TabsLayout() {
  const { isRTL, t } = useContext(LanguageContext);

  const handleTabPress = (focused) => {
    if (focused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getTabName = (name) => {
    if (t) {
      return t(`tabs.${name}`);
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "home") {
            iconName = "home";
          } else if (route.name === "matches") {
            iconName = "heart";
          } else if (route.name === "Partner") {
            iconName = "search";
          } else if (route.name === "profile") {
            iconName = "user";
          }

          handleTabPress(focused);

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Feather
                name={iconName}
                size={24}
                color={focused ? COLORS.white : COLORS.text}
              />
              <Text
                style={[
                  styles.tabBarLabel,
                  {
                    color: focused ? COLORS.white : COLORS.text,
                    textAlign: "center",
                  },
                ]}
              >
                {getTabName(route.name)}
              </Text>
            </View>
          );
        },
        tabBarStyle: [styles.tabBar, { direction: isRTL ? "rtl" : "ltr" }],
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: () => null,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: getTabName("home"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: getTabName("matches"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Partner"
        options={{
          title: getTabName("partner"),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: getTabName("profile"),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 80,
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  tabBarItem: {
    paddingVertical: 15,
  },
  iconContainer: {
    width: 90,
    gap: 5,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {
    backgroundColor: COLORS.primary,
  },
  tabBarLabel: {
    fontSize: 12,
    marginLeft: 4,
  },
});
