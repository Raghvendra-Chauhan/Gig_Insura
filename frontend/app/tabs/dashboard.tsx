import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [policy, setPolicy] = useState<any>(null);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [totalPaid, setTotalPaid] = useState(0);
    const [refresh, setRefresh] = useState(false);

    const load = useCallback(async () => {
        const u = await AsyncStorage.getItem('user');
        if (u) setUser(JSON.parse(u));

        try {
            const r = await api.get('/policy/active');
            setPolicy(r.data.policy);
        } catch { setPolicy(null); }

        try {
            const r = await api.get('/payout/my');
            setPayouts(r.data.payouts || []);
            setTotalPaid(r.data.totalPaid || 0);
        } catch { }
    }, []);

    useEffect(() => { load(); }, []);

    const onRefresh = async () => {
        setRefresh(true);
        await load();
        setRefresh(false);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        router.replace('/auth/login');
    };

    return (
        <ScrollView
            style={s.container}
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>

            {/* Header */}
            <View style={s.header}>
                <View>
                    <Text style={s.greeting}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
                    <Text style={s.sub}>{user?.delivery_platform?.toUpperCase()} Partner</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <Text style={s.logout}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Coverage Card */}
            <View style={[s.card, policy ? s.green : s.red]}>
                <Text style={s.cardLabel}>Coverage Status</Text>
                <Text style={s.cardVal}>
                    {policy
                        ? `✅ ${policy.plan_type?.toUpperCase()} — Active`
                        : '❌ No Active Coverage'}
                </Text>
                {policy && (
                    <Text style={s.cardSub}>
                        Up to ₹{policy.payout_cap} | Expires {new Date(policy.coverage_week_end).toDateString()}
                    </Text>
                )}
                {!policy && (
                    <TouchableOpacity
                        style={s.getBtn}
                        onPress={() => router.push('/tabs/policy')}>
                        <Text style={s.getBtnText}>Get Coverage →</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Earnings Protected */}
            <View style={s.card}>
                <Text style={s.cardLabel}>Total Earnings Protected</Text>
                <Text style={s.amount}>₹{totalPaid.toFixed(0)}</Text>
                <Text style={s.cardSub}>{payouts.length} payout(s) received</Text>
            </View>

            {/* Navigation Buttons */}
            <View style={s.row}>
                <TouchableOpacity
                    style={s.navBtn}
                    onPress={() => router.push('/tabs/policy')}>
                    <Text style={s.navIcon}>📋</Text>
                    <Text style={s.navText}>My Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.navBtn}
                    onPress={() => router.push('/tabs/claims')}>
                    <Text style={s.navIcon}>⚡</Text>
                    <Text style={s.navText}>My Claims</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Payouts */}
            {payouts.length > 0 && (
                <>
                    <Text style={s.sectionTitle}>Recent Payouts</Text>
                    {payouts.slice(0, 5).map((p, i) => (
                        <View key={i} style={s.payoutRow}>
                            <View>
                                <Text style={s.payoutAmt}>₹{p.amount}</Text>
                                <Text style={s.payoutSub}>{p.event_type} · {p.zone}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={s.payoutStatus}>
                                    {p.payout_status === 'success' ? '✅ Paid' : '⏳ Pending'}
                                </Text>
                                <Text style={s.payoutDate}>
                                    {new Date(p.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 48, marginBottom: 24
    },
    greeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
    sub: { color: '#94a3b8', marginTop: 2 },
    logout: { color: '#ef4444', fontSize: 14 },
    card: {
        backgroundColor: '#1e293b', borderRadius: 16,
        padding: 20, marginBottom: 14
    },
    green: { borderLeftWidth: 4, borderLeftColor: '#22c55e' },
    red: { borderLeftWidth: 4, borderLeftColor: '#ef4444' },
    cardLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 6 },
    cardVal: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cardSub: { color: '#64748b', fontSize: 12, marginTop: 4 },
    amount: { color: '#22c55e', fontSize: 36, fontWeight: 'bold' },
    getBtn: {
        backgroundColor: '#6366f1', padding: 10, borderRadius: 8,
        marginTop: 12, alignItems: 'center'
    },
    getBtnText: { color: '#fff', fontWeight: 'bold' },
    row: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    navBtn: {
        flex: 1, backgroundColor: '#1e293b', borderRadius: 16,
        padding: 20, alignItems: 'center'
    },
    navIcon: { fontSize: 28, marginBottom: 8 },
    navText: { color: '#fff', fontWeight: 'bold' },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    payoutRow: {
        backgroundColor: '#1e293b', borderRadius: 12, padding: 14,
        marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between'
    },
    payoutAmt: { color: '#22c55e', fontWeight: 'bold', fontSize: 16 },
    payoutSub: { color: '#64748b', fontSize: 11, marginTop: 2 },
    payoutStatus: { color: '#fff', fontSize: 13 },
    payoutDate: { color: '#64748b', fontSize: 11, marginTop: 2 },
});