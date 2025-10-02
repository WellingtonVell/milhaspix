import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useMultiStepForm } from "@/features/announcement/ctx";
import type { CombinedFormValues } from "@/features/announcement/types";
import { queryClient } from "@/providers/query-provider";
import { ANNOUNCEMENT_KEYS } from "./keys";

/**
 * Submits announcement form to the API endpoint
 * @param formData - Complete form data from all steps
 * @returns Promise that resolves with success response
 */
const submitAnnouncementForm = async (
  formData: CombinedFormValues,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch("/api/announcement", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao processar solicitação");
  }

  return data;
};

/**
 * React Query mutation hook for submitting announcement form
 * @returns Mutation object with submit function and loading states
 */
export function useSubmitAnnouncement(onSuccessCallback?: () => void) {
  const { clearForm } = useMultiStepForm();

  const mutation = useMutation({
    mutationFn: submitAnnouncementForm,
    onSuccess: (res) => {
      toast.success(res.message ?? "Anúncio criado com sucesso!", {
        description: "Seu anúncio foi processado e está sendo analisado.",
      });
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.all });

      clearForm();
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error("Erro ao criar anúncio", {
        description: error?.message ?? "Erro ao criar anúncio",
      });
    },
  });

  const onSubmit: SubmitHandler<CombinedFormValues> = async (data, event) => {
    event?.preventDefault();
    mutation.mutate(data);
  };

  return {
    onSubmit,
    ...mutation,
  };
}
