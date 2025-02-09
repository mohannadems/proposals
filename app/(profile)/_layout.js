import { Stack } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="create"
        options={{
          title: "Create Profile",
          headerLeft: null,
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="matchProfile"
        options={{
          headerShown: false,
          title: "matchProfile",
        }}
      />
      <Stack.Screen
        name="fillProfileData"
        options={{
          headerShown: false,
          title: "fillProfileData",
        }}
      />
    </Stack>
  );
}
