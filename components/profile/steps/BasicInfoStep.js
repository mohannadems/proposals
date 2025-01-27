import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import AuthInput from "../../forms/AuthInput";
import SelectInput from "../../forms/SelectInput";
import GenderSelect from "../../forms/GenderSelect";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";
import { nationalities, origins, religions } from "../../../constants/options";

export default function BasicInfoStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    // Add validation here
    dispatch(setStep(1));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AuthInput
          label="Full Name"
          value={data.name}
          onChangeText={(value) => handleChange("name", value)}
          placeholder="Enter your full name"
        />

        <GenderSelect
          value={data.gender}
          onChange={(value) => handleChange("gender", value)}
        />

        <SelectInput
          label="Nationality"
          value={data.nationality}
          options={nationalities}
          onChange={(value) => handleChange("nationality", value)}
        />

        <SelectInput
          label="Origin"
          value={data.origin}
          options={origins}
          onChange={(value) => handleChange("origin", value)}
        />

        <SelectInput
          label="Religion"
          value={data.religion}
          options={religions}
          onChange={(value) => handleChange("religion", value)}
        />

        <Button title="Next" onPress={handleNext} style={styles.button} />
      </View>
    </ScrollView>
  );
}
