import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            router.replace('/tabs/dashboard');
        } else {
            router.replace('/auth/login');
        }
    };

    return (
        <View style={s.container}>
            <ActivityIndicator size="large" color="#6366f1" />
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center',
        alignItems: 'center', backgroundColor: '#0f172a'
    }
});