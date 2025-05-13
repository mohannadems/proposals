import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { login } from "../store/slices/auth.slice";
import { fetchProfile } from "../store/slices/profile.slice";
import { useBiometric } from "./useBiometric";

export const useHandleLogin = (form, t) => {
  const dispatch = useDispatch();

  const handleLoginSuccess = async (credentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      if (result) {
        await biometric.saveBiometricCredentials(credentials);
        await dispatch(fetchProfile());
        router.replace("/(tabs)/home");
      }
      return result;
    } catch (error) {
      form.setValidationErrors((prev) => ({
        ...prev,
        general: error.message || t("auth.invalid_credentials"),
      }));
      throw error;
    }
  };

  const biometric = useBiometric(handleLoginSuccess);

  const handleLogin = async () => {
    if (!form.validateForm()) return;

    try {
      await handleLoginSuccess(form.credentials);
    } catch (error) {
      form.setValidationErrors((prev) => ({
        ...prev,
        general: t("auth.invalid_credentials"),
      }));
    }
  };

  return { handleLogin, biometric };
};
