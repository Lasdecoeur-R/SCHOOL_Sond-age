import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { SurveyTopNav } from "@/components/survey/survey-top-nav";

export const metadata: Metadata = {
  title: "Modifier le sondage | Sond'age",
};

type Props = { params: Promise<{ id: string }> };

export default async function EditerSondagePage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="survey-create-root text-on-surface">
      <SurveyTopNav active="create" />
      <main className="mx-auto max-w-2xl px-8 py-16">
        <GlassPanel className="space-y-6 p-10">
          <h1 className="text-3xl font-bold text-primary">Édition du sondage</h1>
          <p className="text-secondary">
            L’éditeur complet (modifier titre, questions et options) arrive dans une prochaine itération. Identifiant
            actuel : <span className="font-mono text-on-surface">{id}</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/sondages/${id}/resultats`}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-on-primary hover:brightness-110"
            >
              Pilotage & résultats
            </Link>
            <Link href="/sondages/nouveau" className="rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-white/40">
              Créer un autre sondage
            </Link>
          </div>
        </GlassPanel>
      </main>
    </div>
  );
}
