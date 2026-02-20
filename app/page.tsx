import type { Metadata } from "next";
import ViewEvent from "./components/ViewEvent";
import HomeProgressive from "./components/HomeProgressive";
import { oracleOfDay } from "./lib/oracle";

export const metadata: Metadata = {
  title: "FutureVoyance • Oracle IA du jour",
  description:
    "Découvre la vibration du jour, ta résonance personnelle, ton ascendant et interroge ton Oracle IA personnel.",
};

export default function Home() {
  const dayOracle = oracleOfDay(new Date());

  return (
    <>
      <ViewEvent name="view_oracle_home" />
      <HomeProgressive initialDayOracle={dayOracle} />
    </>
  );
}
