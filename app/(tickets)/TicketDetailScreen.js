import React from "react";
import { Stack } from "expo-router";
import TicketDetailScreen from "../../components/tickets/TicketDetailScreen";
import { COLORS } from "../../constants/colors";

export default function TicketDetailScreenRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right",
          gestureEnabled: true,
          gestureDirection: "horizontal",
          contentStyle: {
            backgroundColor: "#F9FAFC",
          },
        }}
      />
      <TicketDetailScreen />
    </>
  );
}
