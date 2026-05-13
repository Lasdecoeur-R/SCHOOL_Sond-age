import type { Metadata } from "next";
import Link from "next/link";
import { SurveyTopNav } from "@/components/survey/survey-top-nav";
import { NewSurveyForm } from "@/components/survey/new-survey-form";

export const metadata: Metadata = {
  title: "Nouveau sondage | Sond'age",
  description: "Créer un sondage",
};

export default async function NouveauSondagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const err =
    sp.error === "validation" ?
      "Titre et au moins deux options sont requis."
    : sp.error === "db" ?
      "Base de données indisponible."
    : null;

  return (
    <div className="survey-create-root text-on-surface">
      <SurveyTopNav active="create" />
      {err ? (
        <div className="mx-auto max-w-4xl px-8 pt-6">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
            {err}
          </p>
        </div>
      ) : null}
      <NewSurveyForm />
      <footer className="w-full border-t border-white/20 py-6">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-6 px-8 text-sm text-secondary">
          <span>© Sond&apos;age</span>
          <div className="flex gap-4">
            <Link className="text-on-surface-variant hover:text-primary" href="#">
              Confidentialité
            </Link>
            <Link className="text-on-surface-variant hover:text-primary" href="#">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
