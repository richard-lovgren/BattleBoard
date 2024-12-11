import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LolUsernameBox() {
    const { data: session } = useSession();
    console.log("Session data:", session);
    const userId = session?.user?.id;

    const [league_username, setUsername] = useState("");
    const [tagline, setTagline] = useState("");
    const [fullLolUsername, setFullLolUsername] = useState<string | null>(null);
    const [helpText, setHelpText] = useState("");

    const fetchUserLeagueData = async () => {
        try {
            console.log("Fetching data for userId:", userId);
            const response = await fetch(`/api/get-user?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`Error fetching user: ${response.statusText}`);
            }

            const user = await response.json();

            if (user.league_puuid) {
                const username = await getLolUsername(user.league_puuid);
                console.log("Fetched username:", username);
                setFullLolUsername(username || null);
            } else {
                setFullLolUsername(null);
            }
        } catch (error) {
            console.error("Error in fetchUserLeagueData:", error);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchUserLeagueData();
    }, [userId]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [name, tag] = event.target.value.split("#");
        setUsername(name);
        setTagline(tag);
    };

    const handleSubmit = async () => {
        try {
            const puuid = await getPuuid(league_username, tagline);
            if (puuid) {
                await updateUserLeaguePuuid(userId as string, puuid);
                setFullLolUsername(league_username); // Update UI to reflect the new username
                setUsername("");
                setTagline("");
            }
            else {
                setHelpText("Invalid username or tagline.");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    };
    const handleRemove = async () => {
        try {
            setHelpText("");
            await updateUserLeaguePuuid(userId as string, null);
            setFullLolUsername(null);
        } catch (error) {
            console.error("Error in handleRemove:", error);
        }
    }

    if (!session || !userId) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-4">
            {fullLolUsername ? (
                <div className="text-lg font-medium gap-4">
                    <div>
                        LoL Username: <span className="text-purple-500">{fullLolUsername}</span>
                    </div>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                        onClick={handleRemove}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="username#tagline"
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
                    <div className="text-sm text-red-500">
                        {helpText}
                    </div>
                </div>
            )}
        </div>
    );

}


// Fetch the PUUID from Riot API
async function getPuuid(league_username: string, tagline: string): Promise<string | null> {
    try {
        const response = await fetch(`/api/lol/get-puuid?username=${encodeURIComponent(league_username)}&tagline=${encodeURIComponent(tagline)}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data: { puuid: string } = await response.json();
        return data.puuid;
    } catch (error) {
        console.log("Error in getPuuid:", error);
        return null;
    }
}

// Fetch Users LOL name from puuid
async function getLolUsername(puuid: string): Promise<string | null> {
    try {
        if (!puuid) return null;
        console.log("Fetching LOL username for PUUID:", puuid);
        const response = await fetch(`/api/lol/get-username?puuid=${puuid}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return `${data.gameName}#${data.tagLine}`;
    } catch (error) {
        console.log("Error in getLolUsername:", error);
        return null;
    }
}


// Update the user's League PUUID in the backend
async function updateUserLeaguePuuid(userId: string, puuid: string | null): Promise<void> {
    try {
        const response = await fetch("/api/get-user?userId=" + userId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                league_puuid: puuid,
                discord_id: userId,
                username: "",
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user: ${response.statusText}`);
        }

        console.log("User updated successfully.");
    } catch (error) {
        console.log("Error updating user PUUID:", error);
    }
}
