export function DashboardPageFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto flex w-full flex-wrap items-center justify-center gap-6 border-t border-white/20 py-4">
      <span className="text-sm font-medium tracking-wide text-secondary">
        © {year} Sond&apos;age Internal
      </span>
      <div className="flex flex-wrap justify-center gap-6">
        <a
          className="text-sm font-medium tracking-wide text-on-surface-variant transition-opacity duration-300 hover:text-primary"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="text-sm font-medium tracking-wide text-on-surface-variant transition-opacity duration-300 hover:text-primary"
          href="#"
        >
          Documentation
        </a>
        <a
          className="text-sm font-medium tracking-wide text-on-surface-variant transition-opacity duration-300 hover:text-primary"
          href="#"
        >
          Support
        </a>
      </div>
    </footer>
  );
}
