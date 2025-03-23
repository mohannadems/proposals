import AsyncStorage from "@react-native-async-storage/async-storage";

const getStorageKeys = (userId) => ({
  FORM_DATA: `profile_form_data_${userId}`,
  LAST_UPDATED: `profile_form_last_updated_${userId}`,
});

export const saveFormProgress = async (userId, step, formData) => {
  if (!userId) {
    return;
  }

  try {
    const storageKeys = getStorageKeys(userId);
    const dataToSave = {
      step,
      formData: {
        ...formData,
        date_of_birth: formData.date_of_birth
          ? formData.date_of_birth.toISOString()
          : null,
      },
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      storageKeys.FORM_DATA,
      JSON.stringify(dataToSave)
    );
  } catch (error) {
    console.error("Error saving form progress:", error);
  }
};

export const loadFormProgress = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const storageKeys = getStorageKeys(userId);
    const savedData = await AsyncStorage.getItem(storageKeys.FORM_DATA);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        ...parsed,
        formData: {
          ...parsed.formData,
          date_of_birth: parsed.formData.date_of_birth
            ? new Date(parsed.formData.date_of_birth)
            : null,
        },
      };
    }
    return null;
  } catch (error) {
    console.error("Error loading form progress:", error);
    return null;
  }
};

export const clearFormProgress = async (userId) => {
  if (!userId) return;

  try {
    const storageKeys = getStorageKeys(userId);
    await AsyncStorage.removeItem(storageKeys.FORM_DATA);
  } catch (error) {
    console.error("Error clearing form progress:", error);
  }
};

export const clearAllFormProgress = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const formDataKeys = keys.filter((key) =>
      key.startsWith("profile_form_data_")
    );
    await AsyncStorage.multiRemove(formDataKeys);
  } catch (error) {
    console.error("Error clearing all form progress:", error);
  }
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
