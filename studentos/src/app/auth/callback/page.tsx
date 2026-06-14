import type { Metadata } from "next";
import { AuthCallback } from "@/components/auth/AuthCallback";

export const metadata: Metadata = { title: "Accesso", robots: { index: false } };

export default function AuthCallbackPage() {
  return <AuthCallback />;
}
