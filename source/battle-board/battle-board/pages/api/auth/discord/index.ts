
// pages/api/auth/discord.ts
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    try {
      // Retrieve environment variables
      const clientId = process.env.DISCORD_CLIENT_ID;
      const redirectUri = process.env.DISCORD_REDIRECT_URI;

      if (!clientId || !redirectUri) {
        res.status(500).json({ error: "Environment variables not set" });
        return;
      }

      // Define the OAuth2 URL
      const scope = "identify email";
      const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${encodeURIComponent(scope)}`;

      // Respond with the URL
      res.status(200).json({ url: discordOAuthUrl });
    } catch (error) {
      console.error("Error generating Discord OAuth URL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;