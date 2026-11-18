import { KeyboardAvoidingView, Text, ScrollView, Platform, View } from "react-native";
import { SignUpForm } from "@/components/sign-up-form";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
      <SafeAreaView className="flex-1 bg-white">
      {/* Adjust the available space when the keyboard opens. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Allow scrolling when the form is taller than the screen. */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Fill mobile width and limit the width on larger screens. */}
          <View className="w-full max-w-md self-center">
            <SignUpForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
