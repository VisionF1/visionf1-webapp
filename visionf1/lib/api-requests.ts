// GET: /driver-standings
export async function getDriverStandings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VISIONF1_API_URL}/driver-standings`, {
    next: { revalidate: 3600 }, // revalida cada 3600 segundos (1 hora)
  });
  if (!res.ok) throw new Error("Failed to fetch driver standings");
  return res.json();
}