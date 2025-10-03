"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
export const STORAGE_KEY = "milhaspix-form-data";

/**
 * Provider component that manages multi-step form state and validation
 * Handles localStorage persistence, step navigation, and form validation
 * @param children - React components that need access to form context
 */
export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const isClearingRef = useRef<boolean>(false);

  // React Hook Form configuration with Zod validation
  const methods = useForm<CombinedFormValues>({
    resolver: zodResolver(CombinedFormSchema),
    defaultValues: {
      program: "latam",
      product: "Liminar",
      cpfAvailability: "ilimitado",
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

  // Calculate derived values during rendering instead of using Effects
  const totalSteps = 4;
  const isSubmitted = methods.formState.isSubmitSuccessful;
  const formValues = methods.getValues();

  // Memoize navigation state to prevent unnecessary recalculations
  const navigationState = useMemo(
    () => ({
      canGoBack: currentStep > 1 && currentStep < 4 && !isSubmitted,
      canGoForward: currentStep < totalSteps,
    }),
    [currentStep, isSubmitted],
  );

  // Load persisted form data from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.formValues) {
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

  // Persist form data to localStorage when step or form values change
  // Skip persistence when clearing form to prevent race conditions
  useEffect(() => {
    if (isClearingRef.current) {
      return;
    }

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

  // Sync ref with state for immediate access
  useEffect(() => {
    isClearingRef.current = isClearing;
  }, [isClearing]);

  /**
   * Clears all form data and resets to initial state
   * Removes persisted data from localStorage and resets form to defaults
   * Uses ref to prevent race conditions with persistence effect
   */
  const clearForm = useCallback(() => {
    isClearingRef.current = true;
    setIsClearing(true);
    setCurrentStep(4);
    methods.reset();

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing form data from localStorage:", error);
    }

    // Reset clearing flag after a short delay to allow persistence effect to complete
    setTimeout(() => {
      isClearingRef.current = false;
      setIsClearing(false);
    }, 100);
  }, [methods]);

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
   * Prevents going back after successful form submission or when on final step
   */
  const previousStep = useCallback(() => {
    if (currentStep > 1 && currentStep < 4 && !isSubmitted) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, isSubmitted]);

  /**
   * Navigates to specific step with validation checks
   * Prevents going back after successful form submission or when on final step
   * @param step - Target step number (1-4)
   */
  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        // Prevent going back after successful submission or when on final step
        if (step < currentStep && (isSubmitted || currentStep === 4)) {
          return;
        }

        if (step <= currentStep) {
          setCurrentStep(step);
          return;
        }

        if (step === currentStep + 1 && validateStep(currentStep)) {
          setCurrentStep(step);
        }
      }
    },
    [currentStep, validateStep, isSubmitted],
  );

  return (
    <FormProvider {...methods}>
      <MultiStepFormContext.Provider
        value={{
          formValues,
          currentStep,
          setCurrentStep,
          totalSteps,
          canGoBack: navigationState.canGoBack,
          canGoForward: navigationState.canGoForward,
          clearForm,
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
