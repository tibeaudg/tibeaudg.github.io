'use client';  // Voeg deze regel bovenaan toe



import { useEffect, useState } from "react";

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return null;
  }

  // If no session exists, redirect to the sign-in page
  if (!session) {
    return <Redirect href="/auth/sign-in" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
