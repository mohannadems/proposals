import { useState } from "react";
import { validateField, validateFormStep } from "../utils/register-validation";
import {
  INITIAL_FORM_DATA,
  INITIAL_TOUCHED_STATE,
} from "../constants/register";

export const useRegisterForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState(INITIAL_TOUCHED_STATE);
  const [step, setStep] = useState(1);
  const [apiErrors, setApiErrors] = useState({});

  const setFieldsTouched = (fields) => {
    setTouched((prev) => ({
      ...prev,
      ...fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    }));
  };

  const handleChange = (field, value) => {
    let processedValue = value;

    // Handle phone number formatting
    if (field === "phone_number") {
      // Remove all spaces and non-numeric characters
      processedValue = value.replace(/\s+/g, "").replace(/[^\d]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (touched[field]) {
      const error = validateField(field, processedValue, formData);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    if (apiErrors[field]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (touched[field]) {
      const error = validateField(field, value, formData);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    if (apiErrors[field]) {
      setApiErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field], formData);
    if (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const setValidationErrorsWithAPI = (errors) => {
    setApiErrors(errors);

    setValidationErrors((prev) => ({
      ...prev,
      ...errors,
    }));

    const errorFields = Object.keys(errors);
    setFieldsTouched(errorFields);
  };

  const goToStep = (targetStep) => {
    setStep(targetStep);

    const targetStepFields =
      targetStep === 1
        ? ["first_name", "last_name", "email", "phone_number"]
        : ["gender", "password", "password_confirmation"];

    // Preserve API errors for the current step
    const relevantApiErrors = Object.entries(apiErrors)
      .filter(([field]) => targetStepFields.includes(field))
      .reduce((acc, [field, error]) => ({ ...acc, [field]: error }), {});

    setValidationErrors((prev) => ({
      ...prev,
      ...relevantApiErrors,
    }));

    // Mark fields with API errors as touched
    setTouched((prev) => ({
      ...prev,
      ...targetStepFields.reduce(
        (acc, field) => ({
          ...acc,
          [field]: !!relevantApiErrors[field] || prev[field],
        }),
        {}
      ),
    }));
  };

  const validateStep = (currentStep) => {
    const stepValidation = validateFormStep(currentStep, formData);
    const stepFields =
      currentStep === 1
        ? ["first_name", "last_name", "email", "phone_number"]
        : ["gender", "password", "password_confirmation"];

    setTouched((prev) => ({
      ...prev,
      ...stepFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
    }));

    setValidationErrors((prev) => ({
      ...prev,
      ...stepValidation.errors,
      ...apiErrors,
    }));

    return (
      stepValidation.isValid && !stepFields.some((field) => apiErrors[field])
    );
  };

  const nextStep = () => {
    if (validateStep(1)) {
      setStep(2);
      return true;
    }
    return false;
  };

  const previousStep = () => {
    goToStep(1);
  };

  return {
    formData,
    validationErrors,
    touched,
    step,
    handleChange,
    handleBlur,
    nextStep,
    previousStep,
    validateStep,
    setValidationErrorsWithAPI,
    goToStep,
    setFieldsTouched,
  };
};
