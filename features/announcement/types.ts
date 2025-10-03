import type { z } from "zod";
import type {
  CombinedFormSchema,
  Step1Schema,
  Step2Schema,
  Step3Schema,
} from "@/features/announcement/schemas";

export type Step1Values = z.infer<typeof Step1Schema>;

export type Step2Values = z.infer<typeof Step2Schema>;

export type Step3Values = z.infer<typeof Step3Schema>;

export type CombinedFormValues = z.infer<typeof CombinedFormSchema>;

export type RankingItem = {
  mile_value: number;
  description: string;
  position: number;
};

export type StepProps = {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isLast?: boolean;
  isFirst?: boolean;
  currentStep: number;
  onClick?: () => void;
  isClickable: boolean;
};

export type FormValues = Record<string, unknown>;

export type MultiStepFormContextType = {
  formValues: FormValues;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
  canGoBack: boolean;
  canGoForward: boolean;
  clearForm: () => void;
  validateStep: (step: number) => boolean;
  isStepValid: (step: number) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
};
