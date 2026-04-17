import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, RefreshControl, Alert,
    ActivityIndicator, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

// ─── Type helpers ────────────────────────────────────────────────────────────

interface Claim {
    id: number;
    status: string;
    expected_payout: number;
    fraud_score: number;
    created_at: string;
    name: string;
    phone: string;
    delivery_platform: string;
    event_type: string;
    zone: string;
    raw_value: number;
    razorpay_txn_id: string | null;
    payout_status: string | null;
    gps_velocity_flag: boolean;
    os_mock_flag: boolean;
    ip_consistency_flag: boolean;
    duplicate_flag: boolean;
}

interface Stats {
    total: number;
    approved: number;
    paid: number;
    escrow: number;
    rejected: number;
    total_payout: number;
}

interface FraudStats {
    gps_flagged: number;
    os_flagged: number;
    ip_flagged: number;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
    return (
        <View style={[kpi.card, { borderTopColor: accent, borderTopWidth: 2 }]}>
            <Text style={kpi.value}>{value}</Text>
            <Text style={kpi.label}>{label}</Text>
        </View>
    );
}

function FlagDot({ flagged }: { flagged: boolean }) {
    return <View style={[fd.dot, flagged ? fd.red : fd.green]} />;
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function Admin() {
    const router = useRouter();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [fraud, setFraud] = useState<FraudStats | null>(null);
    const [refresh, setRefresh] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [tab, setTab] = useState<'all' | 'escrow' | 'payouts'>('all');

    const load = useCallback(async () => {
        try {
            const [claimsRes, statsRes] = await Promise.all([
                api.get('/claims/all'),
                api.get('/claims/stats'),
            ]);
            setClaims(claimsRes.data.claims || []);
            setStats(statsRes.data.stats);
            setFraud(statsRes.data.fraud);
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to load dashboard');
        }
    }, []);

    useEffect(() => { load(); }, []);

    const onRefresh = async () => {
        setRefresh(true);
        await load();
        setRefresh(false);
    };

    const handleReview = async (claimId: number, decision: 'approved' | 'rejected') => {
        setActionLoading(claimId);
        try {
            await api.patch(`/claims/${claimId}/review`, { decision });
            await load();
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSimulatePayout = async (claimId: number) => {
        setActionLoading(claimId);
        try {
            const res = await api.post('/payout/simulate', { claim_id: claimId });
            Alert.alert(
                'Payout Simulated',
                `TXN ID: ${res.data.payout?.razorpay_txn_id}\nAmount: Rs.${res.data.payout?.amount}`
            );
            await load();
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Payout simulation failed');
        } finally {
            setActionLoading(null);
        }
    };

    const escrowClaims = claims.filter(c => c.status === 'escrow');
    const displayedClaims = tab === 'escrow' ? escrowClaims
        : tab === 'payouts' ? claims.filter(c => c.status === 'paid')
        : claims;

    const STATUS_COLOR: Record<string, string> = {
        paid: '#00c896', approved: '#4f7cff',
        escrow: '#f5a623', rejected: '#ff4c4c', initiated: '#3d4f6b',
    };

    return (
        <ScrollView
            style={s.container}
            refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor="#4f7cff" />}>

            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

            {/* Top bar */}
            <View style={s.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={s.back}>BACK</Text>
                </TouchableOpacity>
                <View>
                    <Text style={s.screenTitle}>ADMIN CONSOLE</Text>
                    <Text style={s.screenSub}>GigInsura Operations</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={s.divider} />

            {/* KPI grid */}
            {stats && (
                <View style={s.kpiSection}>
                    <Text style={s.sectionLabel}>CLAIMS OVERVIEW</Text>
                    <View style={s.kpiRow}>
                        <KpiCard label="TOTAL"    value={stats.total}    accent="#3d4f6b" />
                        <KpiCard label="APPROVED" value={stats.approved} accent="#4f7cff" />
                        <KpiCard label="PAID"     value={stats.paid}     accent="#00c896" />
                    </View>
                    <View style={s.kpiRow}>
                        <KpiCard label="IN ESCROW"  value={stats.escrow}   accent="#f5a623" />
                        <KpiCard label="REJECTED"   value={stats.rejected} accent="#ff4c4c" />
                        <KpiCard
                            label="TOTAL PAYOUT"
                            value={`Rs.${Number(stats.total_payout).toFixed(0)}`}
                            accent="#00c896"
                        />
                    </View>
                </View>
            )}

            {/* Fraud KPIs */}
            {fraud && (
                <View style={s.fraudSection}>
                    <Text style={s.sectionLabel}>FRAUD SIGNAL SUMMARY</Text>
                    <View style={s.fraudGrid}>
                        <View style={s.fraudCell}>
                            <Text style={s.fraudCellVal}>{fraud.gps_flagged}</Text>
                            <Text style={s.fraudCellLabel}>GPS VELOCITY{'\n'}FLAGS</Text>
                        </View>
                        <View style={s.fraudCellDivider} />
                        <View style={s.fraudCell}>
                            <Text style={s.fraudCellVal}>{fraud.os_flagged}</Text>
                            <Text style={s.fraudCellLabel}>OS MOCK{'\n'}DETECTIONS</Text>
                        </View>
                        <View style={s.fraudCellDivider} />
                        <View style={s.fraudCell}>
                            <Text style={s.fraudCellVal}>{fraud.ip_flagged}</Text>
                            <Text style={s.fraudCellLabel}>IP ANOMALY{'\n'}FLAGS</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Tab selector */}
            <View style={s.tabRow}>
                {(['all', 'escrow', 'payouts'] as const).map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[s.tabBtn, tab === t && s.tabBtnActive]}
                        onPress={() => setTab(t)}>
                        <Text style={[s.tabBtnText, tab === t && s.tabBtnTextActive]}>
                            {t === 'all' ? 'ALL CLAIMS'
                             : t === 'escrow' ? `ESCROW (${escrowClaims.length})`
                             : 'PAID'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Claims list */}
            <View style={s.claimsSection}>
                {displayedClaims.length === 0 ? (
                    <Text style={s.emptyText}>NO RECORDS</Text>
                ) : (
                    displayedClaims.map((c) => {
                        const fraudPct = (parseFloat(String(c.fraud_score)) * 100).toFixed(0);
                        const isLoading = actionLoading === c.id;
                        const accentColor = STATUS_COLOR[c.status] || '#3d4f6b';

                        return (
                            <View key={c.id} style={[s.claimCard, { borderLeftColor: accentColor }]}>

                                {/* Worker + event */}
                                <View style={s.claimTopRow}>
                                    <View>
                                        <Text style={s.workerName}>{c.name}</Text>
                                        <Text style={s.workerMeta}>
                                            {c.phone}  ·  {c.delivery_platform?.toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={[s.statusPill, { backgroundColor: `${accentColor}18`, borderColor: accentColor }]}>
                                        <Text style={[s.statusPillText, { color: accentColor }]}>
                                            {c.status?.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Event info */}
                                <View style={s.eventRow}>
                                    <Text style={s.eventType}>{c.event_type?.toUpperCase()}</Text>
                                    <Text style={s.eventZone}>{c.zone?.toUpperCase()}  ·  Val {c.raw_value}</Text>
                                </View>

                                {/* Metrics row */}
                                <View style={s.metricsRow}>
                                    <View style={s.metric}>
                                        <Text style={s.metricLabel}>PAYOUT</Text>
                                        <Text style={s.metricVal}>Rs.{c.expected_payout}</Text>
                                    </View>
                                    <View style={s.metric}>
                                        <Text style={s.metricLabel}>RISK SCORE</Text>
                                        <Text style={[
                                            s.metricVal,
                                            Number(fraudPct) > 70 ? { color: '#ff4c4c' }
                                            : Number(fraudPct) > 40 ? { color: '#f5a623' }
                                            : { color: '#00c896' }
                                        ]}>{fraudPct}%</Text>
                                    </View>
                                    <View style={s.metric}>
                                        <Text style={s.metricLabel}>SIGNALS</Text>
                                        <View style={s.flagRow}>
                                            <FlagDot flagged={c.gps_velocity_flag} />
                                            <FlagDot flagged={c.os_mock_flag} />
                                            <FlagDot flagged={c.ip_consistency_flag} />
                                        </View>
                                    </View>
                                    <View style={s.metric}>
                                        <Text style={s.metricLabel}>DATE</Text>
                                        <Text style={s.metricVal}>
                                            {new Date(c.created_at).toLocaleDateString('en-IN')}
                                        </Text>
                                    </View>
                                </View>

                                {/* TXN row */}
                                {c.razorpay_txn_id && (
                                    <View style={s.txnRow}>
                                        <Text style={s.txnLabel}>TXN</Text>
                                        <Text style={s.txnVal} numberOfLines={1} ellipsizeMode="middle">
                                            {c.razorpay_txn_id}
                                        </Text>
                                    </View>
                                )}

                                {/* Action buttons */}
                                {isLoading ? (
                                    <View style={s.loadingRow}>
                                        <ActivityIndicator size="small" color="#4f7cff" />
                                    </View>
                                ) : (
                                    <>
                                        {c.status === 'escrow' && (
                                            <View style={s.actionRow}>
                                                <TouchableOpacity
                                                    style={s.actionApprove}
                                                    onPress={() => handleReview(c.id, 'approved')}>
                                                    <Text style={s.actionApproveText}>APPROVE</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={s.actionReject}
                                                    onPress={() => handleReview(c.id, 'rejected')}>
                                                    <Text style={s.actionRejectText}>REJECT</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        {c.status === 'approved' && (
                                            <TouchableOpacity
                                                style={s.actionPayout}
                                                onPress={() => handleSimulatePayout(c.id)}>
                                                <Text style={s.actionPayoutText}>SIMULATE RAZORPAY PAYOUT</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}
                            </View>
                        );
                    })
                )}
            </View>

            <View style={{ height: 48 }} />
        </ScrollView>
    );
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const kpi = StyleSheet.create({
    card: {
        flex: 1, backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        padding: 14,
    },
    value: { color: '#e8edf5', fontSize: 20, fontWeight: '700', marginBottom: 4 },
    label: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2 },
});

const fd = StyleSheet.create({
    dot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 3 },
    red: { backgroundColor: '#ff4c4c' },
    green: { backgroundColor: '#00c896' },
});

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0f1e' },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    },
    back: { color: '#3d4f6b', fontSize: 10, letterSpacing: 2, width: 40 },
    screenTitle: { color: '#e8edf5', fontSize: 11, fontWeight: '700', letterSpacing: 3, textAlign: 'center' },
    screenSub: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 3 },
    divider: { height: 1, backgroundColor: '#0f1729', marginHorizontal: 20 },
    sectionLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 10 },

    kpiSection: { paddingHorizontal: 20, marginTop: 20 },
    kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },

    fraudSection: {
        marginHorizontal: 20, marginTop: 6,
        backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f', padding: 16,
    },
    fraudGrid: { flexDirection: 'row', alignItems: 'center' },
    fraudCell: { flex: 1, alignItems: 'center' },
    fraudCellDivider: { width: 1, height: 36, backgroundColor: '#141c2f' },
    fraudCellVal: { color: '#ff4c4c', fontSize: 22, fontWeight: '700' },
    fraudCellLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 1, textAlign: 'center', marginTop: 4, lineHeight: 14 },

    tabRow: {
        flexDirection: 'row', marginHorizontal: 20, marginTop: 20,
        borderWidth: 1, borderColor: '#141c2f',
    },
    tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    tabBtnActive: { backgroundColor: '#4f7cff' },
    tabBtnText: { color: '#3d4f6b', fontSize: 9, letterSpacing: 1.5, fontWeight: '600' },
    tabBtnTextActive: { color: '#0a0f1e' },

    claimsSection: { paddingHorizontal: 20, marginTop: 12 },
    emptyText: { color: '#1a2540', fontSize: 11, letterSpacing: 3, textAlign: 'center', marginTop: 30 },

    claimCard: {
        backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        borderLeftWidth: 3, padding: 16, marginBottom: 10,
    },
    claimTopRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 10,
    },
    workerName: { color: '#e8edf5', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
    workerMeta: { color: '#3d4f6b', fontSize: 9, letterSpacing: 1, marginTop: 2 },
    statusPill: {
        borderWidth: 1, paddingHorizontal: 7, paddingVertical: 3,
    },
    statusPillText: { fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },

    eventRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12,
    },
    eventType: { color: '#4f7cff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    eventZone: { color: '#3d4f6b', fontSize: 10, letterSpacing: 0.5 },

    metricsRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        borderTopWidth: 1, borderTopColor: '#141c2f',
        paddingTop: 10, marginBottom: 10,
    },
    metric: { alignItems: 'center' },
    metricLabel: { color: '#3d4f6b', fontSize: 8, letterSpacing: 1.5, marginBottom: 4 },
    metricVal: { color: '#e8edf5', fontSize: 11, fontWeight: '600' },
    flagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },

    txnRow: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        borderTopWidth: 1, borderTopColor: '#141c2f', paddingTop: 8, marginBottom: 8,
    },
    txnLabel: { color: '#3d4f6b', fontSize: 8, letterSpacing: 2 },
    txnVal: { color: '#4f7cff', fontSize: 9, flex: 1, letterSpacing: 0.5 },

    loadingRow: { paddingVertical: 12, alignItems: 'center' },
    actionRow: { flexDirection: 'row', gap: 8 },
    actionApprove: {
        flex: 1, backgroundColor: 'rgba(79,124,255,0.12)',
        borderWidth: 1, borderColor: '#4f7cff',
        paddingVertical: 9, alignItems: 'center',
    },
    actionApproveText: { color: '#4f7cff', fontSize: 9, fontWeight: '700', letterSpacing: 2 },
    actionReject: {
        flex: 1, backgroundColor: 'rgba(255,76,76,0.08)',
        borderWidth: 1, borderColor: '#ff4c4c',
        paddingVertical: 9, alignItems: 'center',
    },
    actionRejectText: { color: '#ff4c4c', fontSize: 9, fontWeight: '700', letterSpacing: 2 },
    actionPayout: {
        backgroundColor: 'rgba(0,200,150,0.1)',
        borderWidth: 1, borderColor: '#00c896',
        paddingVertical: 10, alignItems: 'center',
    },
    actionPayoutText: { color: '#00c896', fontSize: 9, fontWeight: '700', letterSpacing: 2 },
});
