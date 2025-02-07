// utils/profileProgress.js
export const calculateProfileProgress = (userData) => {
  if (!userData) return { progress: 0, missingFields: [] };

  const profile = userData.profile || {};

  const mappedData = {
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
    phone_number: userData.phone_number,
    gender: userData.gender,
    bio_en: profile.bio,
    date_of_birth: profile.date_of_birth,
    guardian_contact: profile.guardian_contact,
    height: profile.height,
    weight: profile.weight,
    nationality_id: profile.nationality ? 1 : null,
    country_of_residence_id: profile.country_of_residence ? 1 : null,
    city_id: profile.city ? 1 : null,
    educational_level_id: profile.educational_level ? 1 : null,
    hair_color_id: profile.hair_color ? 1 : null,
    skin_color_id: profile.skin_color ? 1 : null,
    religion_id: profile.religion ? 1 : null,
    marital_status_id: profile.marital_status ? 1 : null,
    financial_status_id: profile.financial_status ? 1 : null,
    employment_status: profile.employment_status === 1,
    car_ownership: profile.car_ownership === 1,
    job_title: profile.job_title || "",
    drinking_status_id: profile.drinking_status ? 1 : null,
    sports_activity_id: profile.sports_activity ? 1 : null,
    social_media_presence_id: profile.social_media_presence ? 1 : null,
    housing_status_id: profile.housing_status ? 1 : null,
    number_of_children: profile.children || 0,
    hobbies: profile.hobbies || [],
    pets: profile.pets || [],
    photos: profile.photos || [],
  };

  const requiredFields = [
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone Number" },
    { key: "gender", label: "Gender" },
    { key: "bio_en", label: "Biography" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "guardian_contact", label: "Guardian Contact" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "nationality_id", label: "Nationality" },
    { key: "country_of_residence_id", label: "Country of Residence" },
    { key: "city_id", label: "City" },
    { key: "educational_level_id", label: "Educational Level" },
    { key: "hair_color_id", label: "Hair Color" },
    { key: "skin_color_id", label: "Skin Color" },
    { key: "religion_id", label: "Religion" },
    { key: "marital_status_id", label: "Marital Status" },
    { key: "financial_status_id", label: "Financial Status" },
    { key: "employment_status", label: "Employment Status" },
    { key: "car_ownership", label: "Car Ownership" },
    { key: "job_title", label: "Job Title" },
    { key: "drinking_status_id", label: "Drinking Status" },
    { key: "sports_activity_id", label: "Sports Activity" },
    { key: "social_media_presence_id", label: "Social Media Presence" },
    { key: "housing_status_id", label: "Housing Status" },
    { key: "number_of_children", label: "Number of Children" },
    { key: "hobbies", label: "Hobbies" },
    { key: "pets", label: "Pets" },
    { key: "photos", label: "Profile Photos" },
  ];

  let completedFields = 0;
  const missingFields = [];

  requiredFields.forEach(({ key, label }) => {
    const value = mappedData[key];

    // Validation logic
    const isCompleted =
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "boolean" && value === true) ||
      (value !== null && value !== undefined && value !== "");

    if (isCompleted) {
      completedFields++;
    } else {
      missingFields.push(label);
    }
  });

  const progress = Math.round((completedFields / requiredFields.length) * 100);

  return { progress, missingFields };
};
