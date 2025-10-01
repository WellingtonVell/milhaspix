"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Lock, UserCircle } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { Step3Schema } from "@/features/announcement/schemas";
import type { Step3Values } from "@/features/announcement/types";
import { cn } from "@/lib/utils";
import Zap from "@/public/zap";

export function StepThree() {
  const {
    updateFormValues,
    setCurrentStep,
    formValues,
    canGoBack,
    currentStep,
    registerSubmitHandler,
  } = useMultiStepForm();

  // Company data for displaying the correct logo
  const Companies = {
    azul: {
      src: "/images/tudo-azul.png",
      alt: "AZUL",
      name: "Tudo Azul",
    },
    smiles: {
      src: "/images/smiles.png",
      alt: "SMILES",
      name: "SMILES",
    },
    latam: {
      src: "/images/latam.png",
      alt: "LATAM",
      name: "LATAM",
    },
    gol: {
      src: "/images/airportugal.png",
      alt: "Airportugal",
      name: "Airportugal",
    },
  };

  // Get the selected company from form values
  const selectedCompany =
    (formValues.program as keyof typeof Companies) || "latam";
  const companyInfo = Companies[selectedCompany] || Companies.latam;

  const form = useForm<Step3Values>({
    resolver: zodResolver(Step3Schema),
    defaultValues: {
      cpf: (formValues.cpf as string) || "",
      login: (formValues.login as string) || "",
      password: (formValues.password as string) || "",
      phone: (formValues.phone as string) || "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (values: Step3Values) => {
      updateFormValues(values);
      alert("Dados salvos com sucesso! Redirecionando para a conclusão...");
      setCurrentStep(4);
    },
    [updateFormValues, setCurrentStep],
  );

  const handleFormSubmit = useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);
  registerSubmitHandler(handleFormSubmit);

  const cpf = form.watch("cpf");
  const login = form.watch("login");
  const password = form.watch("password");
  const phone = form.watch("phone");

  useEffect(() => {
    const hasValues = cpf || login || password || phone;
    if (hasValues) {
      const valuesToSave = { cpf, login, password, phone };
      updateFormValues(valuesToSave);
    }
  }, [cpf, login, password, phone, updateFormValues]);

  return (
    <div className="flex flex-col md:flex-row space-y-0 md:space-y-6 lg:space-y-8 gap-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:space-y-8 md:mx-auto lg:mx-0"
        >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CPF Field - Top Left */}
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2E3D50] font-medium text-lg leading-tight">
                        CPF do Titular
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            inputMode="numeric"
                            placeholder="431.140.231-12"
                            className="rounded-[44px] w-full h-12 pl-4 pr-12 border-[#E2E2E2] focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                            {...field}
                          />
                          <UserCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1E90FF]" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Login Field - Top Right */}
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2E3D50] font-medium text-lg leading-tight">
                        Login de acesso
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1283124124"
                          className="rounded-[44px] w-full h-12 px-4 border-[#E2E2E2] focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field - Bottom Left */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2E3D50] font-medium text-lg leading-tight">
                        Senha de acesso
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="1877"
                            className="rounded-[44px] w-full h-12 pl-4 pr-12 border-[#E2E2E2] focus:border-[#1E90FF] focus:ring-1 focus:ring-[#1E90FF]"
                            {...field}
                          />
                          <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1E90FF]" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FIXME: Value with country code when go back to step 3 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#2E3D50] font-medium text-lg leading-tight">
                        Telefone para autenticação
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PhoneInput
                            {...field}
                            defaultCountry="BR"
                            placeholder="(19) 98277-3123"
                            className="flex items-center rounded-[44px] border border-[#E2E2E2] focus-within:border-[#1E90FF] focus-within:ring-1 focus-within:ring-[#1E90FF] h-12 overflow-hidden"
                          />
                          <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 pointer-events-none" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <AccountCard
            accordion={false}
            className="hidden md:flex 2xl:hidden"
          />

          <EstimatedValueDisplay
            variant="desktop"
            formValues={formValues}
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
              onClick={() => setCurrentStep(currentStep - 1)}
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
              type="submit"
              className="rounded-full has-[>svg]:px-[27px] h-10 min-w-[142px]"
            >
              Concluir
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex flex-col gap-8">
        <AccountCard
          accordion={true}
          className="md:hidden 2xl:flex min-w-[248px]"
        />
        <EstimatedValueDisplay
          variant="desktop"
          formValues={formValues}
          className="hidden lg:hidden 2xl:flex"
        />
      </div>
      <EstimatedValueDisplay formValues={formValues} variant="mobile" />
    </div>
  );
}

function EstimatedValueDisplay({
  formValues,
  variant = "mobile",
  className,
}: {
  formValues: Record<string, unknown>;
  variant?: "mobile" | "desktop";
  className?: string;
}) {
  const milesOffered = Number(formValues.milesOffered) || 0;
  const valuePerThousand = Number(formValues.valuePerThousand) || 0;

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
        <Card className="p-4 flex flex-row items-center justify-between bg-[#12A19A1A] text-[#12A19A] text-lg font-medium rounded-none rounded-t-2xl">
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
      <Card className="p-4 flex flex-row items-center justify-between bg-[#12A19A1A] text-[#12A19A] text-lg font-medium rounded-lg">
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
                <p className="text-xs leading-relaxed text-[#475569]">
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

function AccountCardText() {
  return (
    <div className="flex-col gap-2 hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h3 className="text-foreground font-medium text-base mb-2 leading-tight">
          Dados da conta
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-[#475569]">
        Por favor, insira os dados da conta que deseja cadastrar e verifique se
        estão corretos.
      </p>
    </div>
  );
}
