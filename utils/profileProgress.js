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
  4: [{ key: "photos", label: "Profile Photo" }],
};

// utils/profileProgress.js

// ... keep existing STEP_FIELDS ...

export const calculateProfileProgress = (userData, savedProgress = null) => {
  if (!userData) return { progress: 0, missingFields: [], stepProgress: {} };

  const profile = userData.profile || {};
  const formData = savedProgress?.formData || {};

  // Combine data from API and saved form progress
  const combinedData = {
    ...userData,
    ...profile,
    ...formData,
  };

  // Calculate progress for each step
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

      // Special handling for employment-related fields
      if (key === "employment_status") {
        // Consider employment status field completed if it's set
        isCompleted = value !== null && value !== undefined;
      } else if (key === "job_title_id" || key === "position_level_id") {
        // For job title and position level, only check if employed
        const employmentStatus = combinedData["employment_status"];

        // If not employed, these fields are not required
        if (employmentStatus === false || employmentStatus === null) {
          isCompleted = true;
        } else {
          // If employed, check if job title or position level is set
          isCompleted = value !== null && value !== undefined && value !== 0;
        }
      } else {
        // Regular field validation
        isCompleted =
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === "boolean" && value === true) ||
          (value !== null &&
            value !== undefined &&
            value !== "" &&
            value !== 0);
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

  const totalProgress = Math.round((totalCompleted / totalFields) * 100);

  // Sort missing fields by step
  const sortedMissingFields = missingFields.sort((a, b) => a.step - b.step);

  return {
    progress: totalProgress,
    stepProgress,
    missingFields: sortedMissingFields,
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
