import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser } from "@/lib/auth";
import { createNote, deleteNote, getNotesForUser, updateNote, type NoteCategory } from "@/lib/notes";

const categories: NoteCategory[] = ["Work", "Study", "Personal"];

export default function NoteEditorScreen() {
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Personal");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(Boolean(noteId));
   
  useEffect(() => {
  if (!noteId) return;

  let isActive = true;

  async function loadNote() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/welcome");
        return;
      }

      const notes = await getNotesForUser(user.id);
      const note = notes.find((savedNote) => savedNote.id === noteId);

      if (!note) {
        if (isActive) setMessage("Note not found.");
        return;
      }

      if (isActive) {
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
      }
    } catch {
      if (isActive) setMessage("Unable to load this note.");
    } finally {
      if (isActive) setIsLoadingNote(false);
    }
  }

  loadNote();

  return () => {
    isActive = false;
  };
}, [noteId]);

  async function handleSave() {
    setMessage("");
    setIsSaving(true);

    try {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/welcome");
        return;
      }

      if (noteId) {
        await updateNote(user.id, noteId, { title, content, category });
      } else {
        await createNote(user.id, { title, content, category });
      }
      router.back();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
  if (!noteId) return;

  try {
    const user = await getCurrentUser();

    if (!user) {
      router.replace("/welcome");
      return;
    }

    await deleteNote(user.id, noteId);
    router.back();
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : "Unable to delete note."
    );
  }
}

   function confirmDelete() {
     Alert.alert("Delete note?", "This note will be permanently deleted.", [
       { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
          void handleDelete();
         },
       },
    ]);
   }

  if (isLoadingNote) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#efede9]">
      <ActivityIndicator color="#ffad2f" />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView className="flex-1 bg-[#efede9]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled">

          <Pressable onPress={() => router.back()} className="mb-6 self-start">
            <Text className="text-base font-medium text-[#6d6965]"> ‹ Back </Text>
          </Pressable>

          <Text className="font-semibold text-[#171614]">{noteId ? "Update Note" : "Save Note"}</Text>

          <TextInput
                     value={title}
                     onChangeText={setTitle}
                     placeholder="Title"
                     placeholderTextColor="#8a8580"
                     className="mb-4 rounded-xl border border-[#dedbd7] bg-white px-4 py-4 text-lg font-semibold text-[#171614]"/>

          <Text className="mb-3 font-medium text-[#6d6965]">Category</Text>

          <View className="mb-6 flex-row gap-2">
            {categories.map((item) => (
              <Pressable
                         key={item}
                         onPress={() => setCategory(item)}
                         className={`rounded-full px-4 py-2 ${
                         category === item ? "bg-[#ffad2f]" : "bg-white"}`}>
                <Text className="text-sm font-medium text-[#171614]">{item}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Write your note..."
                    placeholderTextColor="#8a8580"
                    multiline
                    textAlignVertical="top"
                    className="min-h-[220px] rounded-xl border border-[#dedbd7] bg-white px-4 py-4 text-base text-[#171614]" />

          {message !== "" && (
            <Text accessibilityRole="alert" className="mt-3 text-sm text-red-600">{message}</Text>
          )}

          <Pressable
                     accessibilityRole="button"
                     disabled={isSaving}
                     onPress={handleSave}
                     className="mt-6 min-h-12 items-center justify-center rounded-[9px] bg-[#ffad2f]">
            {isSaving ? (
              <ActivityIndicator color="#171614" />
            ) : (
              <Text className="font-semibold text-[#171614]">Save</Text>
            )}
          </Pressable>

          {noteId && (
           <Pressable
                     accessibilityRole="button"
                     onPress={confirmDelete}
                     className="mt-3 min-h-12 items-center justify-center rounded-[9px] border border-red-300 bg-white">
              <Text className="font-semibold text-red-600">Delete</Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}