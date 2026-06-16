import type { Metadata } from "next";
import { ResetPasswordView } from "@/components/auth/ResetPasswordView";

export const metadata: Metadata = {
  title: "Nuova password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
