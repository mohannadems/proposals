import { useState } from "react";
import { validateLoginCredentials } from "../utils/login-validation";

export const useLoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const errors = validateLoginCredentials({
        ...credentials,
        [field]: value,
      });
      setValidationErrors((prev) => ({
        ...prev,
        [field]: errors[field] || "",
        general: "", // Clear general error when user types
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const errors = validateLoginCredentials(credentials);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: errors[field] || "",
    }));
  };

  const validateForm = () => {
    const errors = validateLoginCredentials(credentials);
    setValidationErrors(errors);
    setTouched({
      email: true,
      password: true,
    });
    return Object.keys(errors).length === 0;
  };

  return {
    credentials,
    validationErrors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setValidationErrors,
  };
};
