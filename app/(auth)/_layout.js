import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="verify-otp"
        options={{
          headerLeft: () => null, // Removes the back button
          gestureEnabled: false, // Disables swipe-back on iOS
        }}
      />
      <Stack.Screen name="subscriptionScreen" />
    </Stack>
  );
}
