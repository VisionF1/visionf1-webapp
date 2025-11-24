// GET: /driver-standings
export async function getDriverStandings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/driver-standings`, {
    next: { revalidate: 3600 }, // revalidates every 3600 seconds (1 hour)
  });
  if (!res.ok) throw new Error("Failed to fetch driver standings");
  return res.json();
}

// GET: /team-standings
export async function getTeamStandings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/team-standings`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch team standings");
  return res.json();
}

// GET: /drivers
export async function getDrivers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/drivers`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch drivers");
  return res.json();
}

// GET: /upcoming-gp
export async function getUpcomingGP() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/upcoming-gp`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch upcoming GP");
  return res.json();
}

// GET: /events
export async function getEvents(year?: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/events${year ? `?season=${year}` : ''}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

// GET: /summary-events
export async function getSummaryEvents(year?: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/summary-events${year ? `?season=${year}` : ''}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch summary events");
  return res.json();
}

// GET: /seasons
export async function getSeasons() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/seasons`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch seasons");
  return res.json();
}

// GET: /race-pace by season and round
export async function getRacePace(season: number, round: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/race-pace?season=${season}&round=${round}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch race pace");
  return res.json();
}

// GET: /race-pace by event ID
export async function getRacePaceByDriver(eventId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/race-pace?event_id=${eventId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch race pace");
  return res.json();
}

// POST: /predict-race
export async function predictRace(drivers: Array<{
  driver: string;
  team: string;
  race_name: string;
  year: number;
  session_air_temp: number;
  session_track_temp: number;
  session_humidity: number;
  session_rainfall: number;
  circuit_type: string;
}>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/predict-race`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(drivers),
    next: { revalidate: 0 }, // No cache for predictions
  });
  if (!res.ok) throw new Error("Failed to fetch race prediction");
  return res.json();
}
