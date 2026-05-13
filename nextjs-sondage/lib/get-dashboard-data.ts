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

/** Indice court dérivé de l’erreur Prisma/pg (sans exposer de secrets). */
function hintFromDatabaseError(err: unknown): string | null {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (
    lower.includes("does not exist") ||
    lower.includes("n'existe pas") ||
    (lower.includes("relation") && lower.includes("survey"))
  ) {
    return "Les tables semblent absentes : au démarrage du conteneur, « prisma migrate deploy » doit réussir (voir les logs). Sur Dokploy, vérifiez aussi DATABASE_URL vers le service Postgres interne.";
  }
  if (
    lower.includes("econnrefused") ||
    lower.includes("connect econnrefused") ||
    lower.includes("p1001") ||
    lower.includes("getaddrinfo enotfound")
  ) {
    return "La base ne répond pas : vérifiez DATABASE_URL (hôte = nom du service Postgres sur le réseau Dokploy, jamais localhost) et que Postgres est démarré.";
  }
  if (lower.includes("password authentication failed") || lower.includes("p1000")) {
    return "Authentification refusée : utilisateur ou mot de passe dans DATABASE_URL ne correspond pas au service Postgres.";
  }
  if (lower.includes("ssl") || lower.includes("certificate") || lower.includes("self-signed")) {
    return "Problème TLS : essayez d’ajouter à DATABASE_URL le paramètre sslmode=require (ou sslmode=disable si la base n’utilise pas TLS).";
  }
  return null;
}

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
    const hint = hintFromDatabaseError(err);
    const fallback =
      "Vérifiez DATABASE_URL, les logs du conteneur au démarrage (migrations Prisma), puis redéployez. En local : npm run db:migrate. Docker local : docker compose up -d --build.";
    return emptyDashboard(
      hint ?
        `Impossible de lire PostgreSQL. ${hint} Sinon : ${fallback}`
      : `Impossible de lire PostgreSQL (connexion ou schéma). ${fallback}`,
    );
  }
}
