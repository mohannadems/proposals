export const processProfileData = (userProfile, profile) => {
  const fullName = `${userProfile.first_name || ""} ${
    userProfile.last_name || ""
  }`.trim();
  const firstName = userProfile.first_name || "";
  const age = profile.age || userProfile.age || "";
  const city =
    profile.city || userProfile.city_location || "Location not provided";
  const bio = profile.bio || "No bio provided";

  const interests = profile.hobbies || [];

  const stats = {
    height: profile.height,
    weight: profile.weight,
    marital_status: profile.marital_status,
    children: profile.children ? `${profile.children} children` : null,
    smoking: profile.smoking_status ? "Yes" : "No",
    drinking: profile.drinking_status,
    employment: profile.employment_status ? "Employed" : "Unemployed",
    education: profile.educational_level,
    religion: profile.religion,
    zodiac: profile.zodiac_sign,
    sports: profile.sports_activity,
    sleep: profile.sleep_habit,
  };

  return {
    fullName,
    firstName,
    age,
    city,
    bio,
    interests,
    stats,
  };
};
