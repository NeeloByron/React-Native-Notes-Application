import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import "../global.css"

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser();
      const currentRoute = segments[0];

      const publicRoutes = ["welcome", "sign-in", "sign-up"];
      const isPublicRoute = publicRoutes.includes(currentRoute ?? "");

      if (!user && !isPublicRoute) {
        router.replace("/welcome");
      } else if (user && isPublicRoute) {
        router.replace("/home");
      }

      setIsReady(true);
    }

    checkAuth();
  }, [segments]);

  if (!isReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}