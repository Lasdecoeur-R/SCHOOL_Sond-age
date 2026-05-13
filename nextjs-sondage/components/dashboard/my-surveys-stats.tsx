import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";

type StatRow = { icon: string; label: string; value: number };

type MySurveysStatsProps = {
  completed: number;
  active: number;
  drafts: number;
};

export function MySurveysStats({ completed, active, drafts }: MySurveysStatsProps) {
  const rows: StatRow[] = [
    { icon: "check_circle", label: "Complétés", value: completed },
    { icon: "pending", label: "Actifs", value: active },
    { icon: "drafts", label: "Brouillons", value: drafts },
  ];

  return (
    <GlassPanel className="p-6 shadow-none">
      <h4 className="mb-6 text-2xl font-semibold leading-snug text-primary">Statut des sondages</h4>
      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-lg border border-white/40 bg-white/20 p-4"
          >
            <div className="flex items-center gap-4">
              <MaterialIcon name={row.icon} className="text-primary" filled />
              <span className="text-sm font-medium tracking-wide">{row.label}</span>
            </div>
            <span className="text-2xl font-bold text-primary">{row.value}</span>
          </div>
        ))}
      </div>
      <Link
        href="#"
        className="mt-6 flex w-full items-center justify-center gap-1 text-sm font-medium tracking-wide text-primary hover:underline"
      >
        Voir les détails <MaterialIcon name="arrow_forward" className="text-[18px]" />
      </Link>
    </GlassPanel>
  );
}
