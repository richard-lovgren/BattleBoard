import { UserData } from "@/models/interfaces/UserPage";
import baseUrl from "@/lib/baseUrl";

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
