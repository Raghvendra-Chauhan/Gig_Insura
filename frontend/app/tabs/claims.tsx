import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    RefreshControl, TouchableOpacity, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const STATUS_COLOR: Record<string, string> = {
    paid:     '#00c896',
    approved: '#4f7cff',
    escrow:   '#f5a623',
    rejected: '#ff4c4c',
    initiated: '#3d4f6b',
};

function FraudRow({ label, value, flagged }: { label: string; value: string; flagged?: boolean }) {
    return (
        <View style={fr.row}>
            <Text style={fr.label}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {flagged && <View style={fr.flagDot} />}
                <Text style={[fr.value, flagged ? fr.flaggedText : null]}>{value}</Text>
            </View>
        </View>
    );
}

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
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor="#4f7cff" />}>

            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

            <View style={s.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={s.back}>BACK</Text>
                </TouchableOpacity>
                <Text style={s.screenTitle}>CLAIMS</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={s.divider} />

            {/* Info banner */}
            <View style={s.banner}>
                <Text style={s.bannerLabel}>ZERO-TOUCH CLAIM PROCESSING</Text>
                <Text style={s.bannerText}>
                    Claims are initiated automatically upon verified parametric triggers. No manual filing required. Each claim is scored by the fraud detection engine before payout.
                </Text>
            </View>

            {claims.length === 0 ? (
                <View style={s.empty}>
                    <Text style={s.emptyPrimary}>NO CLAIMS ON RECORD</Text>
                    <Text style={s.emptySub}>
                        Claims appear automatically when a disruption event is detected in your registered zone.
                    </Text>
                </View>
            ) : (
                claims.map((c, i) => {
                    const fraudScore = parseFloat(c.fraud_score) * 100;
                    const gpsFlag = c.gps_velocity_flag;
                    const osFlag  = c.os_mock_flag;
                    const ipFlag  = c.ip_consistency_flag;

                    return (
                        <View key={i} style={s.card}>
                            {/* Card header */}
                            <View style={s.cardTop}>
                                <View>
                                    <Text style={s.cardEventType}>{c.event_type?.toUpperCase()}</Text>
                                    <Text style={s.cardZone}>{c.zone?.toUpperCase()}  ·  {c.data_source}</Text>
                                </View>
                                <View style={[s.statusChip, { backgroundColor: `${STATUS_COLOR[c.status]}18`, borderColor: STATUS_COLOR[c.status] }]}>
                                    <Text style={[s.statusChipText, { color: STATUS_COLOR[c.status] }]}>
                                        {c.status?.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View style={s.cardDivider} />

                            {/* Financial row */}
                            <View style={s.infoGrid}>
                                <View style={s.infoCell}>
                                    <Text style={s.infoCellLabel}>PAYOUT</Text>
                                    <Text style={s.infoCellValue}>Rs.{c.expected_payout}</Text>
                                </View>
                                <View style={s.infoCellBorder} />
                                <View style={s.infoCell}>
                                    <Text style={s.infoCellLabel}>PLAN</Text>
                                    <Text style={s.infoCellValue}>{c.plan_type?.toUpperCase()}</Text>
                                </View>
                                <View style={s.infoCellBorder} />
                                <View style={s.infoCell}>
                                    <Text style={s.infoCellLabel}>RISK SCORE</Text>
                                    <Text style={[
                                        s.infoCellValue,
                                        fraudScore > 70 ? { color: '#ff4c4c' } : fraudScore > 40 ? { color: '#f5a623' } : { color: '#00c896' }
                                    ]}>{fraudScore.toFixed(0)}%</Text>
                                </View>
                            </View>

                            <View style={s.cardDivider} />

                            {/* Fraud signal panel */}
                            <Text style={s.fraudTitle}>FRAUD DETECTION SIGNALS</Text>
                            <FraudRow
                                label="GPS VELOCITY"
                                value={gpsFlag ? 'HIGH VELOCITY DETECTED' : 'NORMAL'}
                                flagged={gpsFlag}
                            />
                            <FraudRow
                                label="DEVICE INTEGRITY"
                                value={osFlag ? 'OS MOCK DETECTED' : 'CLEAN'}
                                flagged={osFlag}
                            />
                            <FraudRow
                                label="IP CONSISTENCY"
                                value={ipFlag ? 'ANOMALY DETECTED' : 'CONSISTENT'}
                                flagged={ipFlag}
                            />
                            <FraudRow
                                label="DECISION ENGINE"
                                value={
                                    c.status === 'escrow' ? 'HELD — HUMAN REVIEW REQUIRED'
                                    : c.status === 'rejected' ? 'REJECTED — FRAUD THRESHOLD EXCEEDED'
                                    : 'APPROVED — PARAMETERS WITHIN BOUNDS'
                                }
                            />

                            {/* Payout txn row */}
                            {c.razorpay_txn_id && (
                                <>
                                    <View style={s.cardDivider} />
                                    <View style={s.txnRow}>
                                        <Text style={s.txnLabel}>TXN ID</Text>
                                        <Text style={s.txnValue} numberOfLines={1} ellipsizeMode="middle">
                                            {c.razorpay_txn_id}
                                        </Text>
                                    </View>
                                </>
                            )}

                            <Text style={s.cardDate}>{new Date(c.created_at).toLocaleString('en-IN')}</Text>
                        </View>
                    );
                })
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const fr = StyleSheet.create({
    row: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingVertical: 7,
    },
    label: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1.5 },
    value: { color: '#8a9bb5', fontSize: 10, letterSpacing: 0.5 },
    flagDot: {
        width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#ff4c4c',
    },
    flaggedText: { color: '#ff4c4c' },
});

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0f1e' },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    },
    back: { color: '#3d4f6b', fontSize: 10, letterSpacing: 2, width: 40 },
    screenTitle: { color: '#e8edf5', fontSize: 11, fontWeight: '700', letterSpacing: 3 },
    divider: { height: 1, backgroundColor: '#0f1729', marginHorizontal: 20 },

    banner: {
        marginHorizontal: 20, marginTop: 16, marginBottom: 8,
        padding: 14, borderWidth: 1, borderColor: '#141c2f',
        backgroundColor: '#0f1729',
    },
    bannerLabel: { color: '#4f7cff', fontSize: 9, letterSpacing: 2, marginBottom: 6 },
    bannerText: { color: '#3d4f6b', fontSize: 11, lineHeight: 17, letterSpacing: 0.3 },

    empty: {
        paddingHorizontal: 20, marginTop: 60, alignItems: 'center',
    },
    emptyPrimary: {
        color: '#1a2540', fontSize: 11, letterSpacing: 3, fontWeight: '700', marginBottom: 12,
    },
    emptySub: {
        color: '#1a2540', fontSize: 11, textAlign: 'center', lineHeight: 18, letterSpacing: 0.3,
    },

    card: {
        marginHorizontal: 20, marginTop: 14,
        backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        padding: 18,
    },
    cardTop: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 14,
    },
    cardEventType: {
        color: '#e8edf5', fontSize: 14, fontWeight: '700', letterSpacing: 1,
    },
    cardZone: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1, marginTop: 3 },
    statusChip: {
        borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4,
    },
    statusChipText: { fontSize: 9, fontWeight: '700', letterSpacing: 1.5 },

    cardDivider: { height: 1, backgroundColor: '#141c2f', marginVertical: 12 },

    infoGrid: {
        flexDirection: 'row', alignItems: 'center',
    },
    infoCell: { flex: 1, alignItems: 'center' },
    infoCellBorder: { width: 1, height: 28, backgroundColor: '#141c2f' },
    infoCellLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
    infoCellValue: { color: '#e8edf5', fontSize: 14, fontWeight: '700' },

    fraudTitle: {
        color: '#3d4f6b', fontSize: 9, letterSpacing: 2,
        marginBottom: 4,
    },

    txnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    txnLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2 },
    txnValue: { color: '#4f7cff', fontSize: 10, flex: 1, letterSpacing: 0.5 },

    cardDate: { color: '#1a2540', fontSize: 9, letterSpacing: 1, marginTop: 12 },
});