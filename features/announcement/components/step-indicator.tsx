"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMultiStepForm } from "@/features/announcement/ctx";
import type { StepProps } from "@/features/announcement/types";
import { cn } from "@/lib/utils";

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
}: StepProps) {
  return (
    <Card
      className={cn(
        "bg-transparent border-0 rounded-lg p-0 shadow-none cursor-pointer transition-colors hover:bg-neutral-50",
        isActive && "bg-neutral-100",
      )}
      onClick={onClick}
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
                stepNumber <= currentStep ? "bg-[#1E90FF]" : "bg-[#F0F0F0]",
              )}
            ></div>
          )}

          {/* Step Circle */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isActive
                ? "bg-white border border-[#1E90FF] shadow-[0_0_0_3.83px_rgba(30,144,255,0.25)]"
                : isCompleted
                  ? "border border-[#1E90FF] bg-[#1E90FF]"
                  : "bg-white border border-[#F0F0F0]",
            )}
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                isActive
                  ? "bg-[#1E90FF]"
                  : isCompleted
                    ? "bg-background"
                    : "bg-[#F0F0F0]",
              )}
            ></div>
          </div>

          {/* Bottom Line */}
          {!isLast && (
            <div
              className={cn(
                "w-0.5 h-8",
                stepNumber < currentStep ? "bg-[#1E90FF]" : "bg-[#F0F0F0]",
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
                ? "text-[#475569]"
                : isCompleted
                  ? "text-[#475569]"
                  : "text-neutral-300",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-xs mt-0.5 leading-[1.6] font-['DM_Sans']",
              isActive
                ? "text-[#475569]"
                : isCompleted
                  ? "text-[#475569]"
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

export function StepIndicator() {
  const { currentStep, setCurrentStep } = useMultiStepForm();
  const steps = [
    {
      stepNumber: 1,
      title: "Passo 1",
      description: "Escolha a companhia aérea",
      isFirst: true,
    },
    {
      stepNumber: 2,
      title: "Passo 2",
      description: "Oferte suas milhas",
    },
    {
      stepNumber: 3,
      title: "Passo 3",
      description: "Insira os dados do programa",
    },
    {
      stepNumber: 4,
      title: "Passo 4",
      description: "Pedido finalizado",
      isLast: true,
    },
  ];

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or the next step
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="w-full max-w-xs">
      {steps.map((step) => (
        <StepItem
          key={step.stepNumber}
          {...step}
          isActive={currentStep === step.stepNumber}
          isCompleted={currentStep > step.stepNumber}
          currentStep={currentStep}
          onClick={() => handleStepClick(step.stepNumber)}
        />
      ))}
    </div>
  );
}
