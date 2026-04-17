import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator, StatusBar
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
            return Alert.alert('Validation Error', 'Phone number and password are required.');
        }
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { phone, password });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            router.replace('/tabs/dashboard');
        } catch (e: any) {
            Alert.alert('Authentication Failed', e.response?.data?.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={s.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

            <View style={s.brand}>
                <View style={s.logoMark} />
                <Text style={s.logoText}>GigInsura</Text>
                <Text style={s.tagline}>Parametric Income Protection for Gig Workers</Text>
            </View>

            <View style={s.divider} />

            <View style={s.form}>
                <Text style={s.fieldLabel}>MOBILE NUMBER</Text>
                <TextInput
                    style={s.input}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#2e3a50"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />

                <Text style={s.fieldLabel}>PASSWORD</Text>
                <TextInput
                    style={s.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#2e3a50"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
                    {loading
                        ? <ActivityIndicator color="#0a0f1e" />
                        : <Text style={s.btnText}>SIGN IN</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity style={s.linkBtn} onPress={() => router.push('/auth/register')}>
                    <Text style={s.linkText}>Create a new account</Text>
                </TouchableOpacity>
            </View>

            <Text style={s.footer}>v1.0  —  Secured by 256-bit AES</Text>
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0f1e',
        paddingHorizontal: 28,
        justifyContent: 'center',
    },
    brand: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoMark: {
        width: 36,
        height: 36,
        backgroundColor: '#4f7cff',
        borderRadius: 4,
        marginBottom: 14,
        transform: [{ rotate: '45deg' }],
    },
    logoText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#e8edf5',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    tagline: {
        color: '#3d4f6b',
        fontSize: 11,
        letterSpacing: 1.2,
        marginTop: 6,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: '#141c2f',
        marginBottom: 36,
    },
    form: {
        gap: 4,
    },
    fieldLabel: {
        color: '#3d4f6b',
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#0f1729',
        borderWidth: 1,
        borderColor: '#1a2540',
        color: '#e8edf5',
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        letterSpacing: 0.5,
    },
    btn: {
        backgroundColor: '#4f7cff',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 24,
    },
    btnText: {
        color: '#0a0f1e',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 3,
    },
    linkBtn: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    linkText: {
        color: '#3d4f6b',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    footer: {
        color: '#1a2540',
        fontSize: 10,
        letterSpacing: 1.5,
        textAlign: 'center',
        marginTop: 48,
    },
});