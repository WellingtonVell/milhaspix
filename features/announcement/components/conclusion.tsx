"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/features/announcement/ctx";

/**
 * Final step: Order completion confirmation
 * Shows success message and provides navigation back to main page
 * Clears form data when user navigates away
 */
export function Conclusion() {
  const { clearForm } = useMultiStepForm();

  /**
   * Handles navigation to offers page and clears form data
   * Ensures clean state for next user session
   */
  const handleViewOffers = () => {
    clearForm();
  };

  return (
    <div className="flex items-center justify-center gap-4 my-auto lg:my-0 lg:mt-20 2xl:mt-0 2xl:min-h-[443px] 2xl:border 2xl:rounded-lg 2xl:border-border/50 2xl:shadow">
      <div className="p-4 flex flex-col items-center text-center gap-4">
        <div className="w-[60px] h-[61px] relative">
          <Image
            src="/images/success-icon.png"
            alt="Success"
            width={60}
            height={61}
            className="object-cover"
          />
        </div>

        <h1 className="text-primary text-xl font-medium leading-[1.4em] text-center">
          Ordem de venda criada com sucesso!
        </h1>

        <p className="text-sidebar-foreground text-sm font-medium leading-[2em] text-center max-w-md">
          Agora é só aguardar — assim que suas milhas forem vendidas, o valor
          será transferido direto para sua conta via Pix.
        </p>

        <div className="hidden lg:flex gap-3">
          <Button className="rounded-full h-10 min-w-[196px]" asChild>
            <Link href="/" onClick={handleViewOffers}>
              Ver minhas ofertas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
