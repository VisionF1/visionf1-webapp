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
