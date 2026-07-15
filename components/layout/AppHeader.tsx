import { ReactNode } from "react";
import { NavBar, NavLink } from "./NavBar";

export function AppHeader({ links, subtitle, controls }: { links: NavLink[]; subtitle: string; controls: ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-30">
        <NavBar links={links} subtitle={subtitle} />
      </div>
      <div className="md:sticky md:top-[3.75rem] md:z-20">{controls}</div>
    </>
  );
}
