import type { Metadata } from "next";
import { ActiveSurveysTable } from "@/components/dashboard/active-surveys-table";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardPageFooter } from "@/components/dashboard/dashboard-page-footer";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EngagementRing } from "@/components/dashboard/engagement-ring";
import { MySurveysStats } from "@/components/dashboard/my-surveys-stats";
import { getDashboardData } from "@/lib/get-dashboard-data";
import { getDisplaySession } from "@/lib/display-session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tableau de bord | Sond'age",
  description: "Aperçu des sondages actifs et statistiques.",
};

export default async function TableauDeBordPage() {
  const session = await getDisplaySession();
  const {
    surveyRows,
    completedCount,
    activeCount,
    draftsCount,
    engagementPercent,
    loadError,
  } = await getDashboardData();

  const subtitle =
    session?.name ?
      `Bienvenue, ${session.name}. Voici un aperçu des sondages et de la participation.`
    : "Données issues de la base : sondages, statuts et participation.";

  return (
    <DashboardShell>
      <main className="mx-auto w-full max-w-[1440px] flex-1 p-6 md:p-10">
        <DashboardHeader
          title="Tableau de Bord"
          subtitle={subtitle}
          displayName={session?.name ?? null}
          displayEmail={session?.email ?? null}
        />
        {loadError ? (
          <p
            className="mb-6 rounded-xl border border-amber-300/80 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950"
            role="alert"
          >
            {loadError}
          </p>
        ) : null}
        <div className="grid grid-cols-12 items-start gap-6 lg:gap-8">
          <ActiveSurveysTable rows={surveyRows} />
          <aside className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:gap-8">
            <EngagementRing
              percent={engagementPercent}
              caption="Utilisateurs distincts ayant voté sur un sondage publié au cours des 30 derniers jours, rapportés au nombre d’utilisateurs enregistrés."
            />
            <MySurveysStats
              completed={completedCount}
              active={activeCount}
              drafts={draftsCount}
            />
          </aside>
        </div>
      </main>
      <DashboardPageFooter />
    </DashboardShell>
  );
}
