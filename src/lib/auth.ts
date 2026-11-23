import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";
import { deleteAllNotesForUser } from "@/lib/notes";

// The key used to identify our saved accounts.
const USERS_STORAGE_KEY = "notes_app_users";
const CURRENT_USER_STORAGE_KEY = "notes_app_current_user";

// Define the information we save for each account.
export type StoredUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

// Information we can safely return to the UI.
export type UserAccount = Omit<StoredUser, "passwordHash">;

// Give bcryptjs a cryptographically secure random generator.
bcrypt.setRandomFallback((length) => Array.from(Crypto.getRandomBytes(length)));

// Retrieve all registered accounts from the device.
async function getStoredUsers(): Promise<StoredUser[]> {
  const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);

  if (!users) {
    return [];
  }

  return JSON.parse(users) as StoredUser[];
}

// Register a new user.
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<UserAccount> {
  // Clean up the information provided by the form.
  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  // Basic validation.
  if (!cleanUsername || !cleanEmail || !password) {
    throw new Error("Please fill in all fields.");
  }

  if (cleanUsername.length < 3) {
    throw new Error("Username must contain at least 3 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  // Get the accounts already saved on the device.
  const users = await getStoredUsers();

  // Prevent someone from registering twice with the same email.
  const existingUser = users.find(
    (user) => user.email === cleanEmail
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  // Hash the password before saving it.
  const passwordHash = await bcrypt.hash(password, 12);

  // Create the new account.
  const newUser: StoredUser = {
    id: Crypto.randomUUID(),
    username: cleanUsername,
    email: cleanEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  // Save the updated account list.
  users.push(newUser);

  await AsyncStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users)
  );

  // Never return the password hash to the UI.
  const { passwordHash: _, ...safeUser } = newUser;

  return safeUser;
}

// Check a sign-in attempt against the accounts saved on this device.
export async function signInUser(
  email: string,
  password: string
): Promise<UserAccount> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error("Please enter your email and password.");
  }

  const users = await getStoredUsers();
  const user = users.find((storedUser) => storedUser.email === cleanEmail);

  if (!user) {
    throw new Error("Email or password is incorrect.");
  }

  const passwordIsCorrect = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordIsCorrect) {
    throw new Error("Email or password is incorrect.");
  }

  const { passwordHash: _, ...safeUser } = user;

  await AsyncStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(safeUser)
   );

  return safeUser;
}

export async function getCurrentUser(): Promise<UserAccount | null> {
  const savedUser = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser) as UserAccount;
}

export async function signOutUser(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}


export async function updateUserProfile(
  userId: string,
  changes: { username: string; email: string }
): Promise<UserAccount> {
  const username = changes.username.trim();
  const email = changes.email.trim().toLowerCase();

  if (!username || !email) {
    throw new Error("Please fill in all fields.");
  }

  if (username.length < 3) {
    throw new Error("Username must contain at least 3 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const users = await getStoredUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  const emailAlreadyExists = users.some(
    (user) => user.email === email && user.id !== userId
  );

  if (emailAlreadyExists) {
    throw new Error("This email address is already in use.");
  }

  users[userIndex] = {
    ...users[userIndex],
    username,
    email,
  };

  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const { passwordHash: _, ...safeUser } = users[userIndex];

  const currentUser = await getCurrentUser();

  if (currentUser?.id === userId) {
    await AsyncStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      JSON.stringify(safeUser)
    );
  }

  return safeUser;
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  if (!currentPassword || !newPassword) {
    throw new Error("Please fill in all password fields.");
  }

  if (newPassword.length < 8) {
    throw new Error("Your new password must contain at least 8 characters.");
  }

  const users = await getStoredUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  const passwordIsCorrect = await bcrypt.compare(
    currentPassword,
    users[userIndex].passwordHash
  );

  if (!passwordIsCorrect) {
    throw new Error("Your current password is incorrect.");
  }

  users[userIndex] = {
    ...users[userIndex],
    passwordHash: await bcrypt.hash(newPassword, 12),
  };

  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}


export async function deleteUserAccount(
  userId: string,
  password: string
): Promise<void> {
  if (!password) {
    throw new Error("Please enter your password to confirm deletion.");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.id !== userId) {
    throw new Error("You are not authorized to delete this account.");
  }

  const users = await getStoredUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  const passwordIsCorrect = await bcrypt.compare(
    password,
    users[userIndex].passwordHash
  );

  if (!passwordIsCorrect) {
    throw new Error("Incorrect password. Account deletion cancelled.");
  }

  // Delete all notes belonging to this user.
  await deleteAllNotesForUser(userId);

  // Remove the user account.
  const remainingUsers = users.filter((user) => user.id !== userId);

  await AsyncStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(remainingUsers)
  );

  // Clear the active session.
  await signOutUser();
}
