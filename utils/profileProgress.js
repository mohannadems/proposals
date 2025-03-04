// utils/profileProgress.js

const STEP_FIELDS = {
  1: [
    { key: "bio_en", label: "English Bio" },
    { key: "bio_ar", label: "Arabic Bio" },
    { key: "gender", label: "Gender" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "guardian_contact", label: "Guardian Contact" },
  ],
  2: [
    { key: "nationality_id", label: "Nationality" },
    { key: "country_of_residence_id", label: "Country of Residence" },
    { key: "city_id", label: "City" },
    { key: "origin_id", label: "Origin" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "hair_color_id", label: "Hair Color" },
    { key: "skin_color_id", label: "Skin Color" },
    { key: "marital_status_id", label: "Marital Status" },
    { key: "number_of_children", label: "Number of Children" },
    { key: "smoking_status", label: "Smoking Status" },
    { key: "drinking_status_id", label: "Drinking Status" },
    { key: "sports_activity_id", label: "Sports Activity" },
    { key: "sleep_habit_id", label: "Sleep Habits" },
    { key: "marriage_budget_id", label: "Marriage Budget" },
    { key: "religiosity_level_id", label: "Religiosity Level" },
    { key: "religion_id", label: "Religion" },
    { key: "hobbies", label: "Hobbies" },
    { key: "pets", label: "Pets" },
  ],
  3: [
    { key: "educational_level_id", label: "Education Level" },
    { key: "specialization_id", label: "Specialization" },
    { key: "employment_status", label: "Employment Status" },
    { key: "position_level_id", label: "Position Level" },
    { key: "job_title_id", label: "Job Title" },
    { key: "financial_status_id", label: "Financial Status" },
    { key: "housing_status_id", label: "Housing Status" },
    { key: "car_ownership", label: "Car Ownership" },
  ],
};

export const calculateProfileProgress = (userData, savedProgress = null) => {
  if (!userData) return { progress: 0, missingFields: [], stepProgress: {} };

  const profile = userData.profile || {};
  const formData = savedProgress?.formData || {};

  // Merge user data from different sources
  const combinedData = {
    ...userData,
    ...profile,
    ...formData,
  };

  const stepProgress = {};
  const missingFields = [];
  let totalCompleted = 0;
  let totalFields = 0;

  Object.entries(STEP_FIELDS).forEach(([step, fields]) => {
    let completedInStep = 0;
    const stepMissingFields = [];

    fields.forEach(({ key, label }) => {
      const value = combinedData[key];
      totalFields++;

      let isCompleted = false;

      if (key === "employment_status") {
        isCompleted = value !== null && value !== undefined;
      } else if (key === "job_title_id" || key === "position_level_id") {
        const employmentStatus = combinedData["employment_status"];
        isCompleted =
          employmentStatus === false || employmentStatus === null
            ? true
            : value !== null && value !== undefined && value !== 0;
      } else if (key === "car_ownership") {
        // Check if car_ownership is 0 (which means false)
        isCompleted = value !== 0; // If value is 0, it's considered not completed
      } else if (key === "hobbies" || key === "pets") {
        // Consider both null and empty array as valid completed states
        isCompleted = true; // Always mark as completed since they're optional
      } else {
        // General validation for other fields
        if (Array.isArray(value)) {
          isCompleted = value.length > 0;
        } else if (typeof value === "boolean") {
          isCompleted = value === true;
        } else if (typeof value === "object" && value !== null) {
          isCompleted = Object.keys(value).length > 0;
        } else {
          isCompleted =
            value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== 0;
        }
      }

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

    stepProgress[step] = {
      completed: completedInStep,
      total: fields.length,
      percentage: Math.round((completedInStep / fields.length) * 100),
    };

    missingFields.push(...stepMissingFields);
  });

  const totalProgress =
    totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0;

  return {
    progress: totalProgress,
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
