import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "home") {
            iconName = "home";
          } else if (route.name === "search") {
            iconName = "search";
          } else if (route.name === "matches") {
            iconName = "heart";
          } else if (route.name === "profile") {
            iconName = "user";
          }

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
                  { color: focused ? COLORS.white : COLORS.text },
                ]}
              >
                {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </View>
          );
        },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: () => null,
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="matches"
        options={{
          title: "Matches",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
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
