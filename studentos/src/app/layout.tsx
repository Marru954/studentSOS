import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppNav } from "@/components/AppNav";
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";
import { StoreProvider } from "@/components/StoreProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "StudentOS", template: "%s — StudentOS" },
  description:
    "Sistema operativo per la vita universitaria: orari, appelli, libretto, note e focus in un unico strumento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-signal focus:px-3 focus:py-2 focus:text-label focus:font-semibold focus:text-white"
        >
          Salta al contenuto
        </a>
        <StoreProvider>
          <AppNav />
          {children}
          <OnboardingDialog />
        </StoreProvider>
      </body>
    </html>
  );
}
