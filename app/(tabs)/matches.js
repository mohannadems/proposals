import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function MatchesScreen() {
  const matches = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      bio: "Loves hiking and reading.",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 25,
      bio: "Enjoys traveling and cooking.",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
      </View>

      <View style={styles.content}>
        {matches.map((match) => (
          <TouchableOpacity
            key={match.id}
            style={styles.matchCard}
            onPress={() => router.push(`/(tabs)/matches/${match.id}`)}
          >
            <Image source={{ uri: match.image }} style={styles.matchImage} />
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>
                {match.name}, {match.age}
              </Text>
              <Text style={styles.matchBio}>{match.bio}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  content: {
    padding: 20,
  },
  matchCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  matchBio: {
    fontSize: 14,
    color: COLORS.text + "80",
  },
});
