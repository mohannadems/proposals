export const isApiProfileComplete = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) {
    return false;
  }

  const criticalFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "educational_level",
    "marital_status",
    "employment_status",
    "job_title",
    "financial_status",
  ];

  const filledCount = criticalFields.filter(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  ).length;

  const hasPhotos =
    profile.photos &&
    Array.isArray(profile.photos) &&
    profile.photos.length > 0;

  const isComplete = filledCount >= criticalFields.length * 0.8 && hasPhotos;

  return isComplete;
};

export const isProfileEmpty = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) return true;

  const requiredFields = [
    "nationality",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "marital_status",
    "height",
    "weight",
  ];

  const emptyCount = requiredFields.filter(
    (field) =>
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
  ).length;

  return emptyCount > requiredFields.length * 0.7;
};

export const checkProfileCompletion = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) {
    return {
      isProfileComplete: false,
      missingFields: ["profile data missing"],
    };
  }

  const requiredFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "employment_status",
    "marital_status",
    "height",
    "weight",
  ];

  const requiredArrayFields = ["photos"];

  const missingFields = [];

  requiredFields.forEach((field) => {
    if (
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
    ) {
      missingFields.push(field);
    } else if (field === "employment_status" && profile[field] === 0) {
      missingFields.push(field);
    }
  });

  requiredArrayFields.forEach((field) => {
    if (
      !profile[field] ||
      !Array.isArray(profile[field]) ||
      profile[field].length === 0
    ) {
      missingFields.push(field);
    }
  });

  const isProfileComplete = missingFields.length === 0;

  return {
    isProfileComplete,
    missingFields,
  };
};
