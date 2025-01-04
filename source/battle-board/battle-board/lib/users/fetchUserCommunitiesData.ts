import baseUrl from "@/lib/baseUrl";

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
