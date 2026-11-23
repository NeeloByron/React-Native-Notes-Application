import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { router } from "expo-router";
import { registerUser } from "@/lib/auth";

export function SignUpForm() {
  // remember what the user types
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // Display feedback below the fields.
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const passwordInputRef = React.useRef<React.ComponentRef<typeof Input>>(null);

  function onEmailSubmitEditing() {
    (passwordInputRef.current as unknown as { focus: () => void } | null)?.focus();
  }

  async function onSubmit() {
  setMessage("");
  setIsSubmitting(true);

  if (password !== confirmPassword) {
    setMessage("Passwords do not match.");
    setIsSubmitting(false);
    return;
  }

  try {
    const user = await registerUser(username, email, password);

    setMessage(`Account created for ${user.username}. You can now sign in.`);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : "Unable to create your account."
    );
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <View className="gap-6">
      <Card className="rounded-[28px] border-0 bg-white py-6 shadow-none">

        <CardHeader>
           <CardTitle className="text-center text-xl font-bold text-[#171614]"> Create your account</CardTitle>
           <CardDescription className="text-center text-[#6d6965]"> Welcome! Please fill in your details </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">

            {/* Username field */}
            <View className="gap-1.5">
              <Label htmlFor="username">Username</Label>
                <Input
                       id="username"
                       placeholder="Enter your username"
                       autoComplete="username"
                       autoCapitalize="none"
                       autoCorrect={false} 
                       value={username}
                       onChangeText={setUsername} 
                       className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                       placeholderTextColor="#8a8580" />
              </View>

            <View className="gap-1.5">
              <Label htmlFor="email"> Email </Label>
              <Input
                    id="email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={email}
                    onChangeText={setEmail} 
                    className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                    placeholderTextColor="#8a8580" />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                 <Label htmlFor="password"> Password </Label>
               </View>

              <Input
                    ref={passwordInputRef as any}
                    id="password"
                    placeholder="********"
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={onSubmit} 
                    value={password}
                    onChangeText={setPassword} 
                    className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                    placeholderTextColor="#8a8580" />
            </View>
             
             <View className="gap-1.5">
               <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <Input
                        id="confirmPassword"
                        placeholder="********"
                        secureTextEntry
                        returnKeyType="send"
                        onSubmitEditing={onSubmit}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                        placeholderTextColor="#8a8580"/>
              </View>
             
             {/* Show validation feedback when the user presses Register. */}
              {message !== "" && (
               <Text accessibilityRole="alert" className="text-sm">{message}</Text>
               )}

            <Button className="min-h-12 w-full rounded-[9px] bg-[#ffad2f] active:bg-[#f4a62a]" onPress={onSubmit}>
               <Text className="font-semibold text-[#171614]"> {isSubmitting ? "Creating account..." : "Register"} </Text>
           </Button>
          </View>


          <Text className="text-center text-sm"> Already have an account?{' '}
            <Pressable
                     onPress={() => {
                     router.navigate("/sign-in")
                }}>
              <Text className="text-sm font-semibold text-[#f4a62a] underline underline-offset-4"> Sign in </Text>
            </Pressable>
          </Text>

        </CardContent>
      </Card>
    </View>
  );
}
