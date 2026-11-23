import { getCurrentUser, signOutUser, type UserAccount } from "@/lib/auth";
import { getNotesForUser, type Note, type NoteCategory } from "@/lib/notes";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
   const categoryCounts: Record<"All" | NoteCategory, number> = {
                                                                  All: notes.length,
                                                                  Work: notes.filter((note) => note.category === "Work").length,
                                                                  Study: notes.filter((note) => note.category === "Study").length,
                                                                  Personal: notes.filter((note) => note.category === "Personal").length,
                                                                  };
  
   const normalizedQuery = searchQuery.trim().toLowerCase();

   const visibleNotes = notes.filter((note) =>
           `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery)
   )
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
          <View className="flex-row items-center justify-between">
      <Text numberOfLines={1} className="flex-1 pr-3 text-2xl font-bold text-[#171614]"> Hi, {user.username}</Text>
       <Pressable
                 accessibilityRole="button"
                 accessibilityLabel="Open profile"
                 onPress={() => setIsMenuOpen(true)}
                className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffad2f]" >
         <Text className="font-bold text-[#171614]">{user.username.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U"}</Text>
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
                      onPress={() => {
              if (category === "All") {
                   setSearchQuery("");
                   return;
               }

          router.push({pathname: "/categories/category", params: { category: category.toLowerCase() },});
          }}
          className={`rounded-full px-4 py-2 ${category === "All" ? "bg-[#ffad2f]" : "bg-white"}`}>
        <Text className="text-sm font-medium text-[#171614]">{category} ({category === "All" ? categoryCounts.All : categoryCounts[category]})</Text>
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
           <Text className="text-lg font-semibold text-[#171614]"> {notes.length === 0 ? "No notes yet" : searchQuery.trim() ? "No matching notes" : "No notes found"} </Text>
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

     {/* Side menu with account details, app navigation, and sign-out. */}
      <Modal
            visible={isMenuOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsMenuOpen(false)}>
    <View className="flex-1 flex-row bg-black/30">
      <SafeAreaView className="h-full w-[82%] max-w-[320px] bg-white px-5 py-6">
        <View className="flex-row items-center border-b border-[#eee] pb-5">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#ffad2f]">
            <Text className="font-bold text-[#171614]">
              {user.username.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U"}
           </Text>
        </View>

         <View className="flex-1">
           <Text className="font-semibold text-[#171614]">{user.username}</Text>
           <Text className="text-xs text-[#6d6965]">{user.email}</Text>
         </View>
       </View>

      <View className="mt-5 gap-1">
        <Pressable
                  onPress={() => {
                  setIsMenuOpen(false);
                  router.replace("/home");}}
          className="flex-row items-center rounded-lg px-3 py-3">
          <Text className="w-8 text-[#6d6965]">⌂</Text>
          <Text className="text-[#171614]">My Notes</Text>
        </Pressable>

        {(["Work", "Study", "Personal"] as const).map((category) => (
          <Pressable
            key={category}
            onPress={() => {
              setIsMenuOpen(false);
              router.push({
                pathname: "/categories/category",
                params: { category: category.toLowerCase() },
              });
            }}
            className="flex-row items-center rounded-lg px-3 py-3" >
            <Text className="w-8 text-[#6d6965]">▤</Text>
            <Text className="text-[#171614]">{category}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => {
            setIsMenuOpen(false);
            router.push("/profile");
          }}
          className="flex-row items-center rounded-lg px-3 py-3" >
          <Text className="w-8 text-[#6d6965]">⚙</Text>
          <Text className="text-[#171614]">Profile</Text>
        </Pressable>
      </View>

      <Pressable
               accessibilityRole="button"
               onPress={handleSignOut}
               className="mt-auto flex-row items-center border-t border-[#eee] px-3 py-4">
        <Text className="w-8 text-[#6d6965]">↪</Text>
        <Text className="font-medium text-[#171614]">Sign Out</Text>
      </Pressable>
    </SafeAreaView>

     <Pressable
               accessibilityRole="button"
               accessibilityLabel="Close menu"
               onPress={() => setIsMenuOpen(false)}
               className="flex-1" />
     </View>
    </Modal>
    </SafeAreaView>
  );
}
