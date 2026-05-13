import Link from "next/link";
import { MaterialIcon } from "@/components/ui/material-icon";

type Active = "dashboard" | "create" | "archives";

const link =
  "text-on-surface-variant font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/10";
const activeLink = "text-primary font-bold border-b-2 border-primary px-4 py-2";

export function SurveyTopNav({ active }: { active: Active }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/40 backdrop-blur-[30px]">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          Sond&apos;age
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/tableau-de-bord" className={active === "dashboard" ? activeLink : link}>
            Tableau de bord
          </Link>
          <Link href="/sondages/nouveau" className={active === "create" ? activeLink : link}>
            Créer un sondage
          </Link>
          <span className={`cursor-not-allowed opacity-50 ${link}`}>Archives</span>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors hover:bg-white/10"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors hover:bg-white/10"
            aria-label="Aide"
          >
            <MaterialIcon name="help" />
          </button>
        </div>
      </div>
    </header>
  );
}
