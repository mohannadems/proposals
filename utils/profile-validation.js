import * as Yup from "yup";

// Helper function to create number validation with required message
const createNumberValidation = (fieldName) =>
  Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .required(`Please select your ${fieldName}`);

export const profileValidationSchema = Yup.object().shape({
  // Personal Information - Step 1
  bio_en: Yup.string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio cannot exceed 500 characters")
    .required("English bio is required"),

  bio_ar: Yup.string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio cannot exceed 500 characters")
    .required("Arabic bio is required"),

  gender: Yup.string()
    .oneOf(["male", "female"], "Please select a gender")
    .required("Gender is required"),

  date_of_birth: Yup.mixed()
    .test(
      "is-date",
      "Invalid date",
      (value) => value instanceof Date || !isNaN(new Date(value))
    )
    .required("Date of birth is required"),

  guardian_contact: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Guardian contact is required"),

  // Location Information
  nationality_id: createNumberValidation("nationality"),
  country_of_residence_id: createNumberValidation("country of residence"),
  city_id: createNumberValidation("city"),
  origin_id: createNumberValidation("origin"),

  // Physical Attributes
  height: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),

  weight: Yup.number().nullable(),

  hair_color_id: Yup.number().nullable(),
  skin_color_id: Yup.number()
    .nullable()
    .required("Please select your skin color"),

  // Education and Work
  educational_level_id: createNumberValidation("education level"),
  specialization_id: Yup.number().nullable(),
  employment_status: Yup.boolean().nullable(),
  job_title_id: Yup.number().nullable(),

  // Financial and Housing
  financial_status_id: createNumberValidation("financial status"),
  housing_status_id: Yup.number()
    .nullable()
    .required("Please select your housing status"),
  car_ownership: Yup.boolean()
    .nullable()
    .required("Please select your car ownership status"),
  marriage_budget_id: createNumberValidation("marriage budget"),

  // Marital and Family
  marital_status_id: createNumberValidation("marital status"),
  number_of_children: Yup.number()
    .nullable()
    .required("Please select your Number of Children"),

  // Religious and Cultural
  religion_id: createNumberValidation("religion"),
  religiosity_level_id: createNumberValidation("religiosity level"),

  // Lifestyle
  sleep_habit_id: Yup.number()
    .nullable()
    .required("Please select your sleep habites"),
  sports_activity_id: Yup.number().nullable(),
  social_media_presence_id: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value)),
  // Smoking and Drinking
  smoking_status: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .required("Please select your smoking status"),

  smoking_tools: Yup.array().when("smoking_status", {
    is: (value) => value > 1,
    then: () =>
      Yup.array()
        .min(1, "Please select at least one smoking tool")
        .of(Yup.number().positive()),
    otherwise: () => Yup.array().of(Yup.number()),
  }),

  drinking_status_id: Yup.number()
    .nullable()
    .required("Please select your drink status"),

  // Additional Information
  hobbies: Yup.array()
    .of(Yup.number())
    .min(0, "Hobbies cannot be negative")
    .max(3, "Maximum 3 hobbies allowed"),

  pets: Yup.array().of(Yup.number()),

  health_issues_en: Yup.string().max(
    500,
    "Health issues description cannot exceed 500 characters"
  ),

  health_issues_ar: Yup.string().max(
    500,
    "Health issues description cannot exceed 500 characters"
  ),

  zodiac_sign_id: Yup.number().nullable(),
  // Female-specific fields
  hijab_status: Yup.mixed().when("gender", {
    is: "female",
    then: (schema) =>
      schema
        .oneOf([0, 1], "Please select a hijab status")
        .required("Hijab status is required for females"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Profile Image
});

// Define validation fields for each step
export const stepFields = {
  1: ["bio_en", "bio_ar", "gender", "date_of_birth", "guardian_contact"],
  2: [
    "nationality_id", //
    "country_of_residence_id", //
    "city_id", ///
    "origin_id", //
    "hijab_status", // Include hijab_status for female users
    "height", //
    "weight", //
    "hair_color_id", //
    "skin_color_id", //
    "marital_status_id", //
    "number_of_children", //
    "smoking_status", //
    "smoking_tools", //
    "drinking_status_id", //
    "sports_activity_id", //
    "sleep_habit_id", //
    "marriage_budget_id", //
    "religiosity_level_id", //
    "religion_id", //
    "hobbies", //
    "pets", //
  ],
  3: [
    "educational_level_id",
    "specialization_id",
    "employment_status",
    "position_level_id",
    "job_title_id",
    "financial_status_id",
    "housing_status_id",
    "car_ownership",
    "zodiac_sign",
  ],
  4: ["profile_image"],
};
export const initialProfileState = {
  bio_en: "",
  bio_ar: "",
  gender: "",
  date_of_birth: null,
  guardian_contact: "",
  nationality_id: null,
  country_of_residence_id: null,
  city_id: null,
  origin_id: null,
  height: null,
  weight: null,
  hair_color_id: null,
  skin_color_id: null,
  educational_level_id: null,
  specialization_id: null,
  employment_status: null,
  position_level_id: null,
  job_title_id: null,
  financial_status_id: null,
  housing_status_id: null,
  car_ownership: null,
  marriage_budget_id: null,
  marital_status_id: null,
  number_of_children: 0,
  religion_id: null,
  religiosity_level_id: null,
  sleep_habit_id: null,
  sports_activity_id: null,
  social_media_presence_id: null,
  smoking_status: null,
  smoking_tools: [],
  drinking_status_id: null,
  hobbies: [],
  pets: [],
  health_issues_en: "",
  health_issues_ar: "",
  zodiac_sign_id: null,
  hijab_status: null,
  profile_image: [],
};
