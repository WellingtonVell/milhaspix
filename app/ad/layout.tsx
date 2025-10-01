import { MultiStepFormProvider } from "@/features/announcement/ctx";

export default function AdLayout({ children }: { children: React.ReactNode }) {
  return <MultiStepFormProvider>{children}</MultiStepFormProvider>;
}
