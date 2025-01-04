import { UserData } from "@/models/interfaces/UserPage";

let baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function fetchUserData(discord_id: number): Promise<UserData> {
  // Example API endpoint; replace with your actual API request
  const response = await fetch(`${baseUrl}/api/users?userId=${discord_id}`);
  if (!response.ok) {
    return {
      id: "",
      discord_id: 0,
      user_name: "",
      display_name: "",
      league_puuid: "",
      locale: "",
    };
  }
  return response.json();
}
