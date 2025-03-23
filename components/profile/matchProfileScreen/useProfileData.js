import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProfile,
  clearUserProfile,
} from "../../../store/slices/userProfileSlice";
import { processProfileData } from "./profileHelpers";

export const useProfileData = (userId) => {
  const dispatch = useDispatch();

  const { userProfile, loading, error, likedUsers, dislikedUsers } =
    useSelector((state) => state.userProfile);

  const isLiked = userProfile ? likedUsers.includes(userProfile.id) : false;
  const isDisliked = userProfile
    ? dislikedUsers.includes(userProfile.id)
    : false;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }

    return () => {
      dispatch(clearUserProfile());
    };
  }, [dispatch, userId]);

  if (!userProfile) {
    return {
      userProfile: null,
      profile: {},
      photos: [],
      loading,
      error,
      isLiked,
      isDisliked,
      profileData: {},
    };
  }

  let photos = [];
  if (
    userProfile.profile &&
    userProfile.profile.photos &&
    userProfile.profile.photos.length > 0
  ) {
    photos = userProfile.profile.photos;
  } else if (userProfile.photos && userProfile.photos.length > 0) {
    photos = userProfile.photos;
  } else {
    photos = [
      {
        photo_url:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      },
    ];
  }

  const profile = userProfile.profile || {};
  const profileData = processProfileData(userProfile, profile);

  return {
    userProfile,
    profile,
    photos,
    loading,
    error,
    isLiked,
    isDisliked,
    profileData,
  };
};
