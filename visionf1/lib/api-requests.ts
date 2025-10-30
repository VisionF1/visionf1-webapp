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
export async function getEvents(season?: number) {
  const url = new URL(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/events`);
  if (season) {
    url.searchParams.append('season', season.toString());
  }
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
