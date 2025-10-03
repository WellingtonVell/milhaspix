import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DM_Mono, DM_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/providers/query-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable}`}>
        <QueryProvider>
          <NuqsAdapter>
            {children}
            <Toaster richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
