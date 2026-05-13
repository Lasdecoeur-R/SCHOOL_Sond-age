import Link from "next/link";
import { logoutDisplaySession } from "@/lib/connexion-server-actions";
import { MaterialIcon } from "@/components/ui/material-icon";
import { GlassPanel } from "@/components/ui/glass-panel";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]?.[0];
    const b = parts[parts.length - 1]?.[0];
    if (a && b) return `${a}${b}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase() || "?";
}

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  /** Nom issu du formulaire de connexion (cookie de session affichage) */
  displayName?: string | null;
  displayEmail?: string | null;
};

export function DashboardHeader({ title, subtitle, displayName, displayEmail }: DashboardHeaderProps) {
  const showUser = Boolean(displayName?.trim());

  return (
    <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-5xl font-bold leading-tight tracking-tight text-primary">{title}</h2>
        <p className="mt-1 max-w-2xl text-base leading-relaxed text-on-surface-variant">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {showUser ? (
          <GlassPanel className="flex flex-wrap items-center gap-2 rounded-full px-3 py-2 shadow-none sm:gap-3 sm:pr-2">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary"
              title={displayEmail ?? undefined}
            >
              {initials(displayName!)}
            </span>
            <div className="min-w-0 flex-1 sm:flex-initial">
              <p className="text-xs font-medium text-secondary">Connecté</p>
              <p className="max-w-[200px] truncate text-sm font-semibold text-primary sm:max-w-[240px]">
                {displayName}
              </p>
            </div>
            <form action={logoutDisplaySession} className="shrink-0">
              <button
                type="submit"
                className="rounded-full border border-outline-variant/50 bg-white/50 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-white/80"
              >
                Déconnexion
              </button>
            </form>
          </GlassPanel>
        ) : (
          <GlassPanel className="flex items-center gap-2 rounded-full px-3 py-2 shadow-none">
            <span className="hidden text-xs text-secondary sm:inline">Non connecté</span>
            <Link
              href="/connexion"
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              Se connecter
            </Link>
          </GlassPanel>
        )}
        <GlassPanel className="flex items-center gap-3 rounded-full px-4 py-2 shadow-none">
          <MaterialIcon name="search" className="text-primary" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="w-40 border-none bg-transparent text-sm font-medium tracking-wide text-primary outline-none placeholder:text-outline-variant sm:w-48"
            aria-label="Rechercher"
          />
        </GlassPanel>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors glass-panel shadow-none hover:bg-white/60"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors glass-panel shadow-none hover:bg-white/60"
            aria-label="Aide"
          >
            <MaterialIcon name="help" />
          </button>
        </div>
      </div>
    </header>
  );
}
