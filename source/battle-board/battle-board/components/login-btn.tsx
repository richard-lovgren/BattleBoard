"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn() {
  const { data: session } = useSession();

  console.log("Session Data:", session); // Log the session data to debug

  if (session?.user) {
    return (
      <div className="flex items-center space-x-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "Profile Picture"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <p className="text-sm">Welcome, {session.user.display_name || "User"}</p>
        <button
          className="bg-transparent border border-white px-4 py-1 rounded hover:bg-white hover:text-[#0b0320] transition"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      className="text-white py-2 px-4 rounded-xl border-foreground border-2 hover:bg-white hover:text-[#0b0320] transition hover:border-transparent "
      onClick={() => signIn("discord")}
    >
      Login
    </button>

  );
}
