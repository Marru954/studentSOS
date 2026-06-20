import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { LIVE_COUNT } from "@/lib/liveAtenei";
import { AppFooter } from "@/components/AppFooter";
import { AppNav } from "@/components/AppNav";
import { AssistantBubble } from "@/components/assistente/AssistantBubble";
import { DensityApplier } from "@/components/DensityApplier";
import { OfflineBanner } from "@/components/OfflineBanner";
import { FirstRunGate } from "@/components/onboarding/FirstRunGate";
import { QuickAddFab } from "@/components/quickadd/QuickAddFab";
import { RevealManager } from "@/components/RevealManager";
import { SearchPalette } from "@/components/search/SearchPalette";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { StoreProvider } from "@/components/StoreProvider";
import { CelebrationHost } from "@/components/celebration/CelebrationHost";
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

const DESCRIPTION = `Orario, appelli, libretto e media del tuo ateneo, già pronti e aggiornati in automatico. ${LIVE_COUNT} atenei in sync live, senza account: i tuoi dati restano sul dispositivo.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "StudentOS", template: "%s — StudentOS" },
  description: DESCRIPTION,
  appleWebApp: { capable: true, title: "StudentOS", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "StudentOS",
    title: "StudentOS — il salvagente per la tua carriera universitaria",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentOS — il salvagente per la tua carriera universitaria",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

// Apply the saved theme before first paint to avoid a flash. Dark is default.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('studentos-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

// Mark the document JS-capable before first paint: scroll-reveal sections only
// take their hidden start state under `.js-enabled`, so JS-off visitors and bots
// always get the full page immediately (progressive enhancement). A pure-CSS 2s
// failsafe (globals.css) reveals everything anyway if the bundle never hydrates.
const JS_INIT = `document.documentElement.classList.add('js-enabled');`;

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
        <script dangerouslySetInnerHTML={{ __html: JS_INIT }} />
      </head>
      <body className="min-h-full flex flex-col pb-[68px] xl:pb-0">
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
          <DensityApplier />
          <AppNav />
          {children}
          <AppFooter />
          <FirstRunGate />
          <SearchPalette />
          <QuickAddFab />
          <AssistantBubble />
        </StoreProvider>
        <ToastHost />
        <CelebrationHost />
        <OfflineBanner />
        <RevealManager />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
