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

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const error = validateField(field, value, formData);
      setValidationErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const error = validateField(field, formData[field], formData);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
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
    }));

    return stepValidation.isValid;
  };

  const nextStep = () => {
    if (validateStep(1)) {
      setStep(2);
      return true;
    }
    return false;
  };

  const previousStep = () => {
    setStep(1);
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
    setValidationErrors,
  };
};
