import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
  updateProfile,
} from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";
import { useRouter } from "expo-router";

export default function PreferencesStep() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, loading } = useSelector((state) => state.profile);

  const handleSubmit = async () => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      router.replace("/(tabs)/home");
    } catch (error) {
      // Handle error
    }
  };

  const handleBack = () => {
    dispatch(setStep(5));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AuthInput
          label="About Me"
          value={data.bio}
          onChangeText={(value) => handleChange("bio", value)}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <AuthInput
          label="What I'm Looking For"
          value={data.aboutPartner}
          onChangeText={(value) => handleChange("aboutPartner", value)}
          placeholder="Describe your ideal partner"
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            style={styles.backButton}
            type="secondary"
          />
          <Button
            title="Complete Profile"
            onPress={handleSubmit}
            style={styles.nextButton}
            loading={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
