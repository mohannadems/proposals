import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { showMessage } from "react-native-flash-message";

import { likeUser, dislikeUser } from "../../../store/slices/userProfileSlice";
import {
  setActiveTab,
  fetchUserLikes,
  fetchUserMatches,
} from "../../../store/slices/userMatchesSlice";

export const useProfileActions = (userProfile, isLiked, isDisliked) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showDislikeModal, setShowDislikeModal] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLike = useCallback(() => {
    if (userProfile && !isLiked) {
      setShowLikeModal(true);
    }
  }, [userProfile, isLiked]);

  const handleDislike = useCallback(() => {
    if (userProfile && !isDisliked) {
      setShowDislikeModal(true);
    }
    dispatch(fetchUserMatches());
  }, [userProfile, isDisliked, dispatch]);

  const handleLikeConfirm = useCallback(async () => {
    if (userProfile && !isLiked) {
      try {
        setLikeLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const likeResponse = await dispatch(likeUser(userProfile.id)).unwrap();
        await new Promise((resolve) => setTimeout(resolve, 500));
        setShowLikeModal(false);

        const isMatch = likeResponse?.is_match === true;

        if (isMatch) {
          router.push({
            pathname: "/(profile)/matchProfile",
            params: {
              userId: userProfile.id,
              fromTab: "matches",
            },
          });
        } else {
          showMessage({
            message: "Success",
            description: `You liked ${userProfile.first_name}!`,
            type: "success",
          });

          dispatch(setActiveTab("Liked"));

          router.push({
            pathname: "/(tabs)/matches",
            params: { showLiked: "true" },
          });
        }
      } catch (error) {
        console.error("Error liking user:", error);
        showMessage({
          message: "Error",
          description: "There was a problem liking this profile",
          type: "danger",
        });
      } finally {
        setShowLikeModal(false);
        setLikeLoading(false);
      }
    } else {
      setShowLikeModal(false);
    }
  }, [dispatch, userProfile, isLiked, router]);

  const handleDislikeConfirm = useCallback(async () => {
    if (userProfile && !isDisliked) {
      try {
        setDislikeLoading(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        await dispatch(dislikeUser(userProfile.id)).unwrap();
        await new Promise((resolve) => setTimeout(resolve, 3000));

        dispatch(fetchUserMatches());
        router.back();
      } catch (error) {
        console.error("Error disliking user:", error);
        showMessage({
          message: "Error",
          description: "There was a problem disliking this profile",
          type: "danger",
        });
      } finally {
        setDislikeLoading(false);
        setShowDislikeModal(false);
      }
    }
  }, [dispatch, userProfile, isDisliked, router]);

  return {
    likeLoading,
    dislikeLoading,
    showLikeModal,
    showDislikeModal,
    handleLike,
    handleDislike,
    handleLikeConfirm,
    handleDislikeConfirm,
    setShowLikeModal,
    setShowDislikeModal,
  };
};
