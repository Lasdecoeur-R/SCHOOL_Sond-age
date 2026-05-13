import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-on-surface">
      <h1 className="text-3xl font-semibold text-primary">Sond&apos;age</h1>
      <p className="max-w-md text-center text-secondary">
        Page d&apos;accueil provisoire. La maquette de connexion est disponible sur la route dédiée.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/connexion"
          className="rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-on-primary transition-colors hover:bg-on-primary-fixed-variant"
        >
          Aller à la connexion
        </Link>
        <Link
          href="/tableau-de-bord"
          className="rounded-lg border border-primary/30 bg-white/60 px-6 py-3 text-lg font-semibold text-primary transition-colors hover:bg-white"
        >
          Tableau de bord
        </Link>
        <Link
          href="/sondages/nouveau"
          className="rounded-lg border border-primary/30 bg-white/60 px-6 py-3 text-lg font-semibold text-primary transition-colors hover:bg-white"
        >
          Nouveau sondage
        </Link>
      </div>
    </div>
  );
}
