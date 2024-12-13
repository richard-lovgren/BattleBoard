"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      router.push(`/user/${session.user.name}`);
    } else if (status === "unauthenticated") {
      router.push('/'); 
    }
  }, [session, status, router]);

  return null;
}