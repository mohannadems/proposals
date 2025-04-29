import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import TicketScreen from "../../components/tickets/TicketScreen";
import { COLORS } from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";

export default function TicketScreenRoute() {
  const { t } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t("tickets.myTickets", "My Tickets"),
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <TicketScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
