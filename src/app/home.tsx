import { getCurrentUser, signOutUser, type UserAccount } from "@/lib/auth";
import { getNotesForUser, type Note, type NoteCategory } from "@/lib/notes";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"All" | NoteCategory>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      async function loadHome() {
        setIsLoading(true);

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
    }, []),
  );

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

  
   const normalizedQuery = searchQuery.trim().toLowerCase();

   const categoryCounts = {
                         All: notes.length,
                         Work: notes.filter((note) => note.category === "Work").length,
                         Study: notes.filter((note) => note.category === "Study").length,
                         Personal: notes.filter((note) => note.category === "Personal").length,
   };

    const visibleNotes = notes.filter((note) => {
    const matchesSearch = `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  })
  .sort((a, b) => {
    const dateOrder = a.updatedAt.localeCompare(b.updatedAt);
    return sortOrder === "newest" ? -dateOrder : dateOrder;
  });


  return (
    <SafeAreaView className="flex-1 bg-[#efede9]">
      <FlatList
                data={visibleNotes}
                keyExtractor={(note) => note.id}
                contentContainerStyle={{ padding: 24, flexGrow: 1 }}
           ListHeaderComponent={
          <View className="mb-6">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-2xl font-bold text-[#171614]">{" "}Welcome back, {user.username}!</Text>
              </View>

              <Pressable
                         accessibilityRole="button"
                         onPress={() => router.push("/profile")}
                         className="rounded-[9px] bg-white px-4 py-2">
               <Text className="font-semibold text-[#171614]">Profile</Text>
              </Pressable>

               <Pressable
                         accessibilityRole="button"
                         onPress={handleSignOut}
                         className="rounded-[9px] bg-[#ffad2f] px-4 py-2">
                <Text className="font-semibold text-[#171614]">Sign Out</Text>
              </Pressable>
            </View>

            <Text className="mt-8 text-xl font-bold text-[#171614]">{" "} My Notes  </Text>

            <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search notes"
                      placeholderTextColor="#8a8580"
                      className="mt-4 rounded-xl border border-[#dedbd7] bg-white px-4 py-3 text-[#171614]" />

              <View className="mt-4 flex-row flex-wrap gap-2">
               {(["All", "Work", "Study", "Personal"] as const).map((category) => (
                 <Pressable
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            className={`rounded-full px-4 py-2 ${
                             selectedCategory === category ? "bg-[#ffad2f]" : "bg-white"}`}>
           <Text className="text-sm font-medium text-[#171614]">{category} ({categoryCounts[category]})</Text>
         </Pressable>
        ))}
    </View>

    <View className="mt-4 flex-row items-center gap-2">
  <Text className="mr-1 text-sm text-[#6d6965]">Sort:</Text>

    {(["newest", "oldest"] as const).map((order) => (
       <Pressable
                 key={order}
                 onPress={() => setSortOrder(order)}
                 className={`rounded-full px-4 py-2 ${
                            sortOrder === order ? "bg-[#ffad2f]" : "bg-white"}`}>
      <Text className="text-sm font-medium text-[#171614]">{order === "newest" ? "Newest" : "Oldest"}</Text>
     </Pressable>
     ))}
    </View>

    <Pressable
             accessibilityRole="button"
             onPress={() => router.push("/note-editor")}
             className="mt-4 self-start rounded-[9px] bg-[#ffad2f] px-5 py-3">
      <Text className="font-semibold text-[#171614]">New Note</Text>
       </Pressable>
          </View>
        }
       ListEmptyComponent={
        <View className="mt-10 items-center">
           <Text className="text-lg font-semibold text-[#171614]"> {notes.length === 0 ? "No notes yet" : searchQuery.trim() ? "No matching notes" : `No ${selectedCategory} notes`} </Text>
           <Text className="mt-2 text-center text-[#6d6965]">{notes.length === 0 ? "Create your first note to get started." : "Try changing your search or selecting another category."}</Text>
        </View>
       }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/note-editor",
                params: { noteId: item.id },
              })
            }
            className="mb-3 rounded-2xl bg-white p-4">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-[#171614]">{item.title}</Text>
              <Text className="text-xs text-[#8a8580]">{item.category}</Text>
            </View>

            <Text className="mt-2 text-[#6d6965]" numberOfLines={3}>{item.content}</Text>
            <Text className="mt-3 text-xs text-[#8a8580]"> Created {new Date(item.createdAt).toLocaleDateString()}
                {item.updatedAt !== item.createdAt &&` · Edited ${new Date(item.updatedAt).toLocaleDateString()}`} </Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
