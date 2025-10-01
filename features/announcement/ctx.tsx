"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type FormValues = Record<string, unknown>;

type MultiStepFormContextType = {
  formValues: FormValues;
  updateFormValues: (data: Partial<FormValues>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  handleSubmit: () => void;
  registerSubmitHandler: (fn: () => void) => void;
};

const MultiStepFormContext = createContext<MultiStepFormContextType | null>(
  null,
);

export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  const [formValues, setFormValues] = useState<FormValues>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  const submitHandlerRef = useRef<(() => void) | null>(null);

  const totalSteps = 4;
  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < totalSteps;

  const updateFormValues = useCallback((data: Partial<FormValues>) => {
    setFormValues((prev) => {
      const newValues = { ...prev, ...data };
      return newValues;
    });
  }, []);

  const registerSubmitHandler = useCallback((fn: () => void) => {
    submitHandlerRef.current = fn;
  }, []);

  const handleSubmit = useCallback(() => {
    if (submitHandlerRef.current) {
      submitHandlerRef.current();
    } else {
      console.warn("Submit handler not registered");
    }
  }, []);

  return (
    <MultiStepFormContext.Provider
      value={{
        formValues,
        updateFormValues,
        currentStep,
        setCurrentStep,
        totalSteps,
        canGoBack,
        canGoForward,

        handleSubmit,
        registerSubmitHandler,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
}

export function useMultiStepForm() {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) {
    throw new Error(
      "useMultiStepForm must be used within MultiStepFormProvider",
    );
  }
  return ctx;
}
