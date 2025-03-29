import { useCallback } from "react";

export const useImageUtils = () => {
  const getProfileImage = useCallback(
    (user, defaultImage = require("../assets/images/11.jpg")) => {
      try {
        if (user?.photo_url) {
          return { uri: user.photo_url };
        }

        if (
          user?.photos &&
          Array.isArray(user.photos) &&
          user.photos.length > 0
        ) {
          const mainPhoto = user.photos.find((photo) => photo.is_main === 1);

          if (mainPhoto) {
            if (mainPhoto.photo_url) {
              return { uri: mainPhoto.photo_url };
            }
            if (mainPhoto.url) {
              return { uri: mainPhoto.url };
            }
          }

          const firstPhoto = user.photos[0];
          if (firstPhoto.photo_url) {
            return { uri: firstPhoto.photo_url };
          }
          if (firstPhoto.url) {
            return { uri: firstPhoto.url };
          }
        }

        return defaultImage;
      } catch (error) {
        console.error("Error getting profile image:", error);
        return defaultImage;
      }
    },
    []
  );

  return {
    getProfileImage,
  };
};
