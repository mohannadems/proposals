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
  origin_id: Yup.number().nullable().required("Please select your origin "),

  // Physical Attributes
  height: Yup.number().nullable().required("Please select your Height "),

  weight: Yup.number().nullable().required("Please select your Weight "),

  // hair_color_id: Yup.number()
  //   .nullable()
  //   .when("gender", {
  //     is: "f",
  //     then: (schema) => schema.nullable(), // Optional for males
  //     otherwise: (schema) => schema.required("Please select your hair color"),
  //   }),
  skin_color_id: Yup.number()
    .nullable()
    .required("Please select your skin color"),
  eye_color_id: Yup.number()
    .nullable()
    .required("Please select your eye color"),

  // Education and Work
  educational_level_id: Yup.number()
    .nullable()
    .required("Please select your Educational level"),
  specialization_id: Yup.number()
    .nullable()
    .required("Please select your Specialication "),
  employment_status: Yup.boolean()
    .nullable()
    .required("Please select your employment status"),
  job_title_id: Yup.number()
    .nullable()
    .when("employment_status", {
      is: true,
      then: (schema) => schema.required("Job title is required when employed"),
      otherwise: (schema) => schema.nullable(),
    }),
  position_level_id: Yup.number()
    .nullable()
    .when("employment_status", {
      is: true,
      then: (schema) =>
        schema.required("Position level is required when employed"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Financial and Housing
  financial_status_id: createNumberValidation("financial status"),
  housing_status_id: Yup.number()
    .nullable()
    .required("Please select your Marital Status"),

  car_ownership: Yup.boolean()
    .nullable()
    .required("Please select your car ownership status"),
  marriage_budget_id: Yup.number()
    .nullable()
    .when("gender", {
      is: (value) => value !== "female",
      then: (schema) => schema.required("Please select your marriage budget"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Marital and Family
  marital_status_id: Yup.number()
    .nullable()
    .required("Please select your Marital Status"),
  number_of_children: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .required("Please select your Number of Children")
    .test(
      "is-valid-option",
      "Please select a valid option for Number of Children",
      (value) => value === null || [1, 2, 3, 4, 5].includes(value)
    ),

  // Religious and Cultural
  religion_id: createNumberValidation("religion"),
  religiosity_level_id: createNumberValidation("religiosity level"),

  // Lifestyle
  sleep_habit_id: Yup.number()
    .nullable()
    .required("Please select your sleep habites"),
  sports_activity_id: Yup.number()
    .nullable()
    .required("Please select a sports activity"),
  social_media_presence_id: Yup.number()
    .nullable()
    .required("Please select your Social Media presence"),
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
    .transform((value, originalValue) => {
      // If "none" is selected or no value, return empty array
      if (!originalValue || originalValue.includes("none")) {
        return [];
      }
      // Convert selected values to integers
      return originalValue.map((id) =>
        typeof id === "string" ? parseInt(id) : id
      );
    })
    .of(Yup.number().integer()),

  pets: Yup.array()
    .transform((value, originalValue) => {
      // If "none" is selected or no value, return empty array
      if (!originalValue || originalValue.includes("none")) {
        return [];
      }
      // Convert selected values to integers
      return originalValue.map((id) =>
        typeof id === "string" ? parseInt(id) : id
      );
    })
    .of(Yup.number().integer()),

  health_issues_en: Yup.string().max(
    500,
    "Health issues description cannot exceed 500 characters"
  ),

  health_issues_ar: Yup.string().max(
    500,
    "Health issues description cannot exceed 500 characters"
  ),

  zodiac_sign_id: Yup.number()
    .nullable()
    .required("Please select your Zodiac sign"),

  // Female-specific fields
  hijab_status: Yup.mixed().when("gender", {
    is: "female",
    then: (schema) =>
      schema
        .oneOf([0, 1], "Please select a hijab status")
        .required("Hijab status is required for females"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const stepFields = {
  1: ["bio_en", "bio_ar", "gender", "date_of_birth", "guardian_contact"],
  2: [
    "nationality_id", //
    "country_of_residence_id", //
    "city_id", ///
    "origin_id", //
    "hijab_status", //
    "height", //
    "weight", //
    "hair_color_id", //
    "eye_color_id",
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
    "zodiac_sign_id",
    "social_media_presence_id",
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
  eye_color_id: null,
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
  number_of_children: null,
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

export const initialFormState = {
  bio_en: "",
  bio_ar: "",
  gender: "",
  date_of_birth: "",
  height: null,
  weight: null,
  nationality_id: null,
  country_of_residence_id: null,
  city_id: null,
  educational_level_id: null,
  specialization_id: null,
  employment_status: null,
  eye_color: null,
  smoking_status: null,
  smoking_tools: [],
  drinking_status_id: null,
  sports_activity_id: null,
  religion_id: null,
  marital_status_id: null,
  number_of_children: null,
  housing_status_id: null,
  hobbies: [],
  pets: [],
  health_issues_en: "",
  health_issues_ar: "",
  guardian_contact: "",
  financial_status_id: null,
  hijab_status: null,
  profile_image: [],
};
