"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function UserRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract `guild_id` from the query parameters
    const guild_id = searchParams.get("guild_id");

    if (guild_id) {
      // Redirect to `/community/:guild_id`
      router.push(`/community/${guild_id}`);
    } else {
      // Handle case where guild_id is missing (optional)
      console.error("Guild ID not found in query parameters.");
      router.push("/"); // Redirect to a fallback route (e.g., home)
    }
  }, [router, searchParams]);

  return null;
}