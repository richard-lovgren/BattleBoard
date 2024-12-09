import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";


export default function LolUsernameBox() {
    const { data: session } = useSession();
    const [username, setUsername] = useState("");
    const [tagline, setTagline] = useState("");
    const [lolUsername, setLolUsername] = useState<string | null>(null);
    const userId = session?.user?.id!;
    console.log("User ID:", userId);
    const db_conn_str = process.env.DB_CONN_STR;

    useEffect(() => {
        // Fetch the user's League data from the backend
        const fetchUserLeagueData = async () => {
            try {
                const response = await fetch("/api/get-user?userId=" + userId);
                if (!response.ok) {
                    throw new Error(`Error fetching user: ${response.statusText}`);
                }

                const user = await response.json();
                if (user.league_puuid) {
                    setLolUsername(`${user.display_name}`);
                }
            } catch (error) {
                console.error("Error fetching user league data:", error, userId);
            }
        };

        fetchUserLeagueData();
    }, [userId]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [name, tag] = event.target.value.split("#");
        setUsername(name);
        setTagline(tag);
    };

    const handleSubmit = async () => {
        try {
            const puuid = await getPuuid(username, tagline);
            if (puuid) {
                await updateUserLeaguePuuid(userId, puuid);
                setLolUsername(username); // Update UI to reflect the new username
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {lolUsername ? (
                <div className="text-lg font-medium">
                    LoL Username: <span className="text-purple-500">{lolUsername}</span>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="LOL Username#Tagline"
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        onChange={handleInputChange}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-500 text-white rounded-md"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

// Fetch the PUUID from Riot API
async function getPuuid(username: string, tagline: string): Promise<string | null> {
    try {
        const response = await fetch(`/api/get-puuid?username=${encodeURIComponent(username)}&tagline=${encodeURIComponent(tagline)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data: { puuid: string } = await response.json();
        return data.puuid;
    } catch (error) {
        console.error("Failed to fetch PUUID:", error);
        return null;
    }
}

// Update the user's League PUUID in the backend
async function updateUserLeaguePuuid(userId: string, puuid: string): Promise<void> {
    try {
        const response = await fetch(`/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                league_puuid: puuid,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        console.log("User updated successfully.");
    } catch (error) {
        console.error("Error updating user PUUID:", error);
    }
}
