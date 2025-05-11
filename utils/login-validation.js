// login-validation.js
export const validateEmail = (email, t) => {
  if (!email.trim()) {
    return t ? t("validation.email_required") : "Email is required";
  }

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return t
      ? t("validation.email_invalid")
      : "Please enter a valid email address";
  }

  return "";
};

export const validatePassword = (password, t) => {
  if (!password) {
    return t ? t("validation.password_required") : "Password is required";
  }

  if (password.length < 8) {
    return t
      ? t("validation.password_min_length")
      : "Password must be at least 8 characters";
  }

  return "";
};

export const validateLoginCredentials = (credentials, t) => {
  const errors = {};

  const emailError = validateEmail(credentials.email, t);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(credentials.password, t);
  if (passwordError) errors.password = passwordError;

  return errors;
};
