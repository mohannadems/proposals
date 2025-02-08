import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthState } from "../store/slices/auth.slice";

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkAuthState()).unwrap();
        setAuthChecked(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthChecked(true); // Proceed even if check fails
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!authChecked) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const navigationTimer = setTimeout(() => {
      const initialRoute = isAuthenticated ? "/(tabs)/home" : "/welcome";
      router.replace(initialRoute);
    }, 2000);

    return () => clearTimeout(navigationTimer);
  }, [fadeAnim, authChecked, isAuthenticated]);

  return (
    <LinearGradient
      colors={["white", "white"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/logo2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
});
