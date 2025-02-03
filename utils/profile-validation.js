import * as Yup from "yup";

export const profileValidationSchema = Yup.object().shape({
  // Step 1 validations
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
  hijab_status: Yup.mixed().when("gender", {
    is: "female",
    then: (schema) =>
      schema
        .oneOf([0, 1], "Please select a hijab status")
        .required("Hijab status is required for females"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Step 2 validations
  height: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a height"),
  weight: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a weight"),
  smoking_status: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a smoking status"),
  smoking_tools: Yup.lazy((smoking_status) => {
    // When smoking_status is greater than 1 (regular or social smoker)
    if (smoking_status > 1) {
      return Yup.array()
        .min(1, "Please select at least one smoking tool")
        .of(Yup.number().positive());
    }
    return Yup.array();
  }),
  drinking_status_id: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a drinking status"),
  sports_activity_id: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a sports activity"),

  // Step 3 validations
  educational_level_id: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select an educational level"),
  employment_status: Yup.boolean().nullable(),
  financial_status_id: Yup.number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Please select a financial status"),
});

// Define validation fields for each step
export const stepFields = {
  1: [
    "bio_en",
    "bio_ar",
    "gender",
    "date_of_birth",
    "guardian_contact",
    "nationality_id",
    "country_of_residence_id",
    "city_id",
  ],
  2: [
    "height",
    "weight",
    "smoking_status",
    "smoking_tools",
    "drinking_status_id",
    "sports_activity_id",
    "hobbies",
    "pets",
    "hair_color_id",
    "skin_color_id",
  ],
  3: [
    "educational_level_id",
    "employment_status",
    "financial_status_id",
    "marital_status_id",
    "religion_id",
    "car_ownership",
    "housing_status_id",
    "number_of_children",
  ],
};

export const initialProfileState = {
  bio_en: "",
  bio_ar: "",
  gender: "",
  date_of_birth: null,
  height: null,
  weight: null,
  nationality_id: null,
  country_of_residence_id: null,
  city_id: null,
  educational_level_id: null,
  specialization_id: null,
  employment_status: null,
  smoking_status: null,
  smoking_tools: [],
  drinking_status_id: null,
  sports_activity_id: null,
  social_media_presence_id: null,
  religion_id: null,
  hair_color_id: null,
  skin_color_id: null,
  marital_status_id: null,
  number_of_children: 0,
  housing_status_id: null,
  hobbies: [],
  pets: [],
  health_issues_en: "",
  health_issues_ar: "",
  zodiac_sign_id: null,
  car_ownership: null,
  guardian_contact: "",
  financial_status_id: null,
  hijab_status: null,
};
