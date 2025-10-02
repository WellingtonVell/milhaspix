"use client";

import {
  ArrowLeft,
  ArrowRight,
  Loader2Icon,
  Lock,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useSubmitAnnouncement } from "@/features/announcement/api/mutations";
import { Companies } from "@/features/announcement/constants";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { formatCPF } from "@/features/announcement/fn";
import type { CombinedFormValues } from "@/features/announcement/types";
import { cn } from "@/lib/utils";
import Zap from "@/public/zap";

/**
 * Step 3: User account credentials and personal data collection
 * Handles CPF validation, account login/password, and phone number input
 * Features real-time CPF formatting and success notification on completion
 */
export function StepThree() {
  const { watch, handleSubmit } = useFormContext<CombinedFormValues>();

  const { previousStep, canGoBack } = useMultiStepForm();
  const { onSubmit, isPending } = useSubmitAnnouncement();

  const program = watch("program");
  const selectedCompany = (program as keyof typeof Companies) || "latam";
  const companyInfo = Companies[selectedCompany] || Companies.latam;

  /**
   * Validates step 3 form data and submits the complete form
   * Uses React Hook Form's handleSubmit to properly trigger submission state
   */
  const handleStepSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return (
    <div className="flex flex-col md:flex-row space-y-0 md:space-y-6 lg:space-y-8 gap-0 md:gap-8">
      <div className="space-y-6 lg:space-y-8 md:mx-auto lg:mx-0">
        <Card className="border-border rounded-lg pt-0 lg:max-w-[640px] md:min-w-[640px] pb-0 mb-4 gap-3">
          <div className="flex items-center gap-2 justify-between border-b border-border px-4 py-[11.5px] md:py-[15.5]">
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium text-lg w-7 h-7 flex items-center justify-center">
                03.
              </span>
              <h2 className="flex md:hidden text-foreground font-medium text-base sm:text-lg leading-tight">
                Dados do programa
              </h2>
              <h2 className="hidden md:flex text-foreground font-medium text-base sm:text-lg leading-tight">
                Insira os dados do programa de fidelidade
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src={companyInfo.src}
                alt={companyInfo.alt}
                width={120}
                height={32}
                className="object-contain"
              />
            </div>
          </div>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6 mb-2">
              <FormField
                name="cpf"
                render={({ field }) => (
                  <FormItem className="relative mb-2 md:mb-0">
                    <FormLabel className="text-sidebar-foreground font-medium text-lg leading-tight">
                      CPF do Titular
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          inputMode="numeric"
                          placeholder="431.140.231-12"
                          className="rounded-[44px] w-full h-12 pl-4 pr-12 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          value={field.value || ""}
                          onChange={(e) => {
                            const formattedValue = formatCPF(e.target.value);
                            field.onChange(formattedValue);
                          }}
                          maxLength={14}
                          data-testid="cpf-input"
                        />
                        <UserCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 right-0" />
                  </FormItem>
                )}
              />

              <FormField
                name="login"
                render={({ field }) => (
                  <FormItem className="relative mb-2 md:mb-0">
                    <FormLabel className="text-sidebar-foreground font-medium text-lg leading-tight">
                      Login de acesso
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1283124124"
                        className="rounded-[44px] w-full h-12 px-4 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                        data-testid="login-input"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 right-0" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem className="relative mb-2 md:mb-0">
                    <FormLabel className="text-sidebar-foreground font-medium text-lg leading-tight">
                      Senha de acesso
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="1877"
                          className="rounded-[44px] w-full h-12 pl-4 pr-12 border-border focus:border-primary focus:ring-1 focus:ring-primary"
                          data-testid="password-input"
                          {...field}
                        />
                        <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 right-0" />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                render={({ field }) => (
                  <FormItem className="relative mb-2 md:mb-0">
                    <FormLabel className="text-sidebar-foreground font-medium text-lg leading-tight">
                      Telefone para autenticação
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <PhoneInput
                          {...field}
                          value={field.value || ""}
                          defaultCountry="BR"
                          placeholder="(19) 98277-3123"
                          className="flex items-center rounded-[44px] border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary h-12 overflow-hidden"
                          data-testid="phone-input"
                          limitMaxLength
                        />
                        <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-5 left-0 right-0" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <AccountCard accordion={false} className="hidden md:flex 2xl:hidden" />

        <EstimatedValueDisplay
          variant="desktop"
          className="hidden 2xl:hidden"
        />

        <div className="justify-between hidden lg:flex">
          <Button
            variant="outline"
            className={cn(
              "rounded-full has-[>svg]:px-[26px] h-10 min-w-[112px]",
              !canGoBack && "invisible",
            )}
            disabled={!canGoBack}
            onClick={previousStep}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <p className="text-sm text-muted-foreground text-center w-full">
            Ao prosseguir, você estará concordando com os
            <br />
            <a href="/terms" className="text-primary">
              Termos de uso
            </a>
          </p>

          <Button
            onClick={handleStepSubmit}
            className="rounded-full has-[>svg]:px-[27px] h-10 min-w-[142px]"
            data-step3-submit
            data-testid="step3-submit"
            disabled={isPending}
          >
            {isPending ? "Enviando..." : "Concluir"}
            {isPending ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <AccountCard
          accordion={true}
          className="md:hidden 2xl:flex min-w-[248px]"
        />
        <EstimatedValueDisplay
          variant="desktop"
          className="hidden lg:hidden 2xl:flex"
        />
      </div>
      <EstimatedValueDisplay variant="mobile" />
    </div>
  );
}

/**
 * Displays estimated value with different layouts for mobile and desktop
 * Shows calculation based on miles offered and price per thousand
 * @param variant - Layout variant (mobile shows bottom fixed, desktop shows inline)
 * @param className - Additional CSS classes
 */
function EstimatedValueDisplay({
  variant = "mobile",
  className,
}: {
  variant?: "mobile" | "desktop";
  className?: string;
}) {
  const { watch } = useFormContext<CombinedFormValues>();
  const milesOffered = Number(watch("milesOffered")) || 0;
  const valuePerThousand = Number(watch("valuePerThousand")) || 0;

  const estimatedValue = (milesOffered / 1000) * valuePerThousand;

  const hasValidData = milesOffered > 0 && valuePerThousand > 0;

  return variant === "mobile" ? (
    <div className="flex flex-col gap-8">
      <div
        className={cn(
          "flex flex-col gap-2 lg:hidden absolute bottom-0 left-0 right-0",
          className,
        )}
      >
        <Card className="p-4 flex flex-row items-center justify-between bg-success/10 text-success text-lg font-medium rounded-none rounded-t-2xl">
          <CardTitle>Receba até</CardTitle>
          <CardTitle>
            {hasValidData ? (
              `R$ ${estimatedValue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            ) : (
              <span className="text-gray-400">Complete o passo 2</span>
            )}
          </CardTitle>
        </Card>
      </div>
    </div>
  ) : (
    <div className={cn("flex-col gap-2 lg:flex hidden", className)}>
      <Card className="p-4 flex flex-row items-center justify-between bg-success/10 text-success text-lg font-medium rounded-lg">
        <CardTitle>Receba até</CardTitle>
        <CardTitle>
          {hasValidData ? (
            `R$ ${estimatedValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          ) : (
            <span className="text-gray-400">Complete o passo 2</span>
          )}
        </CardTitle>
      </Card>
    </div>
  );
}

/**
 * Account information card with optional accordion for mobile
 * @param accordion - Whether to show accordion interface (mobile only)
 * @param className - Additional CSS classes
 */
function AccountCard({
  accordion,
  className,
}: {
  accordion: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("border-border rounded-lg p-2 h-fit", className)}>
      <CardContent className="p-3">
        {accordion && (
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="flex md:hidden"
          >
            <AccordionItem value="item-1" className="border-0 w-full">
              <AccordionTrigger className="flex flex-row gap-2 items-center justify-between px-0 py-0 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                <h3 className="text-foreground font-medium text-base leading-tight">
                  Dados da conta
                </h3>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-2 pb-1">
                <p className="text-xs leading-relaxed text-secondary-foreground">
                  Por favor, insira os dados da conta que deseja cadastrar e
                  verifique se estão corretos.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <AccountCardText />
      </CardContent>
    </Card>
  );
}

/**
 * Account card text content for desktop view
 * Provides instructions for account data entry
 */
function AccountCardText() {
  return (
    <div className="flex-col gap-2 hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h3 className="text-foreground font-medium text-base mb-2 leading-tight">
          Dados da conta
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-secondary-foreground">
        Por favor, insira os dados da conta que deseja cadastrar e verifique se
        estão corretos.
      </p>
    </div>
  );
}
