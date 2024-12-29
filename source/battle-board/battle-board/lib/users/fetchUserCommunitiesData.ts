let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function fetchUserCommunitiesData(
  user_name: string
): Promise<Record<string, string>> {
  const response = await fetch(
    `${baseUrl}/api/users/communities?user_name=${user_name}` // Correct URL
  );
  if (!response.ok) {
    return {};
  }

  return response.json();
}
