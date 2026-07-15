import { MobileLocationBar } from "@/components/layout/MobileLocationBar";
import { LocationProvider } from "@/lib/LocationContext";

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      {children}
      <MobileLocationBar />
    </LocationProvider>
  );
}
