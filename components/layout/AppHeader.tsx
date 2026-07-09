import { NavBar } from "./NavBar";
import { ScenarioControls } from "./ScenarioControls";

export function AppHeader() {
  return (
    <>
      <div className="sticky top-0 z-30">
        <NavBar />
      </div>
      <div className="md:sticky md:top-[3.75rem] md:z-20">
        <ScenarioControls />
      </div>
    </>
  );
}
