import { z } from "zod";
import {
  MILES_OFFERED_MIN,
  VALUE_PER_THOUSAND_MAX,
  VALUE_PER_THOUSAND_MIN,
} from "@/features/announcement/constants";

export const Step1Schema = z.object({
  program: z.enum(["latam", "gol", "azul", "smiles"]).refine((v) => !!v, {
    message: "Selecione um programa",
  }),
  product: z.string().min(1, { message: "Produto é obrigatório" }),
});

export const Step2Schema = z
  .object({
    payoutTiming: z.enum(["imediato", "2dias", "7dias", "posVoo"]),
    milesOffered: z.coerce
      .number()
      .min(MILES_OFFERED_MIN, { message: "Mínimo de 1.000 milhas" }),
    valuePerThousand: z.coerce
      .number()
      .min(VALUE_PER_THOUSAND_MIN, { message: "Valor mínimo: R$ 14,00" })
      .max(VALUE_PER_THOUSAND_MAX, { message: "Valor máximo: R$ 16,56" }),
    averagePerPassengerEnabled: z.boolean().optional(),
    averageMilesPerPassenger: z.coerce.number().optional(),
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

export const Step3Schema = z.object({
  cpf: z.string().min(11, { message: "CPF é obrigatório" }),
  login: z.string().min(1, { message: "Login é obrigatório" }),
  password: z.string().min(4, { message: "Senha deve ter ao menos 4 dígitos" }),
  phone: z.string().min(8, { message: "Telefone é obrigatório" }),
});
