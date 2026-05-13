import { GlassPanel } from "@/components/ui/glass-panel";
import type { OptionResult } from "@/lib/survey-queries";

type ResultsBentoProps = {
  totalVotes: number;
  questionWording: string | null;
  options: OptionResult[];
};

export function ResultsBento({ totalVotes, questionWording, options }: ResultsBentoProps) {
  const goal = 2000;
  const pctGoal = goal ? Math.min(100, Math.round((totalVotes / goal) * 100)) : 0;

  return (
    <div className="grid grid-cols-12 gap-6">
      <GlassPanel
        hoverable
        className="col-span-12 flex min-h-[280px] flex-col justify-between p-6 lg:col-span-4"
      >
        <div>
          <h3 className="mb-4 text-2xl font-semibold text-primary">Participation</h3>
          <div className="flex items-end gap-1">
            <span className="text-6xl font-extrabold leading-none text-primary">{totalVotes.toLocaleString("fr-FR")}</span>
            <span className="mb-2 font-bold text-secondary">votants</span>
          </div>
          <p className="mt-2 text-sm text-secondary">Total de votes enregistrés</p>
        </div>
        <div className="relative pt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-semibold text-on-surface">Objectif indicatif : {goal.toLocaleString("fr-FR")}</span>
            <span className="font-bold text-primary">{pctGoal}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full border border-white/60 bg-white/30">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pctGoal}%` }} />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel hoverable className="col-span-12 rounded-xl p-6 lg:col-span-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-primary">Résultats agrégés</h3>
            <p className="mt-1 text-secondary">{questionWording ?? "—"}</p>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-tight text-primary">
            Temps réel
          </span>
        </div>
        <div className="space-y-8">
          {options.length === 0 ? (
            <p className="text-secondary">Aucune option pour cette question.</p>
          ) : (
            options.map((opt, i) => (
              <div key={opt.optionId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">{opt.label}</span>
                    <span className="rounded border border-white/60 bg-white/40 px-2 py-0.5 text-xs text-secondary">
                      Option {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">{opt.percent}%</span>
                    <span className="ml-2 text-xs text-secondary">{opt.count} votes</span>
                  </div>
                </div>
                <div className="h-4 w-full overflow-hidden rounded-lg border border-white/60 bg-white/20">
                  <div
                    className={`h-full rounded-lg ${
                      i === 0 ? "bg-primary" : i === 1 ? "bg-primary-container opacity-90" : "bg-outline-variant"
                    }`}
                    style={{ width: `${Math.max(opt.percent, 2)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </GlassPanel>

      <GlassPanel hoverable className="col-span-12 flex flex-col justify-between rounded-xl p-6 lg:col-span-5">
        <h3 className="mb-4 text-2xl font-semibold text-primary">Tendance (7 j.)</h3>
        <div className="flex h-48 items-end gap-1 px-2">
          {[30, 45, 65, 50, 85, 100, 70].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-t-sm border-x border-t border-white/40 bg-primary/60"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs font-medium uppercase tracking-widest text-secondary">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
            <span key={d} className={d === "Sam" ? "font-bold text-primary" : ""}>
              {d}
            </span>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel hoverable className="col-span-12 rounded-xl p-6 lg:col-span-7">
        <h3 className="mb-4 text-2xl font-semibold text-primary">Synthèse</h3>
        <p className="text-on-surface-variant">
          Les pourcentages sont calculés sur les votes enregistrés pour la première question du sondage.
        </p>
      </GlassPanel>
    </div>
  );
}
