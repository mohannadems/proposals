import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="verify-otp"
        options={{
          headerLeft: () => null,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="subscriptionScreen" />
    </Stack>
  );
}
