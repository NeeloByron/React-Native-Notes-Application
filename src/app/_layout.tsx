import { Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
  // Navigation for the screens 
  return <Stack screenOptions={{ headerShown: false }} />;
}