import { fetchProfile } from "../store/slices/profile.slice";

export const BASE_URL = "https://proposals.world/api";
export const ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  FETCH_PROFILE: "/me",
};
