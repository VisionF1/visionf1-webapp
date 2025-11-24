import { RaceStrategyAnimation } from "@/components/race-strategy/race-strategy-animation";
import { getEvents } from "@/lib/api-requests";

export default async function RaceStrategy() {
  const races = (await getEvents(2025)).data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
      <RaceStrategyAnimation races={races} />
    </div>
  );
}
