import { z } from "zod";
import {
  MILES_OFFERED_MIN,
  VALUE_PER_THOUSAND_MAX,
  VALUE_PER_THOUSAND_MIN,
} from "@/features/announcement/constants";
import { isValidCPF } from "@/features/announcement/fn";

/**
 * Validation schemas for the multi-step mile selling form
 * Each schema validates a specific step with business rules and constraints
 */

/**
 * Validates step 1: Program and product selection
 * Ensures user selects a supported airline program and valid product
 */
export const Step1Schema = z.object({
  program: z
    .enum(["latam", "gol", "azul", "smiles"], {
      error: (issue) =>
        issue.input === undefined
          ? "Selecione um programa"
          : "Programa inválido",
    })
    .refine((v) => !!v, {
      message: "Selecione um programa",
    }),
  product: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Produto é obrigatório"
          : "Produto deve ser um texto",
    })
    .min(1, { message: "Produto é obrigatório" })
    .max(100, { message: "Produto deve ter no máximo 100 caracteres" })
    .trim(),
});

/**
 * Validates step 2: Mile offering and pricing configuration
 * Enforces business rules for pricing ranges and optional passenger averages
 * @throws {ZodError} When pricing is outside allowed range or passenger data is incomplete
 */
export const Step2Schema = z
  .object({
    payoutTiming: z
      .enum(["imediato", "2dias", "7dias", "posVoo"], {
        error: (issue) =>
          issue.input === undefined
            ? "Selecione quando deseja receber"
            : "Opção de pagamento inválida",
      })
      .refine((v) => !!v, {
        message: "Selecione quando deseja receber",
      }),
    milesOffered: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Milhas oferecidas são obrigatórias"
            : "Milhas deve ser um número",
      })
      .min(MILES_OFFERED_MIN, { message: "Mínimo de 1.000 milhas" })
      .max(1000000, { message: "Máximo de 1.000.000 milhas" })
      .int({ message: "Milhas deve ser um número inteiro" }),
    valuePerThousand: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? "Valor por milhar é obrigatório"
            : "Valor deve ser um número",
      })
      .min(VALUE_PER_THOUSAND_MIN, {
        message: `Valor mínimo: R$ ${VALUE_PER_THOUSAND_MIN.toFixed(2)}`,
      })
      .max(VALUE_PER_THOUSAND_MAX, {
        message: `Valor máximo: R$ ${VALUE_PER_THOUSAND_MAX.toFixed(2)}`,
      })
      .multipleOf(0.01, {
        message: "Valor deve ter no máximo 2 casas decimais",
      }),
    averagePerPassengerEnabled: z.boolean().optional(),
    averageMilesPerPassenger: z
      .number({
        error: (issue) =>
          issue.input === undefined
            ? undefined
            : "Média por passageiro deve ser um número",
      })
      .min(1, { message: "Média deve ser pelo menos 1" })
      .max(10000, { message: "Média máxima: 10.000 milhas" })
      .int({ message: "Média deve ser um número inteiro" })
      .optional(),
  })
  .refine(
    (data) =>
      !data.averagePerPassengerEnabled ||
      (typeof data.averageMilesPerPassenger === "number" &&
        data.averageMilesPerPassenger > 0),
    {
      message: "Informe a média por passageiro",
      path: ["averageMilesPerPassenger"],
    },
  );

/**
 * Validates step 3: User account credentials and personal data
 * Performs CPF validation using Brazilian algorithm and enforces security requirements
 * @throws {ZodError} When CPF is invalid or credentials don't meet security standards
 */
export const Step3Schema = z.object({
  cpf: z
    .string()
    .min(1, { message: "CPF é obrigatório" })
    .refine(
      (cpf) => {
        const numbers = cpf.replace(/\D/g, "");
        return numbers.length === 11;
      },
      { message: "CPF deve ter 11 dígitos" },
    )
    .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
  login: z.string().min(1, { message: "Login é obrigatório" }),
  password: z.string().min(4, { message: "Senha deve ter ao menos 4 dígitos" }),
  phone: z.string().min(8, { message: "Telefone é obrigatório" }),
});

/**
 * Combines all step schemas into a single validation schema
 * Used for final form submission and complete data validation
 */
export const CombinedFormSchema = z.object({
  ...Step1Schema.shape,
  ...Step2Schema.shape,
  ...Step3Schema.shape,
});
