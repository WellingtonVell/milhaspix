"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/features/announcement/components/bottom-navigation";
import { Conclusion } from "@/features/announcement/components/conclusion";
import { StepIndicator } from "@/features/announcement/components/step-indicator";
import { StepOne } from "@/features/announcement/components/step-one";
import { StepThree } from "@/features/announcement/components/step-three";
import { StepTwo } from "@/features/announcement/components/step-two";
import { useMultiStepForm } from "@/features/announcement/ctx";

export default function Home() {
  const { currentStep, totalSteps } = useMultiStepForm();

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="w-full bg-gray-200 h-1">
        <motion.div
          className="h-1 bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full relative">
        <div className="w-full lg:w-auto lg:min-w-64 hidden lg:block">
          <StepIndicator />
        </div>

        <div className="flex-1 flex flex-col">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <StepOne />}
            {currentStep === 2 && <StepTwo />}
            {currentStep === 3 && <StepThree />}
            {currentStep === 4 && <Conclusion />}
          </motion.div>
        </div>
      </div>

      <div className="mt-auto">
        <BottomNavigation />
      </div>
    </div>
  );
}
