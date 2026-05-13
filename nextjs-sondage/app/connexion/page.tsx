import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginCard } from "@/components/auth/login-card";
import { LoginHeader } from "@/components/auth/login-header";

export const metadata: Metadata = {
  title: "Connexion | Sond'age",
  description: "Accédez à votre espace Sond'age.",
};

export default function ConnexionPage() {
  return (
    <AuthPageShell>
      <main className="relative z-10 w-full max-w-[480px]">
        <LoginHeader />
        <LoginCard />
      </main>
    </AuthPageShell>
  );
}
