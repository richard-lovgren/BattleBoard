"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import Box from "@mui/material/Box";

export const dynamic = "force-dynamic";

const FetchCreatedCommunity = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guild_id = searchParams.get('guild_id');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      router.replace(`/`);
    }
    if (guild_id) {
      // Redirect to the /community page with the guild_id as a query parameter
      router.replace(`/community/${guild_id}`);
    }
  }, [guild_id, error, router]);

  if (error) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh" 
    >
      <CircularProgress /> {}
      <p style={{ marginTop: "16px", fontSize: "1.2rem" }}>Creating community...</p>
    </Box>
  );
};

const FetchCreatedCommunityPage = () => {
  return (
    <Suspense fallback={<p>Taking longer than expected...</p>}>
      <FetchCreatedCommunity />
    </Suspense>
  );
};

export default FetchCreatedCommunityPage;
