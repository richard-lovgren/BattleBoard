import baseUrl from "@/lib/baseUrl";

async function fetchGameName(gameId: string): Promise<string | null> {
    const response = await fetch(`${baseUrl}/api/game?gameId=${gameId}`);
    if (!response.ok) return null;

    const gameData = await response.json();
    return gameData?.game_name || null; // Return the game_name directly
}
export default fetchGameName;