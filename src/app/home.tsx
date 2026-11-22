import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View,  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, signOutUser, type UserAccount, } from "@/lib/auth";
import { getNotesForUser, type Note } from "@/lib/notes";

export default function HomeScreen() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHome() {
      try {
        const savedUser = await getCurrentUser();

        if (!isMounted) return;
        setUser(savedUser);

        if (savedUser) {
          const savedNotes = await getNotesForUser(savedUser.id);
          if (isMounted) setNotes(savedNotes);
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHome();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSignOut() {
    await signOutUser();
    router.replace("/welcome");
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#efede9]">
        <ActivityIndicator color="#ffad2f" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efede9]">
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        ListHeaderComponent={
          <View className="mb-6">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-2xl font-bold text-[#171614]">  Welcome back, {user.username}!</Text>
              </View>

              <Pressable
                         accessibilityRole="button"
                         onPress={handleSignOut}
                         className="rounded-[9px] bg-[#ffad2f] px-4 py-2">
                <Text className="font-semibold text-[#171614]">Sign Out</Text>
              </Pressable>
            </View>

            <Text className="mt-8 text-xl font-bold text-[#171614]"> My Notes</Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-8 text-center text-[#6d6965]">No notes yet. Your notes will appear here.</Text>
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-[#171614]">{item.title}</Text>
              <Text className="text-xs text-[#8a8580]">{item.category}</Text>
            </View>

            <Text className="mt-2 text-[#6d6965]" numberOfLines={3}>{item.content}</Text>
            <Text className="mt-3 text-xs text-[#8a8580]">Edited {new Date(item.updatedAt).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}