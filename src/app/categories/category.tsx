import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router, useFocusEffect, useLocalSearchParams, } from "expo-router";
import { getCurrentUser } from "@/lib/auth";
import { getNotesForUser, type NoteCategory } from "@/lib/notes";

const categories: Record<string, NoteCategory | undefined> = {
  work: "Work",
  study: "Study",
  personal: "Personal",
};

export default function CategoryScreen() {
  const { category: categoryParam } =
    useLocalSearchParams<{ category?: string }>();

  const category =
    typeof categoryParam === "string"
      ? categories[categoryParam.toLowerCase()]
      : undefined;

  const [notes, setNotes] = useState<Awaited<ReturnType<typeof getNotesForUser>>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadNotes() {
        setIsLoading(true);

        try {
          const user = await getCurrentUser();

          if (!user) {
            router.replace("/welcome");
            return;
          }

          const userNotes = await getNotesForUser(user.id);

          if (isActive && category) {
            setNotes(userNotes.filter((note) => note.category === category));
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      }

      loadNotes();

      return () => {
        isActive = false;
      };
    }, [category])
  );

  if (!category) {
    return <Redirect href="/home" />;
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#efede9]">
        <ActivityIndicator color="#ffad2f" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#efede9]">
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        ListHeaderComponent={
          <View className="mb-6">
            <Pressable onPress={() => router.back()} className="mb-6 self-start">
              <Text className="font-medium text-[#6d6965]">‹ Back</Text>
            </Pressable>

            <Text className="text-2xl font-bold text-[#171614]">
              {category} Notes
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text className="mt-8 text-center text-[#6d6965]">
            No {category.toLowerCase()} notes yet.
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/note-editor",
                params: { noteId: item.id },
              })
            }
            className="mb-3 rounded-2xl bg-white p-4"
          >
            <Text className="font-semibold text-[#171614]">{item.title}</Text>
            <Text className="mt-2 text-[#6d6965]" numberOfLines={3}>
              {item.content}
            </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}