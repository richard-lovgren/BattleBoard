"use client";

import { signIn } from "next-auth/react";

export default function LoginBtn() {
  return (
    <button
      className="bg-transparent border border-white px-4 py-1 rounded hover:bg-white hover:text-[#0b0320] transition"
      onClick={() => signIn("discord")}
    >
      Login
    </button>
  );
}
