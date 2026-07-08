import { NavBar } from "./NavBar";
import { ScenarioControls } from "./ScenarioControls";

export function AppHeader() {
  return (
    <div className="sticky top-0 z-20">
      <NavBar />
      <ScenarioControls />
    </div>
  );
}
