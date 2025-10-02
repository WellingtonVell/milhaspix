"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation component for multi-step form
 * Provides back/forward navigation and handles step 3 submission trigger
 * Only visible on mobile devices (lg:hidden)
 */
export function BottomNavigation() {
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    canGoBack,
    canGoForward,
    clearForm,
    isStepValid,
  } = useMultiStepForm();

  /**
   * Handles next button click with special logic for step 3
   * Step 3 requires triggering the form submission button instead of direct navigation
   */
  const handleNext = () => {
    if (!isStepValid(currentStep)) {
      // Trigger step form submission button programmatically
      const stepButton = document.querySelector(
        `[data-testid="step${currentStep}-next"], [data-step${currentStep}-submit]`,
      ) as HTMLButtonElement;
      if (stepButton) {
        stepButton.click();
      }
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="bg-background flex justify-between items-center gap-2 py-4 w-full px-4 lg:hidden border-t">
      <Button
        variant="outline"
        className={cn(
          "flex items-center gap-2 rounded-full bg-background border-border text-foreground font-medium text-sm hover:bg-accent px-6 py-2.5 h-10",
          !canGoBack && "invisible",
          !canGoForward && "invisible",
        )}
        type="button"
        disabled={!canGoBack}
        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden lg:block">Voltar</span>
      </Button>

      {canGoForward && (
        <span className="font-medium text-sm text-muted-foreground select-none">
          <span className="text-primary">{currentStep} </span>
          de {totalSteps}
        </span>
      )}

      {canGoForward ? (
        <Button
          className={cn(
            "flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 px-6 py-2.5 h-10",
            canGoForward && "min-w-[142px]",
            !canGoForward && "min-w-[196px]",
          )}
          onClick={handleNext}
        >
          {currentStep === 3 ? "Concluir" : "Prosseguir"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          className={cn(
            "flex items-center gap-2 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 px-6 py-2.5 h-10",
            canGoForward && "min-w-[142px]",
            !canGoForward && "min-w-[196px]",
          )}
          asChild
        >
          <Link href="/" onClick={clearForm}>
            Ver minhas ofertas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
