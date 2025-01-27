import * as Yup from "yup";

// Basic validation schemas
export const emailSchema = Yup.string()
  .email("Please enter a valid email address")
  .required("Email is required")
  .matches(
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    "Please enter a valid email address"
  );

export const passwordSchema = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  )
  .required("Password is required");

export const phoneSchema = Yup.string()
  .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
  .required("Phone number is required");

// Form validation schemas
export const loginValidationSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string().required("Password is required"),
});

export const registrationValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Name is required"),
  email: emailSchema,
  phone_number: phoneSchema,
  password: passwordSchema,
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Please select a valid gender")
    .required("Gender is required"),
});

// Helper validation functions
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password should contain at least one special character (!@#$%^&*)"
    );
  }

  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneNumber) return "Phone number is required";
  if (!phoneRegex.test(phoneNumber))
    return "Please enter a valid 10-digit phone number";
  return "";
};

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]*$/.test(name))
    return "Name can only contain letters and spaces";
  return "";
};

// Form error messages
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid 10-digit phone number",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_OTP: "Please enter a valid 6-digit OTP",
  INVALID_NAME: "Name can only contain letters and spaces",
  GENDER_REQUIRED: "Please select your gender",
};

// Password strength calculator
export const getPasswordStrength = (password) => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;

  return {
    score: strength,
    isStrong: strength >= 4,
    isModerate: strength >= 3,
    isWeak: strength < 3,
    feedback: getPasswordFeedback(strength),
  };
};

const getPasswordFeedback = (strength) => {
  switch (strength) {
    case 0:
    case 1:
      return "Very weak - Please add uppercase, numbers, and special characters";
    case 2:
      return "Weak - Try adding special characters and numbers";
    case 3:
      return "Moderate - Good, but could be stronger";
    case 4:
      return "Strong - Great password!";
    case 5:
      return "Very strong - Excellent password!";
    default:
      return "";
  }
};

// Real-time validation helpers
export const validateFormField = (field, value, compareValue = "") => {
  switch (field) {
    case "email":
      return validateEmail(value);
    case "password":
      return validatePassword(value);
    case "password_confirmation":
      return value !== compareValue ? ERROR_MESSAGES.PASSWORD_MISMATCH : "";
    case "phone_number":
      return validatePhoneNumber(value);
    case "name":
      return validateName(value);
    case "gender":
      return !value ? ERROR_MESSAGES.GENDER_REQUIRED : "";
    default:
      return "";
  }
};
