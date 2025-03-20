"use client"

import React, { useEffect } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, SafeAreaView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { X, MessageCircle } from "lucide-react-native"
import Confetti from "react-native-confetti"

const COLORS = {
  primary: "#9e086c",
  secondary: "#5856D6",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1C1C1E",
  error: "#FF3B30",
  success: "#34C759",
  border: "#E5E5EA",
  primaryGradient: ["#9e086c", "#9e086c"],
}

const { width, height } = Dimensions.get("window")

const MatchScreen = ({
  myProfile = {
    name: "Alex",
    image: "https://i.pravatar.cc/300?img=11",
  },
  matchProfile = {
    name: "Jordan",
    image: "https://i.pravatar.cc/300?img=32",
  },
  onClose = () => {},
  onMessage = () => {},
}) => {
  const confettiRef = React.useRef()
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Start confetti
    if (confettiRef.current) {
      confettiRef.current.startConfetti()
    }

    // Animate in the content
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.stopConfetti()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["rgba(158, 8, 108, 0.95)", "rgba(88, 86, 214, 0.9)"]} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.headerText}>It's a Match!</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={COLORS.white} size={24} />
          </TouchableOpacity>
        </View>

        <Confetti ref={confettiRef} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.matchText}>You and {matchProfile.name} have liked each other</Text>

          <View style={styles.profileContainer}>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: myProfile.image }} style={styles.profileImage} />
            </View>
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: matchProfile.image }} style={styles.profileImage} />
            </View>
          </View>

          <Text style={styles.subText}>Start a conversation now!</Text>

          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <MessageCircle color={COLORS.white} size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Send a Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  matchText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  profileImageWrapper: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.35,
    borderWidth: 3,
    borderColor: COLORS.white,
    overflow: "hidden",
    margin: -15,
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: width * 0.35,
  },
  subText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.9,
  },
  messageButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  keepSwipingButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  keepSwipingText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
})

export default MatchScreen

