import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="tabs/dashboard" />
            <Stack.Screen name="tabs/policy" />
            <Stack.Screen name="tabs/claims" />
            <Stack.Screen name="tabs/admin" />
        </Stack>
    );
}