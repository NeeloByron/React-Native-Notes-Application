import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const NOTES_STORAGE_KEY = "notes_app_notes";

export type NoteCategory = "Work" | "Study" | "Personal";

export type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: NoteCategory;
  createdAt: string;
  updatedAt: string;
};

export type NoteInput = Pick<Note, "title" | "content" | "category">;

async function getStoredNotes(): Promise<Note[]> {
  const savedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
  return savedNotes ? (JSON.parse(savedNotes) as Note[]) : [];
}

async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

export async function getNotesForUser(userId: string): Promise<Note[]> {
  const notes = await getStoredNotes();

  return notes
    .filter((note) => note.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createNote(
  userId: string,
  input: NoteInput
): Promise<Note> {
  const title = input.title.trim();

  if (!title) {
    throw new Error("Please enter a note title.");
  }

  const now = new Date().toISOString();

  const note: Note = {
    id: Crypto.randomUUID(),
    userId,
    title,
    content: input.content.trim(),
    category: input.category,
    createdAt: now,
    updatedAt: now,
  };

  const notes = await getStoredNotes();
  await saveNotes([note, ...notes]);

  return note;
}

export async function updateNote(
  userId: string,
  noteId: string,
  changes: Partial<NoteInput>
): Promise<Note> {
  const notes = await getStoredNotes();
  const noteIndex = notes.findIndex(
    (note) => note.id === noteId && note.userId === userId
  );

  if (noteIndex === -1) {
    throw new Error("Note not found.");
  }

  const currentNote = notes[noteIndex];
  const title = changes.title === undefined
    ? currentNote.title
    : changes.title.trim();

  if (!title) {
    throw new Error("Please enter a note title.");
  }

  const updatedNote: Note = {
    ...currentNote,
    title,
    content: changes.content?.trim() ?? currentNote.content,
    category: changes.category ?? currentNote.category,
    updatedAt: new Date().toISOString(),
  };

  notes[noteIndex] = updatedNote;
  await saveNotes(notes);

  return updatedNote;
}

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<void> {
  const notes = await getStoredNotes();
  const remainingNotes = notes.filter(
    (note) => !(note.id === noteId && note.userId === userId)
  );

  await saveNotes(remainingNotes);
}