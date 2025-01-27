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
        name="preview"
        options={{
          title: "Profile Preview",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Profile",
        }}
      />
    </Stack>
  );
}
