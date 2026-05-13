import { SurveyStatus } from "@/app/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import type { DashboardSurveyRow } from "@/lib/dashboard-types";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatEndDate(endsAt: Date | null): string {
  if (!endsAt) return "—";
  return dateFmt.format(endsAt);
}

function surveyStatusLabel(status: SurveyStatus, endsAt: Date | null): string {
  const now = new Date();
  if (status === SurveyStatus.DRAFT) return "Brouillon";
  if (status === SurveyStatus.CLOSED) return "Clôturé";
  if (status === SurveyStatus.PUBLISHED) {
    if (endsAt && endsAt <= now) return "Vote terminé";
    return "En cours";
  }
  return status;
}

function subtitleFromSurvey(firstWording: string | undefined, questionCount: number): string {
  if (firstWording) {
    const t = firstWording.trim();
    return t.length > 72 ? `${t.slice(0, 69)}…` : t;
  }
  if (questionCount === 0) return "Aucune question";
  return `${questionCount} question${questionCount > 1 ? "s" : ""}`;
}

export type DashboardData = {
  surveyRows: DashboardSurveyRow[];
  completedCount: number;
  activeCount: number;
  draftsCount: number;
  /** Part distinct utilisateurs ayant voté (30 j.) / utilisateurs en base, 0–100 */
  engagementPercent: number;
  /** Message si la base est injoignable ou les tables manquent (migrations). */
  loadError: string | null;
};

const emptyDashboard = (loadError: string | null = null): DashboardData => ({
  surveyRows: [],
  completedCount: 0,
  activeCount: 0,
  draftsCount: 0,
  engagementPercent: 0,
  loadError,
});

export async function getDashboardData(): Promise<DashboardData> {
  const prisma = getPrisma();
  if (!prisma) {
    return emptyDashboard(
      "DATABASE_URL n’est pas défini côté serveur : impossible de contacter PostgreSQL.",
    );
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const [surveys, completedCount, activeCount, draftsCount, totalUsers, voterGroups] =
      await Promise.all([
        prisma.survey.findMany({
          take: 50,
          orderBy: { updatedAt: "desc" },
          include: {
            creator: { select: { name: true } },
            questions: {
              orderBy: { sortOrder: "asc" },
              take: 1,
              select: { wording: true },
            },
            _count: { select: { questions: true } },
          },
        }),
        prisma.survey.count({ where: { status: SurveyStatus.CLOSED } }),
        prisma.survey.count({ where: { status: SurveyStatus.PUBLISHED } }),
        prisma.survey.count({ where: { status: SurveyStatus.DRAFT } }),
        prisma.user.count(),
        prisma.vote.groupBy({
          by: ["userId"],
          where: {
            votedAt: { gte: thirtyDaysAgo },
            question: { survey: { status: SurveyStatus.PUBLISHED } },
          },
        }),
      ]);

    const engagementPercent =
      totalUsers === 0
        ? 0
        : Math.min(100, Math.round((voterGroups.length / totalUsers) * 100));

    const surveyRows: DashboardSurveyRow[] = surveys.map((s) => {
      const first = s.questions[0];
      const qc = s._count.questions;
      return {
        id: s.id,
        title: s.title,
        subtitle: subtitleFromSurvey(first?.wording, qc),
        organizer: s.creator.name,
        endDate: formatEndDate(s.endsAt),
        status: surveyStatusLabel(s.status, s.endsAt),
        action: s.status === SurveyStatus.DRAFT ? "edit" : "open",
      };
    });

    return {
      surveyRows,
      completedCount,
      activeCount,
      draftsCount,
      engagementPercent,
      loadError: null,
    };
  } catch (err) {
    console.error("[getDashboardData]", err);
    return emptyDashboard(
      "Impossible de lire PostgreSQL (souvent : tables absentes, migrations non appliquées). Avec Docker : reconstruisez la stack (docker compose up -d --build) — le conteneur web lance prisma migrate deploy au démarrage. En local : npm run db:migrate avec une base joignable et DATABASE_URL dans .env.",
    );
  }
}
