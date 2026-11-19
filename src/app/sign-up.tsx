import { SignUpForm } from "@/components/sign-up-form";
import { KeyboardAvoidingView, Platform, ScrollView, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  return (
    // Keeps the content away from the phone's system bars.
    <SafeAreaView className="flex-1 bg-white">
        
      {/* Make space when the keyboard opens. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} >

        {/* Allow scrolling on smaller screens. */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
                                   flexGrow: 1,
                                   justifyContent: "center",
                                   paddingHorizontal: 20,
                                   paddingVertical: 24,
                              }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false} >

          <View className="w-full max-w-md self-center">
            <SignUpForm />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}