"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { TOWN_NAME } from "@/lib/town";

const LINKS = [
  { href: "/dashboard", label: "Council Dashboard" },
  { href: "/resident", label: "Resident View" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
          <ShieldCheck size={18} />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-bold text-slate-900">NeighbourIQ</span>
          <span className="block text-xs text-slate-500">{TOWN_NAME} · AI Community Guardian</span>
        </span>
      </Link>
      <nav className="flex gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === link.href ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
