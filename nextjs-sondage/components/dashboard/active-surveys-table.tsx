import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";
import type { DashboardSurveyRow } from "@/lib/dashboard-types";

type ActiveSurveysTableProps = {
  rows: DashboardSurveyRow[];
};

export function ActiveSurveysTable({ rows }: ActiveSurveysTableProps) {
  return (
    <section className="col-span-12 lg:col-span-8">
      <GlassPanel hoverable className="overflow-hidden shadow-none">
        <div className="flex flex-col gap-4 border-b border-white/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold leading-snug text-primary">Sondages Actifs</h3>
          <div className="flex gap-2">
            <span className="glass-panel inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium tracking-wide text-primary shadow-none">
              <MaterialIcon name="filter_list" className="text-[18px]" />
              Filtrer
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/20">
                {["Titre", "Organisateur", "Date de fin", "Statut", "Action"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-white/40 p-6 text-sm font-medium tracking-wide text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-sm font-medium text-secondary">
                    Aucun sondage en base pour le moment.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="group transition-colors hover:bg-white/20">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-wide text-primary">{row.title}</span>
                        <span className="text-xs text-secondary">{row.subtitle}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-medium tracking-wide text-on-surface">{row.organizer}</td>
                    <td className="p-6 text-sm font-medium tracking-wide text-on-surface">{row.endDate}</td>
                    <td className="p-6">
                      <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/sondages/${row.id}/vote`}
                          className="inline-flex rounded-lg p-2 text-primary transition-colors hover:bg-white/40"
                          aria-label="Voter"
                          title="Voter"
                        >
                          <MaterialIcon name="how_to_vote" />
                        </Link>
                        <Link
                          href={`/sondages/${row.id}/resultats`}
                          className="inline-flex rounded-lg p-2 text-primary transition-colors hover:bg-white/40"
                          aria-label="Résultats"
                          title="Résultats"
                        >
                          <MaterialIcon name="bar_chart" />
                        </Link>
                        {row.action === "edit" ? (
                          <Link
                            href={`/sondages/${row.id}/editer`}
                            className="inline-flex rounded-lg p-2 text-primary transition-colors hover:bg-white/40"
                            aria-label="Modifier"
                            title="Modifier"
                          >
                            <MaterialIcon name="edit" />
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </section>
  );
}
