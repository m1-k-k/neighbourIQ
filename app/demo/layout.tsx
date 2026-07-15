import { MobileScenarioBar } from "@/components/layout/MobileScenarioBar";
import { ScenarioProvider } from "@/lib/ScenarioContext";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScenarioProvider>
      {children}
      <MobileScenarioBar />
    </ScenarioProvider>
  );
}
