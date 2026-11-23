
import { useEffect, useState } from "react";
import { router, Redirect } from "expo-router";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, updateUserProfile, changeUserPassword, type UserAccount, } from "@/lib/auth";

export default function ProfileScreen() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const savedUser = await getCurrentUser();

        if (savedUser) {
          setUser(savedUser);
          setUsername(savedUser.username);
          setEmail(savedUser.email);
        }
      } catch {
        setMessage("Unable to load your profile.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleUpdateProfile() {
    if (!user) return;

    setMessage("");
    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(user.id, {
        username,
        email,
      });

      setUser(updatedUser);
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!user) return;

    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Your new passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      await changeUserPassword(
        user.id,
        currentPassword,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Your password has been changed.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to change password."
      );
    } finally {
      setIsSaving(false);
    }
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
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled" >

        <Pressable onPress={() => router.back()} className="mb-6 self-start">
          <Text className="font-medium text-[#6d6965]">‹ Back</Text>
        </Pressable>

        <Text className="mb-2 text-2xl font-bold text-[#171614]">My Profile</Text>
        <Text className="mb-6 text-[#6d6965]">Manage your account information.</Text>

        <View className="rounded-2xl bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-[#171614]">Account Details</Text>

          <Text className="mb-2 text-sm font-medium text-[#6d6965]">Username</Text>
          <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    className="mb-4 rounded-xl border border-[#dedbd7] px-4 py-3 text-[#171614]"/>

          <Text className="mb-2 text-sm font-medium text-[#6d6965]">Email</Text>
          <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Email"
                    className="mb-4 rounded-xl border border-[#dedbd7] px-4 py-3 text-[#171614]"/>

          <Text className="mb-4 text-xs text-[#8a8580]">Account created: {new Date(user.createdAt).toLocaleDateString()}</Text>

          <Pressable
                     disabled={isSaving}
                     onPress={handleUpdateProfile}
                     className="min-h-12 items-center justify-center rounded-[9px] bg-[#ffad2f]">
            <Text className="font-semibold text-[#171614]">Save Profile</Text>
          </Pressable>
        </View>

        <View className="mt-5 rounded-2xl bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-[#171614]">Change Password</Text>

          {[
            {
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setter: setConfirmPassword,
            },
          ].map((field) => (
            <View key={field.label} className="mb-4">
              <Text className="mb-2 text-sm font-medium text-[#6d6965]">
                {field.label}
              </Text>
              <TextInput
                         value={field.value}
                         onChangeText={field.setter}
                         secureTextEntry
                         placeholder={field.label}
                         className="rounded-xl border border-[#dedbd7] px-4 py-3 text-[#171614]"/>
            </View>
          ))}

          <Pressable
                    disabled={isSaving}
                    onPress={handleChangePassword}
                    className="min-h-12 items-center justify-center rounded-[9px] bg-[#ffad2f]">
            <Text className="font-semibold text-[#171614]">Update Password</Text>
          </Pressable>
        </View>

        {message !== "" && (
          <Text accessibilityRole="alert" className="mt-4 text-sm text-red-600">{message}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
