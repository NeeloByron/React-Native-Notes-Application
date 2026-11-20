import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { router } from "expo-router";

export function SignUpForm() {
  // remember what the user types
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Display feedback below the fields.
  const [message, setMessage] = React.useState("");
  const passwordInputRef = React.useRef<React.ComponentRef<typeof Input>>(null);

  function onEmailSubmitEditing() {
    (passwordInputRef.current as unknown as { focus: () => void } | null)?.focus();
  }

  function onSubmit() {
    setMessage("");

    // Username must contain at least 3 characters.
   if (username.trim().length < 3) {
       setMessage("Username must contain at least 3 characters.");
       return;
    }

    // require all registeration fields to be filled in.
    if (!username.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    // check the basic email format.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // apply our minimum password length.
    if (password.length < 8) {
      setMessage("Your password must contain at least 8 characters.");
      return;
    }

    // validation 
    setMessage("Details are valid. Your account has not been created yet.");
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">

        <CardHeader>
           <CardTitle className="text-center text-xl sm:text-left"> Create your account</CardTitle>
           <CardDescription className="text-center sm:text-left"> Welcome! Please fill in your details </CardDescription>
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
                       onChangeText={setUsername} />
              </View>

            <View className="gap-1.5">
              <Label htmlFor="email"> Email </Label>
              <Input
                    id="email"
                    placeholder="sam@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={email}
                    onChangeText={setEmail} /> 
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                 <Label htmlFor="password"> Password </Label>
               </View>

              <Input
                    ref={passwordInputRef as any}
                    id="password"
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={onSubmit} 
                    value={password}
                    onChangeText={setPassword} />
            </View>
             
             {/* Show validation feedback when the user presses Register. */}
              {message !== "" && (
               <Text accessibilityRole="alert" className="text-sm">{message}</Text>
               )}

            <Button className="w-full" onPress={onSubmit}>
               <Text> Register </Text>
           </Button>
          </View>


          <Text className="text-center text-sm"> Already have an account?{' '}
            <Pressable
                     onPress={() => {
                     router.navigate("/")
                }}>
              <Text className="text-sm underline underline-offset-4"> Sign in </Text>
            </Pressable>
          </Text>
          
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View>

          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
