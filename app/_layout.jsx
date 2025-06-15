import { Slot } from "expo-router";
import SafeScreen from "@/components/SafeScreen.jsx";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";

// Load the publishable key from environment
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeScreen>
        <Slot screenOptions={{ headerShown: false }} />
      </SafeScreen>
      <StatusBar style="inverted" />
    </ClerkProvider>
  );
}
