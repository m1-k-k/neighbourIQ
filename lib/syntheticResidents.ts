import { District, VulnerableResident } from "./types";

const AGE_BANDS = ["65-74", "70-79", "75-84", "80-89", "80+"];
const RISK_FACTOR_POOL = ["Lives alone", "Mobility-limited", "Respiratory condition", "Ground-floor flat", "Dementia care"];

function seededIndex(seed: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % mod;
}

// Illustrative/sample data only — there is no public real-data source for individual
// vulnerable-resident records (personal, council-internal data). Deterministic per district
// so the same place produces stable sample residents across refreshes.
export function buildSyntheticResidents(districts: District[]): VulnerableResident[] {
  const residents: VulnerableResident[] = [];
  districts.forEach((d, di) => {
    const count = Math.min(2, Math.max(1, Math.round(d.vulnerableResidentCount / 5)));
    for (let i = 0; i < count; i++) {
      const seed = `${d.id}-${i}`;
      residents.push({
        id: `synth-${seed}`,
        districtId: d.id,
        name: `Sample resident ${String.fromCharCode(65 + di)}${i + 1}`,
        ageBand: AGE_BANDS[seededIndex(seed + "age", AGE_BANDS.length)],
        riskFactors: [RISK_FACTOR_POOL[seededIndex(seed + "rf", RISK_FACTOR_POOL.length)]],
        alertStatus: "none",
      });
    }
  });
  return residents;
}
