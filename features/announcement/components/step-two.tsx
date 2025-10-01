"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsDown,
  Plane,
} from "lucide-react";
import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  VALUE_PER_THOUSAND_MAX,
  VALUE_PER_THOUSAND_MIN,
} from "@/features/announcement/constants";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { useRankingData } from "@/features/announcement/queries";
import { Step2Schema } from "@/features/announcement/schemas";
import type { Step2Values } from "@/features/announcement/types";
import { cn } from "@/lib/utils";

type Step2FormValues = z.input<typeof Step2Schema>;

interface RankingItem {
  mile_value: number;
  description: string;
  position: number;
}

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function StepTwo() {
  const {
    updateFormValues,
    setCurrentStep,
    formValues,
    canGoBack,
    currentStep,
  } = useMultiStepForm();

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(Step2Schema),
    defaultValues: {
      payoutTiming:
        (formValues.payoutTiming as Step2Values["payoutTiming"]) || "imediato",
      milesOffered: (formValues.milesOffered as number) || 10000,
      valuePerThousand: (formValues.valuePerThousand as number) || undefined,
      averagePerPassengerEnabled:
        (formValues.averagePerPassengerEnabled as boolean) || false,
      averageMilesPerPassenger:
        (formValues.averageMilesPerPassenger as number) || undefined,
    },
    mode: "onChange",
  });

  const valuePerThousand = form.watch("valuePerThousand");
  const milesOffered = form.watch("milesOffered");
  const {
    data: rankingData = [],
    isLoading: isLoadingRanking,
    error: rankingError,
  } = useRankingData(Number(valuePerThousand) || undefined);

  const calculateBestAverage = () => {
    const miles = Number(milesOffered) || 0;
    const value = Number(valuePerThousand) || 0;

    if (!miles || !value) return 0;

    const basePassengerCount = 3; // Assumption of 3 passengers
    const adjustmentFactor = value > 20 ? 1.2 : 1.0;
    const bestAverage = Math.round(
      (miles / basePassengerCount) * adjustmentFactor,
    );

    return bestAverage;
  };

  const bestAverage = calculateBestAverage();

  const initialCurrencyValue = form.watch("valuePerThousand")
    ? moneyFormatter.format(Number(form.watch("valuePerThousand")))
    : "";

  const [displayValue, setDisplayValue] = useReducer(
    (_: string, next: string) => {
      const digits = next.replace(/\D/g, "");
      if (!digits) return "";
      return moneyFormatter.format(Number(digits) / 100);
    },
    initialCurrencyValue,
  );

  const onSubmit = (values: Step2FormValues) => {
    try {
      const parsed: Step2Values = Step2Schema.parse(values);
      updateFormValues(parsed);
      setCurrentStep(3);
    } catch (error) {
      console.error("Step 2 - Validation error:", error);
    }
  };

  const payoutTiming = form.watch("payoutTiming");
  const averagePerPassengerEnabled = form.watch("averagePerPassengerEnabled");
  const averageMilesPerPassenger = form.watch("averageMilesPerPassenger");

  useEffect(() => {
    const hasValues = milesOffered || valuePerThousand;
    if (hasValues) {
      const valuesToSave = {
        milesOffered,
        valuePerThousand,
        payoutTiming,
        averagePerPassengerEnabled,
        averageMilesPerPassenger,
      };
      updateFormValues(valuesToSave);
    }
  }, [
    milesOffered,
    valuePerThousand,
    payoutTiming,
    averagePerPassengerEnabled,
    averageMilesPerPassenger,
    updateFormValues,
  ]);

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
                  02.
                </span>
                <h2 className="text-foreground font-medium text-base sm:text-lg leading-tight">
                  Oferte suas milhas
                </h2>
              </div>
              <div className="hidden 2xl:flex">
                {form.formState.errors.valuePerThousand && (
                  <p className="text-sm text-red-500 font-medium">
                    Escolha entre{" "}
                    {moneyFormatter.format(VALUE_PER_THOUSAND_MIN)} e{" "}
                    {moneyFormatter.format(VALUE_PER_THOUSAND_MAX)}
                  </p>
                )}
              </div>
            </div>

            <CardContent className="p-4 space-y-4">
              <FormField
                control={form.control}
                name="payoutTiming"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quero receber</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: "Imediato", value: "imediato" },
                          { label: "em 2 dias", value: "2dias" },
                          { label: "em 7 dias", value: "7dias" },
                          { label: "Depois do voo", value: "posVoo" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={cn(
                              `rounded-full border px-4 py-2 text-sm min-h-[44px] ${
                                field.value === opt.value
                                  ? "border-primary text-foreground"
                                  : "border-muted text-foreground"
                              }`,
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="milesOffered"
                  render={({ field }) => {
                    const formatNumber = (value: unknown) => {
                      if (!value) return "";
                      const num =
                        typeof value === "string"
                          ? parseFloat(value)
                          : Number(value);
                      if (Number.isNaN(num)) return "";
                      return num.toLocaleString("pt-BR");
                    };

                    const parseNumber = (value: string) => {
                      const cleaned = value.replace(/\./g, "");
                      const num = parseFloat(cleaned);
                      return Number.isNaN(num) ? 0 : num;
                    };

                    return (
                      <FormItem>
                        <FormLabel>Milhas ofertadas</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              inputMode="numeric"
                              value={formatNumber(field.value)}
                              onChange={(e) => {
                                const parsed = parseNumber(e.target.value);
                                field.onChange(parsed);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="rounded-full w-full !h-[44px] pr-12 text-start font-mono"
                              placeholder="10.000"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <Plane className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="valuePerThousand"
                  render={({ field }) => {
                    const handleChange = (
                      e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      const formattedValue = e.target.value;
                      setDisplayValue(formattedValue);

                      const digits = formattedValue.replace(/\D/g, "");
                      const realValue = Number(digits) / 100;
                      field.onChange(realValue || "");
                    };

                    const currentValue = Number(field.value) || 0;
                    const isValid =
                      currentValue >= VALUE_PER_THOUSAND_MIN &&
                      currentValue <= VALUE_PER_THOUSAND_MAX;
                    const isAboveMax = currentValue > VALUE_PER_THOUSAND_MAX;
                    const isBelowMin =
                      currentValue > 0 && currentValue < VALUE_PER_THOUSAND_MIN;
                    const hasValue = currentValue > 0;

                    return (
                      <FormItem>
                        <FormLabel>Valor a cada 1.000 milhas (R$)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={displayValue}
                              onChange={handleChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="rounded-full w-full !h-[44px] pr-12 text-start font-mono"
                              placeholder="R$ 25,00"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              {hasValue ? (
                                isValid ? (
                                  <Check className="w-4 h-4 text-green-500 transition-all duration-300 rotate-0 scale-100" />
                                ) : (
                                  <ChevronsDown
                                    className={`w-4 h-4 transition-all duration-300 ${
                                      isAboveMax
                                        ? "text-red-500 rotate-0"
                                        : isBelowMin
                                          ? "text-red-500 rotate-180"
                                          : "text-muted-foreground rotate-0"
                                    }`}
                                  />
                                )
                              ) : null}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Average Per Passenger Switch */}
              <FormField
                control={form.control}
                name="averagePerPassengerEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Switch
                          checked={field.value || false}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue(
                                "averageMilesPerPassenger",
                                undefined,
                              );
                            }
                          }}
                          className="h-6 w-11 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[calc(99%)]"
                        />
                      </FormControl>
                      <FormLabel className="text-[#8F8F8F] font-medium text-base leading-tight">
                        Definir média de milhas por passageiro
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Average Miles Per Passenger Input - Only show when switch is enabled */}
              {form.watch("averagePerPassengerEnabled") && (
                <FormField
                  control={form.control}
                  name="averageMilesPerPassenger"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Média de milhas por passageiro</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || 0)
                          }
                          className="rounded-full w-full !h-12"
                          placeholder="Ex: 5000"
                        />
                      </FormControl>

                      {!form.formState.errors.averageMilesPerPassenger && (
                        <FormDescription className="text-[#12A19A]">
                          Melhor média para a sua oferta:{" "}
                          <span className="font-semibold">
                            {bestAverage.toLocaleString("pt-BR")}
                          </span>
                        </FormDescription>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Ranking Badges Section */}
              <div className="space-y-2">
                {form.formState.errors.valuePerThousand && (
                  <p className="text-sm text-red-500 font-medium flex 2xl:hidden">
                    Escolha entre{" "}
                    {moneyFormatter.format(VALUE_PER_THOUSAND_MIN)} e{" "}
                    {moneyFormatter.format(VALUE_PER_THOUSAND_MAX)}
                  </p>
                )}

                <RankingBadges
                  form={form}
                  rankingData={rankingData}
                  isLoadingRanking={isLoadingRanking}
                  error={rankingError}
                />
              </div>
            </CardContent>
          </Card>

          <MilhasCard
            accordion={false}
            className="hidden md:flex 2xl:hidden"
            form={form}
            rankingData={rankingData}
            isLoadingRanking={isLoadingRanking}
            error={rankingError}
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

      <MilhasCard
        accordion={true}
        className="md:hidden 2xl:flex"
        form={form}
        rankingData={rankingData}
        isLoadingRanking={isLoadingRanking}
        error={rankingError}
      />
    </div>
  );
}

function MilhasCard({
  accordion,
  className,
  form,
  rankingData,
  isLoadingRanking,
  error,
}: {
  accordion: boolean;
  className?: string;
  form: ReturnType<typeof useForm<Step2FormValues>>;
  rankingData: RankingItem[];
  isLoadingRanking: boolean;
  error: Error | null;
}) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
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
                    Média de milhas
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="px-0 pt-2 pb-1">
                  <p className="text-xs leading-relaxed text-[#475569]">
                    Ao vender mais de 20.000 milhas, ative as Opções Avançadas
                    para definir a média de milhas por emissão.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <MilhasCardText />
        </CardContent>
      </Card>

      <div className="hidden 2xl:flex flex-col gap-2">
        <Label>Ranking das ofertas</Label>
        <RankingCard
          form={form}
          rankingData={rankingData}
          isLoadingRanking={isLoadingRanking}
          error={error}
        />
      </div>

      <Separator className="w-full hidden 2xl:block" />

      <EstimatedValue form={form} />
    </div>
  );
}

function EstimatedValue({
  form,
}: {
  form: ReturnType<typeof useForm<Step2FormValues>>;
}) {
  const milesOffered = Number(form.watch("milesOffered")) || 0;
  const valuePerThousand = Number(form.watch("valuePerThousand")) || 0;
  const estimatedValue = (milesOffered / 1000) * valuePerThousand;

  return (
    <div>
      <div className="lg:block flex-col gap-2 hidden">
        <Label className="text-lg font-medium">Receba até:</Label>
        <Card className="py-4 flex flex-row items-center justify-between bg-[#12A19A1A] text-[#12A19A] text-lg font-medium">
          <CardContent>R$</CardContent>
          <CardContent>
            {estimatedValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-2 lg:hidden absolute bottom-0 left-0 right-0">
        <Card className="p-4 flex flex-row items-center justify-between bg-[#12A19A1A] text-[#12A19A] text-lg font-medium rounded-none rounded-t-2xl">
          <CardTitle>Receba até</CardTitle>
          <CardTitle>
            R${" "}
            {estimatedValue.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </CardTitle>
        </Card>
      </div>
    </div>
  );
}

function MilhasCardText() {
  return (
    <div className="flex-col gap-2 hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h3 className="text-foreground font-medium text-base mb-2 leading-tight">
          Média de milhas
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-[#475569]">
        Ao vender mais de 20.000 milhas, ative as Opções Avançadas para definir
        a média de milhas por emissão.
      </p>
    </div>
  );
}

function RankingBadges({
  form,
  rankingData,
  isLoadingRanking,
  error,
}: {
  form: ReturnType<typeof useForm<Step2FormValues>>;
  rankingData: RankingItem[];
  isLoadingRanking: boolean;
  error: Error | null;
}) {
  const currentValue = Number(form.watch("valuePerThousand")) || 0;
  const formatValue = (val: number) =>
    val.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Use API data if available, otherwise fallback to static data
  const allValues =
    rankingData.length > 0
      ? rankingData
          .map((item) => item.mile_value)
          .sort((a, b) => Number(a) - Number(b))
      : [15.23, 16.32, 16.44, 16.45, currentValue].sort(
          (a, b) => Number(a) - Number(b),
        );

  if (isLoadingRanking) {
    return (
      <div className="flex flex-wrap gap-1 2xl:hidden">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={`badge-skeleton-${index}-${Math.random()}`}
            className="h-8 w-20 rounded-full"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap gap-1 2xl:hidden">
        <div className="text-sm text-red-500">
          Erro ao carregar ranking. Usando dados estáticos.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 2xl:hidden">
      {allValues.map((value, index) => {
        const position = index + 1;
        const isUser = value === currentValue;

        return (
          <div
            key={`ranking-${position}-${value}-${isUser ? "user" : "competitor"}`}
            className={`flex items-center justify-center px-2 py-1 rounded-full border text-xs font-medium ${
              isUser
                ? "bg-teal-50 border-teal-500 text-teal-600"
                : "bg-white border-gray-200 text-blue-600"
            }`}
          >
            {isUser ? "Você" : ""} {position}º R$ {formatValue(Number(value))}
          </div>
        );
      })}
    </div>
  );
}

function RankingCard({
  form,
  rankingData,
  isLoadingRanking,
  error,
}: {
  form: ReturnType<typeof useForm<Step2FormValues>>;
  rankingData: RankingItem[];
  isLoadingRanking: boolean;
  error: Error | null;
}) {
  // Get current user value from form
  const currentValue = Number(form.watch("valuePerThousand")) || 0;

  // Use API data if available, otherwise fallback to static data
  const allValues =
    rankingData.length > 0
      ? rankingData
          .map((item) => item.mile_value)
          .sort((a, b) => Number(a) - Number(b))
      : [15.23, 16.32, 16.44, 16.45, currentValue].sort(
          (a, b) => Number(a) - Number(b),
        );

  const formatValue = (val: number) =>
    val.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (isLoadingRanking) {
    return (
      <Card className="border-border rounded-lg py-0 hidden 2xl:block">
        <CardContent className="p-0">
          <div className="flex flex-col">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={`skeleton-${index}-${Math.random()}`}
                className={`flex items-center justify-between pl-2 pr-4 py-3 ${
                  index < 4 ? "border-b border-[#E2E2E2]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="w-7 h-7 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                {index === 4 && <Skeleton className="h-6 w-12 rounded-full" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border rounded-lg py-0 hidden 2xl:block">
        <CardContent className="p-4">
          <div className="text-center text-red-500">
            Erro ao carregar ranking. Usando dados estáticos.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border rounded-lg py-0 hidden 2xl:block">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {allValues.map((value, index) => {
            const position = index + 1;
            const isUser = value === currentValue;
            const isLast = index === allValues.length - 1;

            return (
              <div
                key={`ranking-${position}-${value}-${isUser ? "user" : "competitor"}`}
                className={`flex items-center justify-between pl-2 pr-4 py-3 ${
                  !isLast ? "border-b border-[#E2E2E2]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-sm font-medium ${
                      isUser ? "text-[#12A19A]" : "text-[#1E90FF]"
                    }`}
                  >
                    {position}º
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isUser ? "text-[#12A19A] font-bold" : "text-[#2E3D50]"
                    }`}
                  >
                    R$ {formatValue(Number(value))}
                  </span>
                </div>
                {isUser && (
                  <div className="bg-[#12A19A]/10 rounded-full px-2 py-1">
                    <span className="text-[#12A19A] text-sm font-medium">
                      Você
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
