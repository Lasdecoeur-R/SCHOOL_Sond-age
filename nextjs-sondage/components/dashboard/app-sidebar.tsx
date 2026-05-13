"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/material-icon";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/tableau-de-bord", label: "Dashboard", icon: "dashboard" },
  { href: "/tableau-de-bord", label: "Active Polls", icon: "how_to_vote" },
  { href: "#", label: "Archives", icon: "history" },
];

function navClass(active: boolean) {
  return [
    "flex items-center gap-4 rounded-lg p-4 text-sm font-medium tracking-wide transition-all duration-150 active:translate-x-1",
    active ? "bg-primary text-on-primary" : "text-secondary hover:bg-white/20",
  ].join(" ");
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col gap-2 border-r border-white/60 bg-white/40 p-4 backdrop-blur-[30px] md:flex">
      <div className="mb-10 px-2">
        <Link href="/" className="block">
          <h1 className="text-2xl font-extrabold text-primary">Sond&apos;age</h1>
        </Link>
        <p className="text-sm font-medium tracking-wide text-secondary">Developer Insights</p>
      </div>
      <nav className="flex flex-grow flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href !== "#" &&
            item.label === "Active Polls" &&
            pathname === "/tableau-de-bord";
          return (
            <Link key={item.label} href={item.href} className={navClass(active)}>
              <MaterialIcon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/sondages/nouveau"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-4 text-sm font-medium tracking-wide text-white transition-colors duration-200 hover:bg-primary active:scale-95"
      >
        <MaterialIcon name="add" className="text-[20px]" />
        Create Poll
      </Link>
      <div className="mt-auto border-t border-white/20 pt-4">
        <Link
          href="#"
          className="flex items-center gap-4 rounded-lg p-4 text-sm font-medium tracking-wide text-secondary transition-all hover:bg-white/20"
        >
          <MaterialIcon name="settings" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
