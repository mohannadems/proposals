import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { calculateProfileProgress } from "../../utils/profileProgress";
import ProfileCompletionAlert from "./ProfileCompletionAlert";

const withProfileCompletion = (WrappedComponent) => {
  return (props) => {
    const { data } = useSelector((state) => state.profile);
    const router = useRouter();

    // Calculate progress using the utility function
    const { progress } = calculateProfileProgress(data);

    // Use state to force re-render when progress changes
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
      // Trigger re-render by toggling refresh state when progress changes
      setRefresh((prev) => !prev);
    }, [progress]);

    // Always render ProfileCompletionAlert when progress is less than 100
    if (progress < 100) {
      return (
        <View style={{ flex: 1 }}>
          <ProfileCompletionAlert />
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: 20,
            }}
          >
            <MaterialIcons
              name="error-outline"
              size={80}
              color={COLORS.primary}
              style={{ marginBottom: 20 }}
            />
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#1a1a1a",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Profile Incomplete
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                marginBottom: 24,
                lineHeight: 24,
              }}
            >
              Please complete your profile ({progress}%) to access matches and
              start your journey to finding love
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(profile)/fillProfileData")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  Complete Profile
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withProfileCompletion;
