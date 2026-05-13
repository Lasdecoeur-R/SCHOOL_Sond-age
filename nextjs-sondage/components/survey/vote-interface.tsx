"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { castVoteAction } from "@/app/sondages/actions";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";

const icons = ["train", "eco", "solar_power", "water_drop", "public", "apartment"];

type VoteInterfaceProps = {
  surveyId: string;
  surveyTitle: string;
  /** Valeur Prisma `SurveyStatus` sérialisée */
  surveyStatus: string;
  question: {
    id: string;
    wording: string;
    options: { id: string; label: string }[];
  };
};

export function VoteInterface({ surveyId, surveyTitle, surveyStatus, question }: VoteInterfaceProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const closed = surveyStatus !== "PUBLISHED";

  function submitVote() {
    if (!selected || closed) return;
    setMsg(null);
    startTransition(async () => {
      const res = await castVoteAction(surveyId, question.id, selected);
      if (res.ok) {
        setMsg("Vote enregistré. Merci !");
        router.refresh();
      } else {
        setMsg(res.error);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-10 md:px-10">
      <div className="space-y-3 text-center">
        <span className="inline-block rounded-full border border-white/60 bg-surface-container-high/60 px-4 py-1 text-sm font-medium text-primary">
          Sondage actif
        </span>
        <h1 className="text-3xl font-bold leading-tight text-on-surface md:text-4xl">{surveyTitle}</h1>
        <p className="text-lg text-on-surface-variant">{question.wording}</p>
      </div>

      {closed ? (
        <GlassPanel className="rounded-xl p-8 text-center text-secondary">
          Ce sondage est clos ou en brouillon : les votes ne sont plus possibles.
        </GlassPanel>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {question.options.map((opt, i) => {
              const active = selected === opt.id;
              const icon = icons[i % icons.length];
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={`glass-panel glass-card-vote flex h-full flex-col items-start rounded-xl p-6 text-left outline-none transition-all ${
                    active ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high">
                    <MaterialIcon name={icon} className="text-[28px] text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-primary">{opt.label}</h3>
                  <div className="mt-auto flex w-full justify-end pt-6">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        active ? "border-primary" : "border-outline-variant"
                      }`}
                    >
                      <span
                        className={`h-3 w-3 rounded-full bg-primary transition-opacity ${
                          active ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-col items-center gap-3">
            {msg ? (
              <p className="text-center text-sm font-medium text-secondary" role="status">
                {msg}
              </p>
            ) : null}
            <button
              type="button"
              disabled={!selected || pending}
              onClick={submitVote}
              className="min-w-[200px] rounded-lg bg-primary px-8 py-4 text-xl font-semibold text-on-primary transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Envoi…" : "Voter"}
            </button>
            <p className="text-sm font-medium text-secondary">Vote anonyme (compte démo partagé).</p>
          </div>
        </>
      )}
    </div>
  );
}
