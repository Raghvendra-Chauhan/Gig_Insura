import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, ActivityIndicator, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const PLANS = [
    { type: 'basic',    label: 'BASIC',    weekly: 'Rs.15 / week', payout: 'Rs.200', accentColor: '#00c896' },
    { type: 'standard', label: 'STANDARD', weekly: 'Rs.30 / week', payout: 'Rs.400', accentColor: '#4f7cff' },
    { type: 'pro',      label: 'PRO',      weekly: 'Rs.50 / week', payout: 'Rs.700', accentColor: '#f5a623' },
];

export default function Policy() {
    const router = useRouter();
    const [selected, setSelected] = useState('standard');
    const [quote, setQuote] = useState<any>(null);
    const [policy, setPolicy] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [buying, setBuying] = useState(false);

    useEffect(() => { checkPolicy(); }, []);

    const checkPolicy = async () => {
        try {
            const r = await api.get('/policy/active');
            setPolicy(r.data.policy);
        } catch { setPolicy(null); }
    };

    const getQuote = async () => {
        setLoading(true);
        try {
            const r = await api.post('/policy/quote', { plan_type: selected });
            setQuote(r.data);
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to get quote');
        } finally {
            setLoading(false);
        }
    };

    const buyPolicy = async () => {
        if (!quote) return;
        setBuying(true);
        try {
            await api.post('/policy/create', {
                plan_type: quote.plan_type,
                premium_paid: quote.adjusted_premium,
                payout_cap: quote.payout_cap,
            });
            Alert.alert('Policy Activated', `${quote.plan_type.toUpperCase()} plan is now active.`);
            router.replace('/tabs/dashboard');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to activate policy');
        } finally {
            setBuying(false);
        }
    };

    if (policy) {
        return (
            <View style={s.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
                <View style={s.topBar}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={s.back}>BACK</Text>
                    </TouchableOpacity>
                    <Text style={s.screenTitle}>MY POLICY</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={s.divider} />

                <View style={[s.activePolicyCard, { borderTopColor: '#00c896' }]}>
                    <Text style={s.activePolicyMeta}>ACTIVE POLICY</Text>
                    <Text style={s.activePolicyPlan}>{policy.plan_type?.toUpperCase()}</Text>

                    <View style={s.policyGrid}>
                        <View style={s.policyGridCell}>
                            <Text style={s.policyGridLabel}>PREMIUM PAID</Text>
                            <Text style={s.policyGridVal}>Rs.{policy.premium_paid}</Text>
                        </View>
                        <View style={s.policyGridDivider} />
                        <View style={s.policyGridCell}>
                            <Text style={s.policyGridLabel}>PAYOUT CAP</Text>
                            <Text style={s.policyGridVal}>Rs.{policy.payout_cap}</Text>
                        </View>
                    </View>

                    <Text style={s.expiryText}>
                        EXPIRES  {new Date(policy.coverage_week_end).toDateString().toUpperCase()}
                    </Text>
                </View>

                <View style={s.infoBlock}>
                    <Text style={s.infoBlockLabel}>COVERAGE NOTES</Text>
                    <Text style={s.infoBlockText}>
                        Your policy automatically covers verified parametric events — rainfall, heatwave, AQI spike, and zone curfews. No manual claims required.
                    </Text>
                </View>
            </View>
        );
    }

    const selectedPlan = PLANS.find(p => p.type === selected);

    return (
        <ScrollView style={s.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
            <View style={s.topBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={s.back}>BACK</Text>
                </TouchableOpacity>
                <Text style={s.screenTitle}>GET COVERAGE</Text>
                <View style={{ width: 40 }} />
            </View>
            <View style={s.divider} />

            <View style={s.planSection}>
                <Text style={s.planSectionLabel}>SELECT PLAN</Text>
                {PLANS.map(plan => (
                    <TouchableOpacity
                        key={plan.type}
                        style={[s.planCard, selected === plan.type && { borderColor: plan.accentColor }]}
                        onPress={() => { setSelected(plan.type); setQuote(null); }}>
                        <View style={[s.planAccentBar, { backgroundColor: plan.accentColor }]} />
                        <View style={s.planContent}>
                            <View style={s.planTopRow}>
                                <Text style={s.planLabel}>{plan.label}</Text>
                                <Text style={[s.planWeekly, { color: plan.accentColor }]}>{plan.weekly}</Text>
                            </View>
                            <Text style={s.planPayout}>MAX PAYOUT  {plan.payout}</Text>
                        </View>
                        {selected === plan.type && (
                            <View style={[s.planCheckMark, { backgroundColor: plan.accentColor }]}>
                                <Text style={s.planCheckText}>+</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={s.quoteBtn} onPress={getQuote} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#0a0f1e" />
                    : <Text style={s.quoteBtnText}>GENERATE AI QUOTE</Text>
                }
            </TouchableOpacity>

            {quote && (
                <View style={s.quoteCard}>
                    <Text style={s.quoteTitle}>AI-ADJUSTED QUOTE</Text>

                    <View style={s.quoteTable}>
                        {[
                            { label: 'RISK LEVEL',     value: quote.risk_label?.toUpperCase() },
                            { label: 'BASE PREMIUM',   value: `Rs.${quote.base_premium} / week` },
                            { label: 'RISK SURCHARGE', value: `+ Rs.${quote.adjustment}` },
                            { label: 'PAYOUT CAP',     value: `Rs.${quote.payout_cap}` },
                        ].map((row, i) => (
                            <View key={i} style={s.quoteTableRow}>
                                <Text style={s.quoteTableLabel}>{row.label}</Text>
                                <Text style={s.quoteTableVal}>{row.value}</Text>
                            </View>
                        ))}
                        <View style={[s.quoteTableRow, s.quoteFinalRow]}>
                            <Text style={s.quoteFinalLabel}>FINAL PREMIUM</Text>
                            <Text style={s.quoteFinalVal}>Rs.{quote.adjusted_premium} / week</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={s.buyBtn} onPress={buyPolicy} disabled={buying}>
                        {buying
                            ? <ActivityIndicator color="#0a0f1e" />
                            : <Text style={s.buyBtnText}>ACTIVATE POLICY</Text>
                        }
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: 48 }} />
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0f1e' },
    topBar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
    },
    back: { color: '#3d4f6b', fontSize: 10, letterSpacing: 2, width: 40 },
    screenTitle: { color: '#e8edf5', fontSize: 11, fontWeight: '700', letterSpacing: 3 },
    divider: { height: 1, backgroundColor: '#0f1729', marginHorizontal: 20 },

    // Active policy
    activePolicyCard: {
        marginHorizontal: 20, marginTop: 20,
        backgroundColor: '#0f1729', padding: 22,
        borderWidth: 1, borderColor: '#141c2f', borderTopWidth: 2,
    },
    activePolicyMeta: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 6 },
    activePolicyPlan: { color: '#e8edf5', fontSize: 28, fontWeight: '700', letterSpacing: 2, marginBottom: 20 },
    policyGrid: { flexDirection: 'row', marginBottom: 16 },
    policyGridCell: { flex: 1 },
    policyGridDivider: { width: 1, backgroundColor: '#141c2f', marginHorizontal: 16 },
    policyGridLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 1.5, marginBottom: 4 },
    policyGridVal: { color: '#e8edf5', fontSize: 16, fontWeight: '700' },
    expiryText: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2 },

    infoBlock: {
        marginHorizontal: 20, marginTop: 14,
        padding: 16, borderWidth: 1, borderColor: '#141c2f',
    },
    infoBlockLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 8 },
    infoBlockText: { color: '#2e3a50', fontSize: 11, lineHeight: 18, letterSpacing: 0.3 },

    // Plan selection
    planSection: { paddingHorizontal: 20, marginTop: 20 },
    planSectionLabel: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 12 },
    planCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f',
        marginBottom: 10, overflow: 'hidden',
    },
    planAccentBar: { width: 3, alignSelf: 'stretch' },
    planContent: { flex: 1, padding: 16 },
    planTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    planLabel: { color: '#e8edf5', fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
    planWeekly: { fontSize: 13, fontWeight: '700' },
    planPayout: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1 },
    planCheckMark: {
        width: 22, height: 22, alignItems: 'center',
        justifyContent: 'center', marginRight: 14,
    },
    planCheckText: { color: '#0a0f1e', fontSize: 16, fontWeight: '700' },

    quoteBtn: {
        marginHorizontal: 20, marginTop: 8, marginBottom: 0,
        backgroundColor: '#4f7cff', paddingVertical: 15, alignItems: 'center',
    },
    quoteBtnText: { color: '#0a0f1e', fontSize: 11, fontWeight: '700', letterSpacing: 3 },

    quoteCard: {
        marginHorizontal: 20, marginTop: 14,
        backgroundColor: '#0f1729',
        borderWidth: 1, borderColor: '#141c2f', padding: 20,
    },
    quoteTitle: { color: '#3d4f6b', fontSize: 9, letterSpacing: 2, marginBottom: 16 },
    quoteTable: {},
    quoteTableRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#141c2f',
    },
    quoteTableLabel: { color: '#3d4f6b', fontSize: 10, letterSpacing: 1.5 },
    quoteTableVal: { color: '#8a9bb5', fontSize: 11, fontWeight: '600' },
    quoteFinalRow: { borderBottomWidth: 0, marginTop: 4, paddingTop: 12 },
    quoteFinalLabel: { color: '#e8edf5', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
    quoteFinalVal: { color: '#00c896', fontSize: 16, fontWeight: '700' },

    buyBtn: {
        backgroundColor: '#00c896', paddingVertical: 14,
        alignItems: 'center', marginTop: 20,
    },
    buyBtnText: { color: '#0a0f1e', fontSize: 11, fontWeight: '700', letterSpacing: 3 },
});