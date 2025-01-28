import React from "react";
import { View } from "react-native";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { registerStyles } from "../../styles/register.styles";

export const RegisterForm = ({
  form,
  loading,
  onNextStep,
  onPreviousStep,
  onSubmit,
}) => {
  const {
    formData,
    validationErrors,
    touched,
    step,
    handleChange,
    handleBlur,
  } = form;

  return (
    <View style={registerStyles.formContainer}>
      {step === 1 ? (
        <StepOne
          formData={formData}
          validationErrors={validationErrors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          onNextStep={onNextStep}
        />
      ) : (
        <StepTwo
          formData={formData}
          validationErrors={validationErrors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          onPreviousStep={onPreviousStep}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}
    </View>
  );
};
