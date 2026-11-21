import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, type TextInput, View } from 'react-native';
import { router } from "expo-router";

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    (passwordInputRef.current as unknown as { focus: () => void } | null)?.focus();
  }

  function onSubmit() {
    // TODO: Submit form and navigate to protected screen if successful
  }

  return (
    <View className="gap-6">
      <Card className="rounded-[28px] border-0 bg-white py-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-[#171614]"> Sign in to your app </CardTitle>
          <CardDescription className="text-center text-[#6d6965]"> Welcome back! Please sign in to continue </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">

            <View className="gap-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#6d6965]" >Email</Label>
              <Input
                     id="email"
                     placeholder="sam@example.com"
                     keyboardType="email-address"
                     autoComplete="email"
                     autoCapitalize="none"
                     onSubmitEditing={onEmailSubmitEditing}
                     returnKeyType="next"
                     submitBehavior="submit" 
                     className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                     placeholderTextColor="#8a8580" />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                 <Button
                           variant="link"
                           size="sm"
                           className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                           onPress={() => {
                        // TODO: Navigate to forgot password screen
                     }}>
                  <Text className="font-normal leading-4"> Forgot your password? </Text>
                </Button>
              </View>

              <Input
                     ref={passwordInputRef as any}
                     id="password"
                     placeholder="********"
                     secureTextEntry
                     returnKeyType="send"
                     onSubmitEditing={onSubmit} 
                     className="h-12 rounded-lg border-[#dedbd7] bg-white text-[#171614]"
                     placeholderTextColor="#8a8580" />
            </View>

            <Button className="min-h-12 w-full rounded-[9px] bg-[#ffad2f] active:bg-[#f4a62a]" onPress={onSubmit}>
              <Text className="font-semibold text-[#171614]">Continue</Text>
            </Button>
          </View>
          <Text className="text-center text-sm"> Don&apos;t have an account?{' '}
            <Pressable onPress={() => { router.navigate("/sign-up")}}>
              <Text className="text-sm font-semibold text-[#f4a62a] underline underline-offset-4"> Sign up </Text>
            </Pressable>
          </Text>

        </CardContent>
      </Card>
    </View>
  );
}
