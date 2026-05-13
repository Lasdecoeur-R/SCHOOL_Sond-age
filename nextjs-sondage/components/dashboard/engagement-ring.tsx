import { GlassPanel } from "@/components/ui/glass-panel";

type EngagementRingProps = {
  /** Pourcentage 0–100 */
  percent: number;
  label?: string;
  caption?: string;
};

export function EngagementRing({ percent, label = "Engagement", caption }: EngagementRingProps) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <GlassPanel className="flex flex-col items-center p-6 text-center shadow-none">
      <h4 className="mb-4 text-2xl font-semibold leading-snug text-primary">Taux Global</h4>
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160" aria-hidden>
          <circle cx="80" cy="80" r={r} fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="12" />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="transparent"
            stroke="#00236f"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold leading-none text-primary">{percent}%</span>
          <span className="mt-1 text-sm font-medium uppercase tracking-wider text-secondary">{label}</span>
        </div>
      </div>
      {caption ? (
        <p className="mt-4 max-w-xs text-base leading-relaxed text-on-surface-variant">{caption}</p>
      ) : null}
    </GlassPanel>
  );
}
