import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function Login() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!phone || !password) {
            return Alert.alert('Error', 'Please fill all fields');
        }
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { phone, password });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            router.replace('/tabs/dashboard');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>🚀 GigInsura</Text>
            <Text style={s.subtitle}>Sign in to your account</Text>

            <TextInput
                style={s.input}
                placeholder="Phone Number"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={s.input}
                placeholder="Password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Sign In →</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={s.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1, padding: 24, backgroundColor: '#0f172a',
        justifyContent: 'center'
    },
    title: {
        fontSize: 32, fontWeight: 'bold', color: '#fff',
        textAlign: 'center', marginBottom: 8
    },
    subtitle: { color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
    input: {
        backgroundColor: '#1e293b', color: '#fff', padding: 14,
        borderRadius: 10, marginBottom: 12, fontSize: 15
    },
    btn: {
        backgroundColor: '#6366f1', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 8
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    link: { color: '#6366f1', textAlign: 'center', marginTop: 20 },
});