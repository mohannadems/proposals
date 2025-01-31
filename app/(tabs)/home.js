import React from "react";
import { View, Dimensions, StatusBar } from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <View>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
