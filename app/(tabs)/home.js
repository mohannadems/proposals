import React from "react";
import HomeScreen from "../../components/home/HomeScreen";
import LikedMeScreen from "../../components/home/LikedMeScreen";
import wrappedScreen from "../../components/profile/wrappedScreen";
function home() {
  return (
    <>
      <LikedMeScreen />
    </>
  );
}

export default wrappedScreen(home);
