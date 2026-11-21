import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#efede9]">
      <View className="mx-auto my-3 flex-1 w-full max-w-[430px] rounded-[32px] bg-white px-6 pb-6 pt-4">
        <Pressable
                   accessibilityRole="button"
                   onPress={() => router.push("/sign-in")}
                   className="self-end p-2">
          <Text className="text-xs font-medium text-[#77736e]">SKIP</Text>
        </Pressable>

        <View
             accessibilityElementsHidden
             className="relative mb-4 mt-1 h-[260px] items-center justify-center">

          <View className="absolute h-[174px] w-[138px] translate-x-[18px] rotate-[10deg] rounded-xl bg-[#f7c95a]" />
            <View className="-rotate-[6deg] justify-center gap-[13px] rounded-xl border-2 border-[#27231f] bg-white p-5">
            <View className="mb-1 h-2 w-[48%] rounded-full bg-[#f4a62a]" />
            <View className="h-[5px] w-full rounded-full bg-[#e7e3de]" />
            <View className="h-[5px] w-full rounded-full bg-[#e7e3de]" />
            <View className="h-[5px] w-[72%] rounded-full bg-[#e7e3de]" />
          </View>

          <View className="absolute right-[24%] top-8 h-[30px] w-[30px] rounded-full bg-[#f4a62a]" />
          <View className="absolute left-[22%] top-[82px] h-3 w-3 rounded-full bg-[#f5d77e]" />
          <View className="absolute bottom-[55px] right-[22%] h-[9px] w-[9px] rounded-full bg-[#f3b8a2]" />
        </View>

        <View className="items-center px-1">
          <Text className="mb-3 text-center text-[21px] font-bold text-[#171614]"> A little space for big ideas</Text>
           <Text className="text-center text-[15px] leading-6 text-[#6d6965]">
             Keep your work, study, and personal notes together. Capture a
             thought whenever it comes to you.
           </Text>
        </View>

        <View
             accessibilityLabel="Page 1 of 3"
             className="mt-auto mb-[22px] flex-row items-center justify-center gap-2.5">
        </View>

        <View className="flex-row gap-3 border-t border-[#dedbd7] pt-5">
          <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push("/sign-up")}
                    className="min-h-12 flex-1 items-center justify-center rounded-[9px] bg-[#ffad2f]" >
            <Text className="text-[15px] font-semibold text-[#171614]">Sign Up</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/sign-in")}
            className="min-h-12 flex-1 items-center justify-center rounded-[9px] bg-[#ffad2f]">
            <Text className="text-[15px] font-semibold text-[#171614]">Log In</Text>
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-[11px] text-[#8a8580]">Terms of Use  |  Privacy Policy </Text>
      </View>
    </SafeAreaView>
  );
}