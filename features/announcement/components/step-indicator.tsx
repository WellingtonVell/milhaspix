"use client";

import { Card, CardContent } from "@/components/ui/card";
import { steps } from "@/features/announcement/constants";
import { useMultiStepForm } from "@/features/announcement/ctx";
import type { StepProps } from "@/features/announcement/types";
import { cn } from "@/lib/utils";

/**
 * Individual step item component with visual state indicators
 * Shows completion status, active state, and clickable navigation
 * @param isClickable - Whether step can be clicked for navigation
 * @param onClick - Handler for step click navigation
 */
function StepItem({
  stepNumber,
  title,
  description,
  isActive,
  isCompleted,
  isLast,
  isFirst,
  currentStep,
  onClick,
  isClickable,
}: StepProps) {
  return (
    <Card
      className={cn(
        "bg-transparent border-0 rounded-lg p-0 shadow-none transition-colors",
        isClickable && "cursor-pointer hover:bg-neutral-50",
        !isClickable && "cursor-not-allowed opacity-60",
        isActive && "bg-neutral-100",
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <CardContent
        className={cn(
          "flex items-center p-4",
          !isLast && "py-0",
          isFirst && "pb-0 pt-4 mt-2",
          isLast && "pt-0 mb-2",
        )}
      >
        {/* Step Circle and Lines */}
        <div className="flex flex-col items-center pl-4">
          {/* Top Line */}
          {stepNumber > 1 && (
            <div
              className={cn(
                "w-0.5 h-8",
                stepNumber <= currentStep ? "bg-primary" : "bg-neutral-200",
              )}
            ></div>
          )}

          {/* Step Circle */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isActive
                ? "bg-background border border-primary shadow-[0_0_0_3.83px_rgba(30,144,255,0.25)]"
                : isCompleted
                  ? "border border-primary bg-primary"
                  : "bg-background border border-neutral-200",
            )}
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                isActive
                  ? "bg-primary"
                  : isCompleted
                    ? "bg-neutral-200"
                    : "bg-neutral-200",
              )}
            ></div>
          </div>

          {/* Bottom Line */}
          {!isLast && (
            <div
              className={cn(
                "w-0.5 h-8",
                stepNumber < currentStep ? "bg-primary" : "bg-neutral-200",
              )}
            ></div>
          )}
        </div>

        {/* Step Text */}
        <div className={cn("flex-1 pl-4", isFirst && "mb-5", isLast && "mt-6")}>
          <h3
            className={cn(
              "font-medium text-base leading-none font-['DM_Sans']",
              isActive
                ? "text-secondary-foreground"
                : isCompleted
                  ? "text-secondary-foreground"
                  : "text-neutral-300",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm mt-0.5 leading-[1.6] font-['DM_Sans']",
              isActive
                ? "text-secondary-foreground"
                : isCompleted
                  ? "text-secondary-foreground"
                  : "text-neutral-300",
            )}
          >
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Step indicator component for multi-step form navigation
 * Renders clickable step items with validation-based navigation logic
 * Only allows forward navigation when current step is valid
 */
export function StepIndicator() {
  const { currentStep, setCurrentStep, isStepValid, canGoBack } =
    useMultiStepForm();

  /**
   * Handles step click navigation with validation checks
   * Prevents going back after successful form submission
   * @param stepNumber - Target step number to navigate to
   */
  const handleStepClick = (stepNumber: number) => {
    // Prevent going back after successful submission
    if (stepNumber < currentStep && !canGoBack) {
      return;
    }

    if (stepNumber < currentStep) {
      setCurrentStep(stepNumber);
      return;
    }

    if (stepNumber === currentStep + 1 && isStepValid(currentStep)) {
      setCurrentStep(stepNumber);
      return;
    }

    if (stepNumber === currentStep) {
      return;
    }
  };

  return (
    <div className="w-full max-w-xs">
      {steps.map((step) => {
        const isClickable =
          (step.stepNumber < currentStep && canGoBack) ||
          (step.stepNumber === currentStep + 1 && isStepValid(currentStep)) ||
          step.stepNumber === currentStep;

        return (
          <StepItem
            key={step.stepNumber}
            {...step}
            isActive={currentStep === step.stepNumber}
            isCompleted={currentStep > step.stepNumber}
            currentStep={currentStep}
            onClick={() => handleStepClick(step.stepNumber)}
            isClickable={isClickable}
          />
        );
      })}
    </div>
  );
}
