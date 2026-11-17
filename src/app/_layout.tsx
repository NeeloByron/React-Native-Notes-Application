import { Stack } from "expo-router";

export default function RootLayout() {
  // Navigation for the screens we will add later.
  return <Stack screenOptions={{ headerShown: false }} />;
}