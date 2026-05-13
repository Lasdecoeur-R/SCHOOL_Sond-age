import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardPageFooter } from "@/components/dashboard/dashboard-page-footer";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ResultsBento } from "@/components/survey/results-bento";
import { ResultsOrganizerControls } from "@/components/survey/results-organizer-controls";
import { getSurveyResults } from "@/lib/survey-queries";
import { getDisplaySession } from "@/lib/display-session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSurveyResults(id);
  return {
    title: data ? `Résultats — ${data.survey.title} | Sond'age` : "Résultats | Sond'age",
  };
}

export default async function ResultatsPage({ params }: Props) {
  const { id } = await params;
  const data = await getSurveyResults(id);
  if (!data) {
    notFound();
  }

  const session = await getDisplaySession();

  return (
    <DashboardShell>
      <main className="mx-auto w-full max-w-[1440px] flex-1 p-6 md:p-10">
        <DashboardHeader
          title="Pilotage du sondage"
          subtitle={data.survey.title}
          displayName={session?.name ?? null}
          displayEmail={session?.email ?? null}
        />
        <p className="mb-6 text-sm text-secondary">
          <Link href={`/sondages/${id}/vote`} className="font-medium text-primary hover:underline">
            Page de vote
          </Link>
          {" · "}
          <Link href="/tableau-de-bord" className="font-medium text-primary hover:underline">
            Tableau de bord
          </Link>
        </p>
        <ResultsOrganizerControls
          surveyId={data.survey.id}
          status={data.survey.status}
          resultsPublic={data.survey.resultsPublic}
        />
        <ResultsBento
          totalVotes={data.totalVotes}
          questionWording={data.questionWording}
          options={data.options}
        />
      </main>
      <DashboardPageFooter />
    </DashboardShell>
  );
}
