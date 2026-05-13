"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { closeSurveyAction, toggleResultsPublicAction } from "@/app/sondages/actions";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";

type Props = {
  surveyId: string;
  status: string;
  resultsPublic: boolean;
};

export function ResultsOrganizerControls({ surveyId, status, resultsPublic }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const collecting = status === "PUBLISHED";

  return (
    <GlassPanel className="mb-8 flex flex-wrap items-center justify-between gap-6 rounded-xl p-6">
      <div className="flex flex-wrap items-center gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-secondary">Statut</p>
          <div className="mt-1 flex items-center gap-2">
            {collecting ? (
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            ) : null}
            <span className="font-bold text-primary">
              {status === "DRAFT" && "Brouillon"}
              {status === "PUBLISHED" && "En cours de collecte"}
              {status === "CLOSED" && "Clôturé"}
            </span>
          </div>
        </div>
        <div className="hidden h-10 w-px bg-white/60 sm:block" />
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-on-surface">Résultats visibles pour tous</p>
            <p className="text-xs text-secondary">
              {resultsPublic ? "Les visiteurs voient les agrégats." : "Réservé aux organisateurs."}
            </p>
          </div>
          <button
            type="button"
            disabled={pending || status === "CLOSED"}
            onClick={() =>
              startTransition(async () => {
                await toggleResultsPublicAction(surveyId, !resultsPublic);
                router.refresh();
              })
            }
            className={`relative h-6 w-12 rounded-full transition-colors ${
              resultsPublic ? "bg-primary" : "bg-outline-variant"
            } disabled:opacity-50`}
            aria-pressed={resultsPublic}
            aria-label="Basculer la visibilité des résultats"
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                resultsPublic ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="glass-panel flex items-center gap-2 rounded-lg px-5 py-2 font-bold text-primary transition-colors hover:bg-white/60"
        >
          <MaterialIcon name="share" />
          Partager
        </button>
        <button
          type="button"
          disabled={pending || status !== "PUBLISHED"}
          onClick={() =>
            startTransition(async () => {
              await closeSurveyAction(surveyId);
              router.refresh();
            })
          }
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-bold text-white transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MaterialIcon name="lock_clock" />
          Clôturer le sondage
        </button>
      </div>
    </GlassPanel>
  );
}
