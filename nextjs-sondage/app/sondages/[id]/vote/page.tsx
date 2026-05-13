import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardPageFooter } from "@/components/dashboard/dashboard-page-footer";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VoteInterface } from "@/components/survey/vote-interface";
import { getSurveyForVote } from "@/lib/survey-queries";
import { getDisplaySession } from "@/lib/display-session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSurveyForVote(id);
  return {
    title: data ? `Vote — ${data.survey.title} | Sond'age` : "Vote | Sond'age",
  };
}

export default async function VotePage({ params }: Props) {
  const { id } = await params;
  const data = await getSurveyForVote(id);
  if (!data || !data.question) {
    notFound();
  }

  const session = await getDisplaySession();

  return (
    <DashboardShell>
      <main className="mx-auto w-full max-w-[1440px] flex-1 p-6 md:p-10">
        <DashboardHeader
          title="Interface de vote"
          subtitle="Choisissez une option puis validez."
          displayName={session?.name ?? null}
          displayEmail={session?.email ?? null}
        />
        <p className="mb-6 text-sm text-secondary">
          <Link href={`/sondages/${id}/resultats`} className="font-medium text-primary hover:underline">
            Voir les résultats (organisateur)
          </Link>
          {" · "}
          <Link href="/tableau-de-bord" className="font-medium text-primary hover:underline">
            Tableau de bord
          </Link>
        </p>
        <VoteInterface
          surveyId={data.survey.id}
          surveyTitle={data.survey.title}
          surveyStatus={data.survey.status}
          question={data.question}
        />
      </main>
      <DashboardPageFooter />
    </DashboardShell>
  );
}
