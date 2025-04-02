import { useEffect, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Image, Animated, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthState } from "../store/slices/auth.slice";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);

  const initializeAuth = useCallback(async () => {
    try {
      await dispatch(checkAuthState()).unwrap();
      setAuthChecked(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      setError(error.message || "Authentication check failed");
      setAuthChecked(true);
    }
  }, [dispatch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!authChecked) return;

    let navigationTimer;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    navigationTimer = setTimeout(() => {
      try {
        const initialRoute = isAuthenticated ? "/(tabs)/home" : "/welcome";
        router.replace(initialRoute);
      } catch (navError) {
        console.error("Navigation failed:", navError);
        router.replace("/welcome");
      }
    }, 2000);

    return () => {
      if (navigationTimer) clearTimeout(navigationTimer);
    };
  }, [fadeAnim, authChecked, isAuthenticated]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ffff", "#ffff", "#ffff"]}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {error && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: "100%", height: "100%" },
});
