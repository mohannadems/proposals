// utils/profileProgress.js

const STEP_FIELDS = {
  1: [
    { key: "bio", label: "English Bio" },

    { key: "guardian_contact", label: "Guardian Contact" },
  ],
  2: [
    { key: "nationality", label: "Nationality" },
    { key: "country_of_residence_id", label: "Country of Residence" },
    { key: "city_id", label: "City" },
    { key: "origin_id", label: "Origin" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "skin_color_id", label: "Skin Color" },
    { key: "number_of_children", label: "Number of Children" },
    { key: "smoking_status", label: "Smoking Status" },
    { key: "drinking_status_id", label: "Drinking Status" },
    { key: "sports_activity_id", label: "Sports Activity" },
    { key: "religiosity_level_id", label: "Religiosity Level" },
    { key: "religion_id", label: "Religion" },
    { key: "hobbies", label: "Hobbies" },
    { key: "eye_color", label: "Eye Color " },
  ],
  3: [
    { key: "educational_level_id", label: "Education Level" },
    { key: "specialization_id", label: "Specialization" },
    { key: "job_title_id", label: "Job Title" },
    { key: "financial_status_id", label: "Financial Status" },
  ],
};

const FIELD_MAPPING = {
  bio_en: "bio_en",
  date_of_birth: "date_of_birth",
  nationality_id: "nationality",
  religion_id: "religion",
  country_of_residence_id: "country_of_residence",
  city_id: "city",
  origin_id: "origin",
  hair_color_id: "hair_color",
  eye_color: "eye colors",
  skin_color_id: "skin_color",
  marital_status_id: "marital_status",
  number_of_children: "children",
  drinking_status_id: "drinking_status",
  sports_activity_id: "sports_activity",
  sleep_habit_id: "sleep_habit",
  marriage_budget_id: "marriage_budget",
  religiosity_level_id: "religiosity_level",
  educational_level_id: "educational_level",
  specialization_id: "specialization",
  position_level_id: "position_level",
  job_title_id: "job_title",
  financial_status_id: "financial_status",
  housing_status_id: "housing_status",
  social_media_presence_id: "social_media_presence",
  smoking_status: "smoking_status",
};

// Strict validation for field completion
const isFieldComplete = (key, value, combinedData) => {
  // Special handling for specific fields
  switch (key) {
    case "employment_status":
      // Consider it complete if it's a valid boolean or non-zero number
      return value === true || value === 1 || (value !== 0 && value !== null);

    case "job_title_id":
    case "position_level_id":
      // If not employed, these fields are optional
      const employmentStatus = combinedData["employment_status"];
      return (
        employmentStatus === false ||
        employmentStatus === 0 ||
        employmentStatus === null ||
        (value !== null && value !== 0)
      );

    case "car_ownership":
      // More flexible boolean check
      return value === true || value === 1 || value === "1";

    case "hobbies":
    case "pets":
      // Consider optional, but prefer non-empty arrays
      return true; // Always consider these optional

    case "profile_image":
      // More lenient image check
      return !!(
        value ||
        (combinedData.photos && combinedData.photos.length > 0) ||
        combinedData.avatar_url
      );

    case "bio_en":
      // Check for non-empty bio
      return value && value.trim().length > 0;

    case "date_of_birth":
      // More flexible date of birth check
      return value !== null && value !== undefined && value !== "";

    case "guardian_contact":
      // Optional for some users
      return true;

    default:
      // More lenient check for most fields
      if (Array.isArray(value)) {
        return true; // Consider array fields optional
      }

      // Allow 0 for numeric fields like height, weight
      if (typeof value === "number") {
        return value !== null && value !== undefined;
      }

      return value !== null && value !== undefined && value !== "";
  }
};

export const calculateProfileProgress = (userData, savedProgress = null) => {
  // If no user data, return base progress
  if (!userData) {
    return {
      progress: 0,
      stepProgress: Object.keys(STEP_FIELDS).reduce((acc, step) => {
        acc[step] = {
          completed: 0,
          total: STEP_FIELDS[step].length,
          percentage: 0,
        };
        return acc;
      }, {}),
      missingFields: [],
      completedFields: 0,
      totalFields: Object.values(STEP_FIELDS).reduce(
        (acc, fields) => acc + fields.length,
        0
      ),
    };
  }

  // Extract profile from different possible structures
  const profile =
    userData.profile || (userData.data && userData.data.profile) || {};

  const combinedData = {
    ...profile,
    ...(savedProgress?.formData || {}),
  };

  const stepProgress = {};
  const missingFields = [];
  let totalCompleted = 0;
  let totalFields = 0;

  Object.entries(STEP_FIELDS).forEach(([step, fields]) => {
    let completedInStep = 0;
    const stepMissingFields = [];

    fields.forEach(({ key, label }) => {
      totalFields++;

      // Get field value from multiple sources
      const fieldValue =
        combinedData[key] ||
        (FIELD_MAPPING[key] ? combinedData[FIELD_MAPPING[key]] : null);

      const isCompleted = isFieldComplete(key, fieldValue, combinedData);

      if (isCompleted) {
        completedInStep++;
        totalCompleted++;
      } else {
        stepMissingFields.push({
          label,
          step: Number(step),
        });
      }
    });

    // Ensure at least some progress is shown
    if (step === "1" && completedInStep === 0 && combinedData.bio) {
      completedInStep = 1;
      totalCompleted++;
    }

    stepProgress[step] = {
      completed: completedInStep,
      total: fields.length,
      percentage: Math.round((completedInStep / fields.length) * 100),
    };

    missingFields.push(...stepMissingFields);
  });

  // Calculate progress purely based on completed fields
  const calculatedProgress = Math.max(
    totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0,
    // Ensure some progress for users with partial data
    combinedData.language ? 10 : 0
  );

  return {
    progress: calculatedProgress,
    stepProgress,
    missingFields: missingFields.sort((a, b) => a.step - b.step),
    completedFields: totalCompleted,
    totalFields,
  };
};

export const getProgressMessage = (progress) => {
  if (progress < 20) return "Let's get started on your profile!";
  if (progress < 40) return "You're making progress!";
  if (progress < 60) return "You're halfway there!";
  if (progress < 80) return "Almost complete!";
  return "Just a few more details to go!";
};

export const getStepStatus = (stepProgress) => {
  if (!stepProgress) return "not-started";
  const { completed, total } = stepProgress;
  if (completed === 0) return "not-started";
  if (completed === total) return "completed";
  return "in-progress";
};
