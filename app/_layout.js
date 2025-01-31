import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import { globalStyles } from "../styles/GlobalStyles";
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "YourFont-Regular": require("../assets/fonts/EBGaramond-Italic-VariableFont_wght.ttf"),
    // Add more font variants as needed
  });
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="welcome"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="(profile)"
            options={{
              gestureEnabled: true,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe only for auth screens
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: true, // Enable swipe for other screens
        }}
      />
      <Stack.Screen
        name="(profile)"
        options={{
          headerShown: true,
          gestureEnabled: true, // Enable swipe for profile screens
        }}
      />
    </Stack>
  );
}
