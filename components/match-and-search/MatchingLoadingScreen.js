import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#B65165",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#B65165", "#D97485"],
};

const MatchingLoadScreen = () => {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.circleContainer,
              {
                transform: [{ scale }, { rotate }],
              },
            ]}
          >
            <View style={styles.innerCircle}>
              <Text style={styles.emoji}>❤️</Text>
            </View>
          </Animated.View>

          {[...Array(6)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  top: `${15 + index * 12}%`,
                  left: `${10 + index * 15}%`,
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 5],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}

          <Text style={styles.title}>Finding Your Match</Text>
          <Text style={styles.subtitle}>
            We're searching for someone special just for you...
          </Text>

          <View style={styles.dotsContainer}>
            {[...Array(3)].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.8, 1, 0.8],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  circleContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 40,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginHorizontal: 5,
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    opacity: 0.4,
  },
});

export default MatchingLoadScreen;
