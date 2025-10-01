"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { Step1Schema } from "@/features/announcement/schemas";
import type { Step1Values } from "@/features/announcement/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import LoadIcon from "@/public/loadicon";

export function StepOne() {
  const {
    currentStep,
    updateFormValues,
    setCurrentStep,
    formValues,
    canGoBack,
  } = useMultiStepForm();

  const isMobile = useIsMobile();

  const form = useForm<Step1Values>({
    resolver: zodResolver(Step1Schema),
    defaultValues: {
      program: (formValues.program as Step1Values["program"]) || "latam",
      product: (formValues.product as string) || "Liminar",
    },
    mode: "onSubmit",
  });

  const onSubmit = (values: Step1Values) => {
    updateFormValues(values);
    setCurrentStep(2);
  };

  const program = form.watch("program");
  const product = form.watch("product");

  useEffect(() => {
    if (program) {
      const valuesToSave = { program, product };
      updateFormValues(valuesToSave);
    }
  }, [program, product, updateFormValues]);

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

  return (
    <div className="flex flex-col md:flex-row space-y-0 md:space-y-6 lg:space-y-8 gap-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 lg:space-y-8 md:mx-auto lg:mx-0"
        >
          <Card className="border-border rounded-lg pt-0 lg:max-w-[640px] md:min-w-[640px] pb-0 mb-4 gap-3">
            <div className="flex items-center gap-2 border-b border-border px-4 py-[11.5px] md:py-[15.5]">
              <span className="text-primary font-medium text-lg w-7 h-7 flex items-center justify-center">
                01.
              </span>
              <h2 className="text-foreground font-medium text-base sm:text-lg leading-tight">
                Escolha o programa{" "}
                <span className="hidden md:inline">de fidelidade</span>
              </h2>
            </div>

            {/* Program Selection */}
            <CardContent className="p-4 pb-0 md:pb-3 pt-0">
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {isMobile ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="rounded-[44px] border-[#E2E2E2] w-full !h-12">
                            <div className="flex items-center w-full px-2 gap-4">
                              <LoadIcon className="w-5 h-5 text-[#1E90FF] flex-shrink-0" />

                              <span className="flex-1 text-start">
                                {field.value && Companies[field.value] ? (
                                  <span className="text-[#2E3D50] font-medium text-sm">
                                    {Companies[field.value].name}
                                  </span>
                                ) : (
                                  <span className="text-[#2E3D50] font-medium text-sm">
                                    Selecione o programa
                                  </span>
                                )}
                              </span>

                              {field.value && Companies[field.value] ? (
                                <Image
                                  src={Companies[field.value].src}
                                  alt={Companies[field.value].alt}
                                  width={
                                    Companies[field.value].name ===
                                    "Airportugal"
                                      ? 100
                                      : Companies[field.value].name === "LATAM"
                                        ? 80
                                        : Companies[field.value].name ===
                                            "Tudo Azul"
                                          ? 65
                                          : 61
                                  }
                                  height={26}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="w-[43px] h-5" />
                              )}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(Companies).map(([key, company]) => (
                              <SelectItem key={key} value={key}>
                                {/* <span className="flex gap-2"> */}
                                {/* <span className="text-sm font-medium text-[#2E3D50]">
                                    {company.name}
                                  </span> */}
                                <Image
                                  src={company.src}
                                  alt={company.alt}
                                  width={
                                    company.name === "Airportugal"
                                      ? 100
                                      : company.name === "LATAM"
                                        ? 80
                                        : company.name === "Tudo Azul"
                                          ? 65
                                          : 61
                                  }
                                  height={26}
                                  className="object-contain"
                                />
                                {/* </span> */}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="hidden md:grid grid-cols-4 gap-3">
                          {Object.entries(Companies).map(([key, company]) => {
                            const isSelected = field.value === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => field.onChange(key)}
                                className={cn(
                                  `rounded-full border border-[#E2E2E2] px-4 py-2.5 flex items-center justify-center transition-colors`,
                                  isSelected
                                    ? "border-[#1E90FF] bg-blue-50"
                                    : "hover:bg-gray-50",
                                )}
                              >
                                <Image
                                  src={company.src}
                                  alt={company.alt}
                                  width={
                                    company.name === "Airportugal"
                                      ? 200
                                      : company.name === "LATAM"
                                        ? 80
                                        : company.name === "Tudo Azul"
                                          ? 65
                                          : 61
                                  }
                                  height={26}
                                  className="object-contain"
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            {/* Product and CPF info */}
            <CardContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-foreground font-medium text-sm sm:text-base leading-tight">
                        Produto
                      </Label>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="rounded-full w-full !h-12">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Liminar">Liminar</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1">
                  <Label className="text-foreground font-medium text-sm sm:text-base leading-tight">
                    CPF's Disponíveis
                  </Label>
                  <div className="bg-muted border border-border rounded-full px-4 py-2.5 flex items-center justify-between h-12">
                    <span className="text-muted-foreground font-medium text-sm">
                      Ilimitado
                    </span>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProgramCard
            accordion={false}
            className="hidden md:flex 2xl:hidden"
          />

          <div className="justify-between hidden lg:flex">
            <Button
              className={cn(
                "rounded-full has-[>svg]:px-[26px] h-10 min-w-[142px]",
                !canGoBack && "invisible",
              )}
              variant="outline"
              disabled={!canGoBack}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button
              type="submit"
              className="rounded-full has-[>svg]:px-[27px] h-10 min-w-[142px]"
            >
              Prosseguir
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </Form>

      <ProgramCard accordion={true} className="md:hidden 2xl:flex" />
    </div>
  );
}

function ProgramCard({
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
                  Selecione o programa
                </h3>
              </AccordionTrigger>
              <AccordionContent className="px-0 pt-2 pb-1">
                <p className="text-xs leading-relaxed text-[#475569]">
                  Escolha de qual programa de fidelidade você quer vender suas
                  milhas. Use apenas contas em seu nome.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <ProgramCardText />
      </CardContent>
    </Card>
  );
}

function ProgramCardText() {
  return (
    <div className="flex-col gap-2 hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h3 className="text-foreground font-medium text-base mb-2 leading-tight">
          Selecione o programa
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-[#475569]">
        Escolha de qual programa de fidelidade você quer vender suas milhas. Use
        apenas contas em seu nome.
      </p>
    </div>
  );
}
