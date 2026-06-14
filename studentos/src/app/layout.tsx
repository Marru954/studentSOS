import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
import { AppNav } from "@/components/AppNav";
import { FirstRunGate } from "@/components/onboarding/FirstRunGate";
import { RevealManager } from "@/components/RevealManager";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { StoreProvider } from "@/components/StoreProvider";
import { ToastHost } from "@/components/primitives/Toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "StudentOS", template: "%s — StudentOS" },
  description:
    "Sistema operativo per la vita universitaria: orari, appelli, libretto, note e focus in un unico strumento.",
  appleWebApp: { capable: true, title: "StudentOS", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

// Apply the saved theme before first paint to avoid a flash. Dark is default.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('studentos-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col pb-[68px] sm:pb-0">
        {/* drifting aurora behind the glass UI */}
        <div className="atmosphere" aria-hidden="true">
          <div className="aurora a1" />
          <div className="aurora a2" />
          <div className="aurora a3" />
        </div>
        {/* film grain over the aurora so the glass reads premium, not flat */}
        <div className="grain" aria-hidden="true" />
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-signal focus:px-3 focus:py-2 focus:text-label focus:font-semibold focus:text-white"
        >
          Salta al contenuto
        </a>
        <StoreProvider>
          <AppNav />
          {children}
          <AppFooter />
          <FirstRunGate />
        </StoreProvider>
        <ToastHost />
        <RevealManager />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
