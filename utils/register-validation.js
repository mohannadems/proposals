/**
 * Validates form fields with specific rules
 * @param {string} field - The name of the field to validate
 * @param {string} value - The value of the field
 * @param {object} formData - The entire form data object (for password confirmation)
 * @returns {string} - Error message or empty string if valid
 */
export const validateField = (field, value, formData = {}) => {
  // Ensure value is a string and remove undefined/null cases
  const processedValue = value ? String(value) : "";

  switch (field) {
    case "first_name":
    case "last_name":
      if (!processedValue.trim())
        return `${field === "first_name" ? "First" : "Last"} name is required`;
      if (processedValue.trim().length < 2)
        return `${
          field === "first_name" ? "First" : "Last"
        } name must be at least 2 characters`;
      if (!/^[a-zA-Z\s]*$/.test(processedValue))
        return `${
          field === "first_name" ? "First" : "Last"
        } name can only contain letters and spaces`;
      return "";

    case "email":
      if (!processedValue.trim()) return "Email is required";
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(processedValue))
        return "Please enter a valid email address";
      return "";

    case "phone_number":
      if (!processedValue.trim()) return "Phone number is required";
      // Remove non-digit characters for validation
      const cleanedPhone = processedValue.replace(/\D/g, "");
      if (!/^[0-9]{10}$/.test(cleanedPhone))
        return "Please enter a valid 10-digit phone number";
      return "";

    case "password":
      if (!processedValue) return "Password is required";
      if (processedValue.length < 8)
        return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(processedValue))
        return "Password must contain at least one uppercase letter";
      if (!/[a-z]/.test(processedValue))
        return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(processedValue))
        return "Password must contain at least one number";
      return "";

    case "password_confirmation":
      if (!processedValue) return "Please confirm your password";
      if (processedValue !== formData.password) return "Passwords do not match";
      return "";

    case "gender":
      if (!processedValue) return "Please select your gender";
      return "";

    default:
      return "";
  }
};

/**
 * Validates an entire form step
 * @param {number} stepNumber - The current step of the form
 * @param {object} formData - The current form data
 * @returns {object} - Validation results with errors and overall validity
 */
export const validateFormStep = (stepNumber, formData) => {
  const fieldsToValidate =
    stepNumber === 1
      ? ["first_name", "last_name", "email", "phone_number"]
      : ["gender", "password", "password_confirmation"];

  const newErrors = {};
  let isValid = true;

  fieldsToValidate.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    newErrors[field] = error;
    if (error) isValid = false;
  });

  return {
    errors: newErrors,
    isValid,
  };
};
