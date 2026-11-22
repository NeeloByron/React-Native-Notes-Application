import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getCurrentUser } from "@/lib/auth";

type StartRoute = "/welcome" | "/home";

export default function Index() {
  const [startRoute, setStartRoute] = useState<StartRoute | null>(null);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setStartRoute(user ? "/home" : "/welcome");
        }
      })
      .catch(() => {
        if (isMounted) {
          setStartRoute("/welcome");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!startRoute) {
    return (
      <View className="flex-1 items-center justify-center bg-[#efede9]">
        <ActivityIndicator color="#ffad2f" />
      </View>
    );
  }

  return <Redirect href={startRoute} />;
}