
"use client";

import { handleSignIn } from "./server-login";

export default function LoginButton() {
  return (
    <form action={handleSignIn}>
      <button type="submit">Login</button>
    </form>
  );
}
