import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";
import ActionButton from "./ActionButton";

const ProfileActions = ({
  isMatch,
  hasBeenLiked,
  onLike,
  onDislike,
  isLikeLoading,
  isDislikeLoading,
  translations,
  styles: customStyles,
}) => {
  if (isMatch) {
    return (
      <View style={[styles.container, styles.matchedContainer]}>
        <View style={styles.matchedHeader}>
          <Feather name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.matchedText}>{translations.matched}</Text>
        </View>
        <Text style={styles.matchedSubtext}>
          {translations.matchDescription}
        </Text>
      </View>
    );
  }

  if (hasBeenLiked) {
    return (
      <View style={[styles.container, styles.likedContainer]}>
        <Feather name="check" size={24} color="#9E9E9E" />
        <Text style={styles.likedText}>{translations.liked}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActionButton
        icon="heart"
        label={translations.like}
        onPress={onLike}
        primary
        loading={isLikeLoading}
      />
      <ActionButton
        icon="x"
        label={translations.dislike}
        onPress={onDislike}
        loading={isDislikeLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "start",
    gap: 15,
    marginVertical: 16,
  },
  matchedContainer: {
    flexDirection: "column",
    padding: 16,
    backgroundColor: "rgba(255, 99, 99, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 99, 99, 0.3)",
  },
  matchedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  matchedText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 8,
  },
  matchedSubtext: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  likedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
  },
  likedText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#718096",
    fontWeight: "500",
  },
});

export default ProfileActions;
