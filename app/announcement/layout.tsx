import { MultiStepFormProvider } from "@/features/announcement/ctx";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MultiStepFormProvider>{children}</MultiStepFormProvider>;
}
