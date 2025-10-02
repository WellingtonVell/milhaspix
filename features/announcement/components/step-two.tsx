"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsDown,
  Plane,
} from "lucide-react";
import { useReducer } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useRankingData } from "@/features/announcement/api/queries";
import {
  VALUE_PER_THOUSAND_MAX,
  VALUE_PER_THOUSAND_MIN,
} from "@/features/announcement/constants";
import { useMultiStepForm } from "@/features/announcement/ctx";
import { Step2Schema } from "@/features/announcement/schemas";
import type {
  CombinedFormValues,
  RankingItem,
} from "@/features/announcement/types";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

// Brazilian currency formatter for price display
const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Step 2: Mile offering and pricing configuration
 * Handles complex pricing validation, ranking data, and optional passenger averages
 * Features real-time validation feedback and competitive ranking display
 */
export function StepTwo() {
  const {
    getValues,
    setError,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CombinedFormValues>();

  const { nextStep, previousStep, canGoBack } = useMultiStepForm();

  const valuePerThousand = watch("valuePerThousand");
  const milesOffered = watch("milesOffered");

  // Debounce the valuePerThousand to prevent excessive API calls
  const debounced = useDebounce(valuePerThousand);
  const { data: rankingData = [], error: rankingError } = useRankingData(
    Number(debounced) || undefined,
  );

  /**
   * Calculates recommended average miles per passenger based on offering
   * Uses business logic with adjustment factor for higher-value offers
   * @returns Recommended average miles per passenger
   */
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

  const initialCurrencyValue = watch("valuePerThousand")
    ? moneyFormatter.format(Number(watch("valuePerThousand")))
    : "";

  // Currency input formatter that converts raw input to Brazilian currency format
  const [displayValue, setDisplayValue] = useReducer(
    (_: string, next: string) => {
      const digits = next.replace(/\D/g, "");
      if (!digits) return "";
      return moneyFormatter.format(Number(digits) / 100);
    },
    initialCurrencyValue,
  );

  /**
   * Validates step 2 form data and progresses to next step
   * Handles complex validation including conditional passenger average requirements
   */
  const handleStepSubmit = async () => {
    const values = getValues();

    const result = Step2Schema.safeParse(values);

    if (!result.success) {
      result.error.issues.forEach((error) => {
        setError(error.path[0] as keyof CombinedFormValues, {
          type: "manual",
          message: error.message,
        });
      });
      return;
    }

    nextStep();
  };

  return (
    <div className="flex flex-col md:flex-row space-y-0 md:space-y-6 lg:space-y-8 gap-0 md:gap-8">
      <div className="space-y-6 lg:space-y-8 md:mx-auto lg:mx-0">
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
              {errors.valuePerThousand && (
                <p className="text-sm text-destructive font-medium">
                  Escolha entre {moneyFormatter.format(VALUE_PER_THOUSAND_MIN)}{" "}
                  e {moneyFormatter.format(VALUE_PER_THOUSAND_MAX)}
                </p>
              )}
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            <FormField
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
                          data-testid={`payout-${opt.value}`}
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

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <FormField
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
                    <FormItem className="relative mb-2 md:mb-0">
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
                            data-testid="miles-offered"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <Plane className="w-5 h-5 text-primary" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 left-0 right-0" />
                    </FormItem>
                  );
                }}
              />

              <FormField
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
                    <FormItem className="relative mb-2 md:mb-0">
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
                            data-testid="value-per-thousand"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {hasValue ? (
                              isValid ? (
                                <Check className="w-4 h-4 text-green-500 transition-all duration-300 rotate-0 scale-100" />
                              ) : (
                                <ChevronsDown
                                  className={`w-4 h-4 transition-all duration-300 ${
                                    isAboveMax
                                      ? "text-destructive rotate-0"
                                      : isBelowMin
                                        ? "text-destructive rotate-180"
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

            <FormField
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
                            setValue("averageMilesPerPassenger", undefined);
                          }
                        }}
                        className="h-6 w-11 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[calc(99%)]"
                      />
                    </FormControl>
                    <FormLabel className="text-muted-foreground font-medium text-base leading-tight">
                      Definir média de milhas por passageiro
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watch("averagePerPassengerEnabled") && (
              <FormField
                name="averageMilesPerPassenger"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Média de milhas por passageiro</FormLabel>
                    <FormControl>
                      <div className="grid sm:grid-cols-2 gap-2">
                        <Input
                          type="tel"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value) || undefined)
                          }
                          className="rounded-full w-full !h-12"
                          placeholder="Ex: 5000"
                          maxLength={10}
                        />
                        <div className="hidden sm:flex flex-row gap-2 items-center justify-center bg-success/10 rounded-full">
                          <p className="text-center text-success">
                            Melhor média para a sua oferta:{" "}
                            <span className="font-semibold">
                              {bestAverage.toLocaleString("pt-BR")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </FormControl>

                    {!errors.averageMilesPerPassenger && (
                      <FormDescription className="sm:hidden text-success">
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

            <div className="space-y-2">
              {errors.valuePerThousand && (
                <p className="text-sm text-destructive font-medium flex 2xl:hidden">
                  Escolha entre {moneyFormatter.format(VALUE_PER_THOUSAND_MIN)}{" "}
                  e {moneyFormatter.format(VALUE_PER_THOUSAND_MAX)}
                </p>
              )}

              <RankingBadges rankingData={rankingData} error={rankingError} />
            </div>
          </CardContent>
        </Card>

        <MilhasCard
          accordion={false}
          className="hidden md:flex 2xl:hidden"
          rankingData={rankingData}
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
            onClick={previousStep}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <Button
            onClick={handleStepSubmit}
            className="rounded-full has-[>svg]:px-[27px] h-10 min-w-[142px]"
            data-step2-submit
            data-testid="step2-next"
          >
            Prosseguir
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <MilhasCard
        accordion={true}
        className="md:hidden 2xl:flex"
        rankingData={rankingData}
        error={rankingError}
      />
    </div>
  );
}

/**
 * Mile information card with ranking data and estimated value
 * @param accordion - Whether to show accordion interface (mobile only)
 * @param rankingData - Competitive ranking data from API
 * @param error - Error state for ranking data fetch
 */
function MilhasCard({
  accordion,
  className,
  rankingData,
  error,
}: {
  accordion: boolean;
  className?: string;
  rankingData: RankingItem[];
  error: Error | null;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
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
                  <p className="text-xs leading-relaxed text-secondary-foreground">
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
        <RankingCard rankingData={rankingData} error={error} />
      </div>

      <Separator className="w-full hidden 2xl:block" />

      <EstimatedValue />
    </div>
  );
}

/**
 * Displays estimated value calculation based on miles offered and price per thousand
 * Shows different layouts for mobile (bottom fixed) and desktop (inline)
 */
function EstimatedValue() {
  const { watch } = useFormContext<CombinedFormValues>();
  const milesOffered = Number(watch("milesOffered")) || 0;
  const valuePerThousand = Number(watch("valuePerThousand")) || 0;
  const estimatedValue = (milesOffered / 1000) * valuePerThousand;

  return (
    <div>
      <div className="lg:block flex-col gap-2 hidden">
        <Label className="text-lg font-medium">Receba até:</Label>
        <Card className="py-4 flex flex-row items-center justify-between bg-success/10 text-success text-lg font-medium">
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
        <Card className="p-4 flex flex-row items-center justify-between bg-success/10 text-success text-lg font-medium rounded-none rounded-t-2xl">
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

/**
 * Mile card text content for desktop view
 * Provides instructions for advanced passenger average options
 */
function MilhasCardText() {
  return (
    <div className="flex-col gap-2 hidden md:flex">
      <div className="flex flex-row gap-2 items-center justify-between">
        <h3 className="text-foreground font-medium text-base mb-2 leading-tight">
          Média de milhas
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-secondary-foreground">
        Ao vender mais de 20.000 milhas, ative as Opções Avançadas para definir
        a média de milhas por emissão.
      </p>
    </div>
  );
}

/**
 * Displays competitive ranking as horizontal badges (mobile view)
 * Shows user's position relative to competitors with visual indicators
 * @param rankingData - API data with competitor pricing
 * @param error - Error state for ranking data fetch
 */
function RankingBadges({
  rankingData,
  error,
}: {
  rankingData: RankingItem[];
  error: Error | null;
}) {
  const { watch } = useFormContext<CombinedFormValues>();
  const currentValue = Number(watch("valuePerThousand")) || 0;
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

  if (error) {
    return (
      <div className="flex flex-wrap gap-1 2xl:hidden">
        <div className="text-sm text-destructive">
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

/**
 * Displays competitive ranking as vertical list (desktop view)
 * Shows detailed competitor information with user's position highlighted
 * @param rankingData - API data with competitor pricing
 * @param error - Error state for ranking data fetch
 */
function RankingCard({
  rankingData,
  error,
}: {
  rankingData: RankingItem[];
  error: Error | null;
}) {
  const { watch } = useFormContext<CombinedFormValues>();
  // Get current user value from form
  const currentValue = Number(watch("valuePerThousand")) || 0;

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

  if (error) {
    return (
      <Card className="border-border rounded-lg py-0 hidden 2xl:block">
        <CardContent className="p-4">
          <div className="text-center text-destructive">
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
                  !isLast ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-sm font-medium ${
                      isUser ? "text-success" : "text-primary"
                    }`}
                  >
                    {position}º
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      isUser
                        ? "text-success font-bold"
                        : "text-sidebar-foreground"
                    }`}
                  >
                    R$ {formatValue(Number(value))}
                  </span>
                </div>
                {isUser && (
                  <div className="text-success-foreground rounded-full px-2 py-1">
                    <span className="text-success text-sm font-medium">
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
