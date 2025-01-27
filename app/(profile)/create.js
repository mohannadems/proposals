import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import ProfileSteps from "../../components/profile/ProfileSteps";
import { COLORS } from "../../constants/colors";

export default function CreateProfile() {
  const router = useRouter();
  const { isProfileComplete } = useSelector((state) => state.profile);

  useEffect(() => {
    if (isProfileComplete) {
      router.replace("/(tabs)/home");
    }
  }, [isProfileComplete]);

  return (
    <View style={styles.container}>
      <ProfileSteps />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
