"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function LoginBtn() {
  const { data: session } = useSession();

  console.log("Session Data:", session); // Log the session data to debug

  if (session?.user) {
    return (
      <Link href={`/user/${session.user.name}`}>
        <div className="flex items-center space-x-4">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "Profile Picture"}
              className="w-8 h-8 rounded-full"
              height={32}
              width={32}
            />
          )}
          <p className="text-sm">
            Welcome, {session.user.display_name || "User"}
          </p>
          <Button variant="outline" size="lg" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </Link>
    );
  }

  return (
    <Button variant="outline" size="lg" onClick={() => signIn("discord")}>
      Login
    </Button>
  );
}
