import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, ActivityIndicator, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const PLATFORMS = ['zomato', 'swiggy', 'blinkit', 'zepto'];

export default function Register() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        password: '',
        city: '',
        delivery_platform: 'zomato',
        delivery_zone: '',
        weekly_income_baseline: '',
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
            Alert.alert('Registration Failed', e.response?.data?.message || 'Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { key: 'name',                    label: 'FULL NAME',              keyboard: 'default',  secure: false },
        { key: 'phone',                   label: 'MOBILE NUMBER',          keyboard: 'phone-pad', secure: false },
        { key: 'password',                label: 'PASSWORD',               keyboard: 'default',  secure: true  },
        { key: 'city',                    label: 'CITY',                   keyboard: 'default',  secure: false },
        { key: 'delivery_zone',           label: 'DELIVERY ZONE',          keyboard: 'default',  secure: false },
        { key: 'weekly_income_baseline',  label: 'WEEKLY INCOME (RS.)',    keyboard: 'numeric',  secure: false },
    ];

    return (
        <ScrollView style={s.scroll} contentContainerStyle={s.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={s.back}>BACK</Text>
                </TouchableOpacity>
            </View>

            <View style={s.brand}>
                <View style={s.logoMark} />
                <Text style={s.logoText}>GigInsura</Text>
                <Text style={s.tagline}>Create your worker account</Text>
            </View>

            <View style={s.section}>
                {fields.map(({ key, label, keyboard, secure }: any) => (
                    <View key={key} style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>{label}</Text>
                        <TextInput
                            style={s.input}
                            placeholder=""
                            placeholderTextColor="#2e3a50"
                            keyboardType={keyboard}
                            secureTextEntry={secure}
                            value={(form as any)[key]}
                            onChangeText={v => update(key, v)}
                        />
                    </View>
                ))}

                <View style={s.fieldGroup}>
                    <Text style={s.fieldLabel}>DELIVERY PLATFORM</Text>
                    <View style={s.chipRow}>
                        {PLATFORMS.map(p => (
                            <TouchableOpacity
                                key={p}
                                style={[s.chip, form.delivery_platform === p && s.chipOn]}
                                onPress={() => update('delivery_platform', p)}>
                                <Text style={[s.chipText, form.delivery_platform === p && s.chipTextOn]}>
                                    {p.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#0a0f1e" />
                    : <Text style={s.btnText}>CREATE ACCOUNT</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity style={s.linkBtn} onPress={() => router.push('/auth/login')}>
                <Text style={s.linkText}>Already registered? Sign in</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const s = StyleSheet.create({
    scroll: { flex: 1, backgroundColor: '#0a0f1e' },
    container: { paddingHorizontal: 28, paddingBottom: 48 },
    header: {
        paddingTop: 56,
        marginBottom: 32,
    },
    back: {
        color: '#3d4f6b',
        fontSize: 10,
        letterSpacing: 2,
    },
    brand: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoMark: {
        width: 28,
        height: 28,
        backgroundColor: '#4f7cff',
        borderRadius: 3,
        marginBottom: 12,
        transform: [{ rotate: '45deg' }],
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#e8edf5',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    tagline: {
        color: '#3d4f6b',
        fontSize: 10,
        letterSpacing: 1.5,
        marginTop: 5,
        textTransform: 'uppercase',
    },
    section: {
        borderTopWidth: 1,
        borderTopColor: '#141c2f',
        paddingTop: 24,
    },
    fieldGroup: {
        marginBottom: 20,
    },
    fieldLabel: {
        color: '#3d4f6b',
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#0f1729',
        borderWidth: 1,
        borderColor: '#1a2540',
        color: '#e8edf5',
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#1a2540',
    },
    chipOn: {
        backgroundColor: '#4f7cff',
        borderColor: '#4f7cff',
    },
    chipText: {
        color: '#3d4f6b',
        fontSize: 10,
        letterSpacing: 1.5,
        fontWeight: '600',
    },
    chipTextOn: {
        color: '#0a0f1e',
    },
    btn: {
        backgroundColor: '#4f7cff',
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 8,
    },
    btnText: {
        color: '#0a0f1e',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 3,
    },
    linkBtn: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    linkText: {
        color: '#3d4f6b',
        fontSize: 12,
        letterSpacing: 0.5,
    },
});