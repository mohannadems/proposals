import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Camera,
  Settings,
  LogOut,
  ChevronRight,
  Edit2,
  User,
} from "react-native-feather";
import * as ImagePicker from "expo-image-picker";

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

const sectionFields = {
  personalInformation: ["firstName", "lastName", "email", "phoneNumber"],
  accountDetails: ["username", "password"],
};

const ProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const renderSection = (section, fields, data = {}) => {
    const sectionTitle = section.charAt(0).toUpperCase() + section.slice(1);
    return (
      <View key={section} style={styles.section}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        {fields.map((field, index) => {
          const fieldName = field.split(".").pop();
          const displayName = fieldName
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          return (
            <TouchableOpacity
              key={`${section}-${field}`}
              style={[
                styles.fieldContainer,
                index === fields.length - 1 && styles.lastField,
              ]}
              onPress={() => {
                /* Handle field edit */
              }}
            >
              <Text style={styles.fieldLabel}>{displayName}</Text>
              <View style={styles.fieldValueContainer}>
                <Text style={styles.fieldValue}>
                  {data[fieldName] || "Not set"}
                </Text>
                <ChevronRight
                  stroke={COLORS.text}
                  width={20}
                  height={20}
                  style={styles.chevron}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryGradient[0]}
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Header */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                /* Handle settings */
              }}
            >
              <Settings stroke={COLORS.white} width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                /* Handle logout */
              }}
            >
              <LogOut stroke={COLORS.white} width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.profileImageWrapper}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <User stroke={COLORS.white} width={40} height={40} />
                </View>
              )}
              <View style={styles.editButton}>
                <Camera stroke={COLORS.white} width={20} height={20} />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Profile Sections */}
        <View style={styles.content}>
          {Object.entries(sectionFields).map(([section, fields]) =>
            renderSection(section, fields)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 0, // Remove extra padding at the top
    paddingBottom: 80,
    paddingHorizontal: 0, // Extend to full width
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 0,
    paddingTop: 50, // Adjust for status bar
  },
  iconButton: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  content: {
    padding: 20,
    marginTop: -50,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  fieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastField: {
    borderBottomWidth: 0,
  },
  fieldLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  fieldValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.6,
    marginRight: 10,
  },
  chevron: {
    opacity: 0.3,
  },
});

export default ProfileScreen;
