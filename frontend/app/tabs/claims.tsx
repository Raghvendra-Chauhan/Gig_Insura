import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    RefreshControl, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const statusColor: any = {
    paid: '#22c55e',
    approved: '#6366f1',
    escrow: '#eab308',
    rejected: '#ef4444',
    initiated: '#94a3b8',
};

const statusIcon: any = {
    paid: '💰',
    approved: '✅',
    escrow: '⏳',
    rejected: '❌',
    initiated: '🔄',
};

export default function Claims() {
    const router = useRouter();
    const [claims, setClaims] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false);

    const load = async () => {
        try {
            const r = await api.get('/claims/my');
            setClaims(r.data.claims || []);
        } catch { }
    };

    useEffect(() => { load(); }, []);

    const onRefresh = async () => {
        setRefresh(true);
        await load();
        setRefresh(false);
    };

    return (
        <ScrollView
            style={s.container}
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}>

            <View style={s.header}>
                <Text style={s.title}>⚡ My Claims</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={s.back}>← Back</Text>
                </TouchableOpacity>
            </View>

            {claims.length === 0 ? (
                <View style={s.empty}>
                    <Text style={s.emptyIcon}>📭</Text>
                    <Text style={s.emptyText}>No claims yet</Text>
                    <Text style={s.emptySub}>Claims appear automatically when a disruption is detected in your zone</Text>
                </View>
            ) : (
                claims.map((c, i) => (
                    <View key={i} style={s.card}>
                        <View style={s.cardHeader}>
                            <Text style={s.eventType}>
                                {statusIcon[c.status]} {c.event_type?.toUpperCase()}
                            </Text>
                            <Text style={[s.status, { color: statusColor[c.status] }]}>
                                {c.status?.toUpperCase()}
                            </Text>
                        </View>

                        <View style={s.row}>
                            <Text style={s.label}>Zone</Text>
                            <Text style={s.val}>{c.zone}</Text>
                        </View>
                        <View style={s.row}>
                            <Text style={s.label}>Payout</Text>
                            <Text style={[s.val, { color: '#22c55e' }]}>₹{c.expected_payout}</Text>
                        </View>
                        <View style={s.row}>
                            <Text style={s.label}>Fraud Score</Text>
                            <Text style={s.val}>{(parseFloat(c.fraud_score) * 100).toFixed(0)}% risk</Text>
                        </View>
                        <View style={s.row}>
                            <Text style={s.label}>Plan</Text>
                            <Text style={s.val}>{c.plan_type?.toUpperCase()}</Text>
                        </View>
                        <View style={s.row}>
                            <Text style={s.label}>Date</Text>
                            <Text style={s.val}>{new Date(c.created_at).toLocaleString()}</Text>
                        </View>
                    </View>
                ))
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
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    back: { color: '#6366f1' },
    empty: { alignItems: 'center', marginTop: 80 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    emptySub: { color: '#64748b', textAlign: 'center', lineHeight: 20 },
    card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 18, marginBottom: 12 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
    eventType: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    status: { fontWeight: 'bold', fontSize: 13 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { color: '#64748b' },
    val: { color: '#fff', fontWeight: '500' },
});