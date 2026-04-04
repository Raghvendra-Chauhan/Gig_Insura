import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', phone: '', password: '', city: '',
        delivery_platform: 'zomato',
        delivery_zone: '', weekly_income_baseline: '',
    });

    const update = (key: string, val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    const handleRegister = async () => {
        setLoading(true);
        try {
            const res = await api.post('/auth/register', {
                ...form,
                work_schedule: 'full-day',
                weekly_income_baseline: parseFloat(form.weekly_income_baseline),
            });
            await AsyncStorage.setItem('token', res.data.token);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            router.replace('/tabs/dashboard');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={s.container}>
            <Text style={s.title}>🚀 Join GigInsura</Text>
            <Text style={s.subtitle}>Protect your weekly income</Text>

            {[
                { key: 'name', label: 'Full Name' },
                { key: 'phone', label: 'Phone Number', keyboard: 'phone-pad' },
                { key: 'password', label: 'Password', secure: true },
                { key: 'city', label: 'City (e.g. Delhi)' },
                { key: 'delivery_zone', label: 'Zone (e.g. delhi-south)' },
                { key: 'weekly_income_baseline', label: 'Weekly Earnings ₹', keyboard: 'numeric' },
            ].map(({ key, label, keyboard, secure }: any) => (
                <TextInput
                    key={key}
                    style={s.input}
                    placeholder={label}
                    placeholderTextColor="#64748b"
                    keyboardType={keyboard || 'default'}
                    secureTextEntry={secure || false}
                    value={(form as any)[key]}
                    onChangeText={v => update(key, v)}
                />
            ))}

            <Text style={s.label}>Platform</Text>
            <View style={s.row}>
                {['zomato', 'swiggy'].map(p => (
                    <TouchableOpacity
                        key={p}
                        style={[s.chip, form.delivery_platform === p && s.chipOn]}
                        onPress={() => update('delivery_platform', p)}>
                        <Text style={form.delivery_platform === p ? s.chipTextOn : s.chipText}>
                            {p[0].toUpperCase() + p.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnText}>Create Account →</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={s.link}>Already have an account? Sign in</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 60 },
    subtitle: { color: '#94a3b8', marginBottom: 32 },
    input: {
        backgroundColor: '#1e293b', color: '#fff', padding: 14,
        borderRadius: 10, marginBottom: 12, fontSize: 15
    },
    label: { color: '#94a3b8', marginBottom: 8 },
    row: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    chip: {
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
        borderWidth: 1, borderColor: '#334155'
    },
    chipOn: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
    chipText: { color: '#94a3b8' },
    chipTextOn: { color: '#fff', fontWeight: 'bold' },
    btn: {
        backgroundColor: '#6366f1', padding: 16,
        borderRadius: 12, alignItems: 'center', marginTop: 8
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    link: { color: '#6366f1', textAlign: 'center', marginTop: 20, marginBottom: 40 },
});