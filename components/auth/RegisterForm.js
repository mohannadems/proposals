import React, { useContext } from "react";
import { View } from "react-native";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { registerStyles } from "../../styles/register.styles";
import { LanguageContext } from "../../contexts/LanguageContext";

export const RegisterForm = ({
  form,
  loading,
  onNextStep,
  onPreviousStep,
  onSubmit,
  isRTL,
  t,
}) => {
  const {
    formData,
    validationErrors,
    touched,
    step,
    handleChange,
    handleBlur,
  } = form;

  const languageContext = useContext(LanguageContext);
  const _isRTL =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;
  const _t = t || (languageContext ? languageContext.t : null);

  return (
    <View
      style={[
        registerStyles.formContainer,
        _isRTL && { alignItems: "flex-end" },
      ]}
    >
      {step === 1 ? (
        <StepOne
          formData={formData}
          validationErrors={validationErrors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          onNextStep={onNextStep}
          isRTL={_isRTL}
          t={_t}
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
          isRTL={_isRTL}
          t={_t}
        />
      )}
    </View>
  );
};
