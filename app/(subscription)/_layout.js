import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="paymentScreen" />
      <Stack.Screen name="subscriptionScreen" />
    </Stack>
  );
}
