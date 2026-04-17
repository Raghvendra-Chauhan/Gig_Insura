import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../../services/api';

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
    return (
        <View style={[ds.statCard, accent ? { borderTopColor: accent, borderTopWidth: 2 } : null]}>
            <Text style={ds.statValue}>{value}</Text>
            <Text style={ds.statLabel}>{label}</Text>
        </View>
    );
}

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
            style={ds.container}
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor="#4f7cff" />}>

            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

            {/* Top bar */}
            <View style={ds.topBar}>
                <View>
                    <Text style={ds.logoText}>GigInsura</Text>
                    <Text style={ds.userLine}>
                        {user?.name?.toUpperCase()}  ·  {user?.delivery_platform?.toUpperCase()}
                    </Text>
                </View>
                <View style={ds.topBarRight}>
                    {user?.role === 'admin' && (
                        <TouchableOpacity
                            style={ds.adminBtn}
                            onPress={() => router.push('/tabs/admin')}>
                            <Text style={ds.adminBtnText}>ADMIN</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={logout}>
                        <Text style={ds.logoutText}>SIGN OUT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={ds.divider} />

            {/* Coverage status */}
            <View style={[ds.coverageBlock, policy ? ds.coverageActive : ds.coverageInactive]}>
                <View style={ds.coverageLeft}>
                    <Text style={ds.coverageLabel}>COVERAGE STATUS</Text>
                    <Text style={ds.coverageValue}>
                        {policy ? `${policy.plan_type?.toUpperCase()} PLAN  —  ACTIVE` : 'NO ACTIVE COVERAGE'}
                    </Text>
                    {policy && (
                        <Text style={ds.coverageSub}>
                            Payout cap  Rs.{policy.payout_cap}  ·  Expires {new Date(policy.coverage_week_end).toDateString()}
                        </Text>
                    )}
                </View>
                <View style={ds.coverageIndicator} />
            </View>

            {!policy && (
                <TouchableOpacity style={ds.ctaBtn} onPress={() => router.push('/tabs/policy')}>
                    <Text style={ds.ctaBtnText}>GET COVERAGE</Text>
                </TouchableOpacity>
            )}

            {/* Stats row */}
            <View style={ds.statsRow}>
                <StatCard
                    label="TOTAL PROTECTED"
                    value={`Rs.${totalPaid.toFixed(0)}`}
                    accent="#4f7cff"
                />
                <StatCard
                    label="PAYOUTS RECEIVED"
                    value={payouts.length}
                    accent="#00c896"
                />
            </View>

            {/* Nav */}
            <View style={ds.navRow}>
                <TouchableOpacity
                    style={ds.navCard}
                    onPress={() => router.push('/tabs/policy')}>
                    <Text style={ds.navCardIcon}>[ P ]</Text>
                    <Text style={ds.navCardLabel}>MY POLICY</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={ds.navCard}
                    onPress={() => router.push('/tabs/claims')}>
                    <Text style={ds.navCardIcon}>[ C ]</Text>
                    <Text style={ds.navCardLabel}>MY CLAIMS</Text>
                </TouchableOpacity>
            </View>

            {/* Recent payouts */}
            {payouts.length > 0 && (
                <View style={ds.section}>
                    <Text style={ds.sectionTitle}>RECENT PAYOUTS</Text>
                    {payouts.slice(0, 5).map((p, i) => (
                        <View key={i} style={ds.payoutRow}>
                            <View style={ds.payoutRowLeft}>
                                <Text style={ds.payoutEvent}>{p.event_type?.toUpperCase()}  ·  {p.zone?.toUpperCase()}</Text>
                                <Text style={ds.payoutDate}>{new Date(p.created_at).toLocaleDateString('en-IN')}</Text>
                            </View>
                            <View style={ds.payoutRowRight}>
                                <Text style={ds.payoutAmt}>Rs.{p.amount}</Text>
                                <View style={[ds.payoutBadge, p.payout_status === 'success' ? ds.badgeGreen : ds.badgeYellow]}>
                                    <Text style={ds.payoutBadgeText}>
                                        {p.payout_status === 'success' ? 'PAID' : 'PENDING'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            <View style={ds.bottomPad} />
        </ScrollView>
    );
}

const ds = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0f1e' },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    },
    logoText: {
        fontSize: 14, fontWeight: '700', color: '#e8edf5',
        letterSpacing: 3, textTransform: 'uppercase',
    },
    userLine: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1.5, marginTop: 4 },
    topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 4 },
    adminBtn: {
        borderWidth: 1, borderColor: '#4f7cff',
        paddingHorizontal: 10, paddingVertical: 4,
    },
    adminBtnText: { color: '#4f7cff', fontSize: 9, letterSpacing: 2, fontWeight: '700' },
    logoutText: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1.5 },
    divider: { height: 1, backgroundColor: '#0f1729', marginHorizontal: 20 },

    coverageBlock: {
        marginHorizontal: 20, marginTop: 20,
        padding: 20, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1,
    },
    coverageActive: { borderColor: '#00c896', backgroundColor: 'rgba(0,200,150,0.04)' },
    coverageInactive: { borderColor: '#2a1f1f', backgroundColor: 'rgba(255,60,60,0.03)' },
    coverageLeft: { flex: 1 },
    coverageLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 6 },
    coverageValue: { color: '#e8edf5', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    coverageSub: { color: '#3d4f6b', fontSize: 11, marginTop: 6, letterSpacing: 0.3 },
    coverageIndicator: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: '#00c896', marginLeft: 12,
    },

    ctaBtn: {
        marginHorizontal: 20, marginTop: 10,
        backgroundColor: '#4f7cff', paddingVertical: 13, alignItems: 'center',
    },
    ctaBtnText: { color: '#0a0f1e', fontSize: 11, letterSpacing: 3, fontWeight: '700' },

    statsRow: {
        flexDirection: 'row', marginHorizontal: 20,
        marginTop: 20, gap: 12,
    },
    statCard: {
        flex: 1, backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        padding: 16,
    },
    statValue: { color: '#e8edf5', fontSize: 22, fontWeight: '700', marginBottom: 4 },
    statLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2 },

    navRow: {
        flexDirection: 'row', marginHorizontal: 20,
        marginTop: 12, gap: 12,
    },
    navCard: {
        flex: 1, backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        padding: 20, alignItems: 'center',
    },
    navCardIcon: { color: '#4f7cff', fontSize: 16, fontWeight: '700', marginBottom: 10, letterSpacing: 1 },
    navCardLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2 },

    section: { marginHorizontal: 20, marginTop: 24 },
    sectionTitle: {
        color: '#3d4f6b', fontSize: 9, letterSpacing: 2,
        marginBottom: 12, paddingBottom: 8,
        borderBottomWidth: 1, borderBottomColor: '#141c2f',
    },
    payoutRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#0f1729',
    },
    payoutRowLeft: {},
    payoutRowRight: { alignItems: 'flex-end' },
    payoutEvent: { color: '#e8edf5', fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
    payoutDate: { color: '#3d4f6b', fontSize: 10, marginTop: 3, letterSpacing: 0.3 },
    payoutAmt: { color: '#00c896', fontSize: 15, fontWeight: '700' },
    payoutBadge: {
        marginTop: 4, paddingHorizontal: 6, paddingVertical: 2,
    },
    badgeGreen: { backgroundColor: 'rgba(0,200,150,0.12)' },
    badgeYellow: { backgroundColor: 'rgba(255,180,0,0.12)' },
    payoutBadgeText: { color: '#00c896', fontSize: 9, letterSpacing: 1.5, fontWeight: '700' },

    bottomPad: { height: 40 },
});