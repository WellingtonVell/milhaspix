"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CombinedFormSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
} from "@/features/announcement/schemas";
import type {
  CombinedFormValues,
  FormValues,
  MultiStepFormContextType,
} from "@/features/announcement/types";

/**
 * Multi-step form context for mile selling announcement
 * Manages form state, validation, navigation, and localStorage persistence
 */
const MultiStepFormContext = createContext<MultiStepFormContextType | null>(
  null,
);

// localStorage key for persisting form data across browser sessions
const STORAGE_KEY = "milhaspix-form-data";

/**
 * Provider component that manages multi-step form state and validation
 * Handles localStorage persistence, step navigation, and form validation
 * @param children - React components that need access to form context
 */
export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  const [formValues, setFormValues] = useState<FormValues>({});
  const [currentStep, setCurrentStep] = useState<number>(1);

  const totalSteps = 4;
  const canGoBack = currentStep > 1;
  const canGoForward = currentStep < totalSteps;

  // React Hook Form configuration with Zod validation
  const methods = useForm<CombinedFormValues>({
    resolver: zodResolver(CombinedFormSchema),
    defaultValues: {
      program: "latam",
      product: "Liminar",
      payoutTiming: "imediato",
      milesOffered: 10000,
      valuePerThousand: 0,
      averagePerPassengerEnabled: false,
      averageMilesPerPassenger: undefined,
      cpf: "",
      login: "",
      password: "",
      phone: "",
    },
    mode: "onChange",
  });

  // Load persisted form data from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.formValues) {
          setFormValues(parsedData.formValues);
          methods.reset(parsedData.formValues as CombinedFormValues);
        }
        if (parsedData.currentStep) {
          setCurrentStep(parsedData.currentStep);
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }
  }, [methods]);

  // Persist form data to localStorage whenever step or form values change
  useEffect(() => {
    try {
      const currentFormValues = methods.getValues();
      const dataToStore = {
        formValues: currentFormValues,
        currentStep,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  }, [currentStep, methods]);

  /**
   * Updates form values state with partial data
   * @param data - Partial form values to merge with existing state
   */
  const updateFormValues = useCallback((data: Partial<FormValues>) => {
    setFormValues((prev) => {
      const newValues = { ...prev, ...data };
      return newValues;
    });
  }, []);

  /**
   * Clears all form data and resets to initial state
   * Removes persisted data from localStorage and resets form to defaults
   */
  const clearForm = useCallback(() => {
    setFormValues({});
    setCurrentStep(1);
    methods.reset();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing form data from localStorage:", error);
    }
  }, [methods]);

  /**
   * Validates entire form using combined schema
   * @returns Object with validation result and error messages
   */
  const validateForm = useCallback(() => {
    try {
      CombinedFormSchema.parse(formValues);
      return { isValid: true, errors: {} };
    } catch (error: unknown) {
      const errors: Record<string, string> = {};
      if (error && typeof error === "object" && "errors" in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>;
        };
        zodError.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path.join(".")] = err.message;
          }
        });
      }
      return { isValid: false, errors };
    }
  }, [formValues]);

  /**
   * Validates specific step using appropriate schema
   * @param step - Step number to validate (1-4)
   * @returns true if step data is valid, false otherwise
   */
  const validateStep = useCallback(
    (step: number) => {
      const currentFormValues = methods.getValues();

      switch (step) {
        case 1:
          return Step1Schema.safeParse(currentFormValues).success;
        case 2:
          return Step2Schema.safeParse(currentFormValues).success;
        case 3:
          return Step3Schema.safeParse(currentFormValues).success;
        case 4:
          return true;
        default:
          return false;
      }
    },
    [methods],
  );

  /**
   * Checks if a step is valid for navigation
   * Previous steps are always valid, current/next steps require validation
   * @param step - Step number to check
   * @returns true if step can be navigated to
   */
  const isStepValid = useCallback(
    (step: number) => {
      if (step < currentStep) {
        return true;
      }

      return validateStep(step);
    },
    [currentStep, validateStep],
  );

  /**
   * Advances to next step if current step is valid
   * Only allows progression when current step passes validation
   */
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, validateStep]);

  /**
   * Goes back to previous step
   * Always allows going back to completed steps
   */
  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * Navigates to specific step with validation checks
   * Allows going back to any previous step or forward only if current step is valid
   * @param step - Target step number (1-4)
   */
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        if (step <= currentStep) {
          setCurrentStep(step);
          return;
        }

        if (step === currentStep + 1 && validateStep(currentStep)) {
          setCurrentStep(step);
        }
      }
    },
    [currentStep, validateStep],
  );

  return (
    <FormProvider {...methods}>
      <MultiStepFormContext.Provider
        value={{
          formValues,
          updateFormValues,
          currentStep,
          setCurrentStep,
          totalSteps,
          canGoBack,
          canGoForward,
          clearForm,
          validateForm,
          validateStep,
          isStepValid,
          nextStep,
          previousStep,
          goToStep,
        }}
      >
        {children}
      </MultiStepFormContext.Provider>
    </FormProvider>
  );
}

/**
 * Hook to access multi-step form context
 * @returns Form context with state and navigation methods
 * @throws {Error} When used outside of MultiStepFormProvider
 */
export function useMultiStepForm() {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) {
    throw new Error(
      "useMultiStepForm must be used within MultiStepFormProvider",
    );
  }
  return ctx;
}
