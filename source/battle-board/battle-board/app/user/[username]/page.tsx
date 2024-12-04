"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function LoginBtn() {
  const { data: session } = useSession();

  console.log("Session Data:", session?.user.name); // Log the session data to debug

  if (session?.user) {

    return (

      <main>
        <p className="text-center">Logged in as {session.user.name}</p>
      </main>

    )
  } else {

    return (
      <div>
        <p className="text-center">Not logged in</p>
      </div>
    )
  }
}
