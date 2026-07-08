import { District } from "./types";

export const TOWN_NAME = "Millhaven";

export const DISTRICTS: District[] = [
  {
    id: "northfield",
    name: "Northfield Estate",
    tagline: "Northfield Care Home · Northfield Avenue",
    population: 4200,
    vulnerableResidentCount: 68,
    rect: { x: 20, y: 20, width: 240, height: 270 },
  },
  {
    id: "oldtown",
    name: "Old Town / High Street",
    tagline: "Market Square · dense footfall",
    population: 3100,
    vulnerableResidentCount: 22,
    rect: { x: 280, y: 20, width: 240, height: 270 },
  },
  {
    id: "hillcrest",
    name: "Hillcrest",
    tagline: "Hillcrest Drive · elevated, low risk",
    population: 2600,
    vulnerableResidentCount: 15,
    rect: { x: 540, y: 20, width: 240, height: 270 },
  },
  {
    id: "stationroad",
    name: "Station Road",
    tagline: "Rail bridge · Millhaven General access",
    population: 3800,
    vulnerableResidentCount: 31,
    rect: { x: 20, y: 310, width: 240, height: 270 },
  },
  {
    id: "riverside",
    name: "Riverside",
    tagline: "Millhaven River · Riverside Primary School",
    population: 5100,
    vulnerableResidentCount: 54,
    rect: { x: 280, y: 310, width: 240, height: 270 },
  },
  {
    id: "greenway",
    name: "Greenway Park",
    tagline: "Community centre · calm baseline",
    population: 2900,
    vulnerableResidentCount: 19,
    rect: { x: 540, y: 310, width: 240, height: 270 },
  },
];

const DISTRICT_BY_ID = new Map(DISTRICTS.map((district) => [district.id, district]));

export function getDistrict(id: string): District {
  const district = DISTRICT_BY_ID.get(id);
  if (!district) throw new Error(`Unknown district id: ${id}`);
  return district;
}
