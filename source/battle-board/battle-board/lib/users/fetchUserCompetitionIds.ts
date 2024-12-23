
let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function fetchUserCompetitionIds(
  competition_id: string
): Promise<string[]> {
  const response = await fetch(
    `${baseUrl}/api/users/competitions?user_name=${competition_id}` // Correct URL
  );
  if (!response.ok) {
    return [];
  }
  return response.json();
}
