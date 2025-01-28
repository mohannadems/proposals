/**
 * Validates email address
 * @param {string} email - Email address to validate
 * @returns {string} Error message or empty string if valid
 */
export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) return "Please enter a valid email address";

  return "";
};

/**
 * Validates password
 * @param {string} password - Password to validate
 * @returns {string} Error message or empty string if valid
 */
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";

  return "";
};

/**
 * Validates login credentials
 * @param {Object} credentials - Object containing email and password
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Object} Validation errors object
 */
export const validateLoginCredentials = (credentials) => {
  const errors = {};

  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
