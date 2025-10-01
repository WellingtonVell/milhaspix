"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const {
    currentStep,
    setCurrentStep,
    totalSteps,
    canGoBack,
    canGoForward,
    handleSubmit,
  } = useMultiStepForm();

  const handleNext = () => {
    if (currentStep === 3) {
      handleSubmit();
    } else {
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
          <Link href="/inicio">
            Ver minhas ofertas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
