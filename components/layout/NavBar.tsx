"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export interface NavLink {
  href: string;
  label: string;
}

export function NavBar({ links, subtitle }: { links: NavLink[]; subtitle: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-ink px-4 py-3 text-white md:px-6 md:py-3.5">
      <Link href="/" className="group flex items-center gap-3 transition-smooth">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal text-white transition-smooth group-hover:scale-105 group-hover:brightness-110">
          <ShieldCheck size={18} />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-semibold tracking-tight text-white">NeighbourIQ</span>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-teal-bright/90">{subtitle}</span>
        </span>
      </Link>
      <nav className="flex gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "rounded-md px-3.5 py-2 text-sm font-medium transition-smooth",
              pathname === link.href
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
