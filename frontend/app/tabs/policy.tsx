import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const PLANS = [
    { type: 'basic', label: '🟢 Basic', price: '₹15/week', payout: '₹200', color: '#22c55e' },
    { type: 'standard', label: '🟡 Standard', price: '₹30/week', payout: '₹400', color: '#eab308' },
    { type: 'pro', label: '🔴 Pro', price: '₹50/week', payout: '₹700', color: '#ef4444' },
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
            Alert.alert('✅ Success', `${quote.plan_type} policy activated!`);
            router.replace('/tabs/dashboard');
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Failed to buy policy');
        } finally {
            setBuying(false);
        }
    };

    if (policy) {
        return (
            <View style={s.container}>
                <Text style={s.title}>📋 My Policy</Text>
                <View style={[s.card, s.green]}>
                    <Text style={s.cardLabel}>Active Plan</Text>
                    <Text style={s.cardVal}>{policy.plan_type?.toUpperCase()}</Text>
                    <Text style={s.cardSub}>Premium Paid: ₹{policy.premium_paid}</Text>
                    <Text style={s.cardSub}>Payout Cap: ₹{policy.payout_cap}</Text>
                    <Text style={s.cardSub}>
                        Expires: {new Date(policy.coverage_week_end).toDateString()}
                    </Text>
                </View>
                <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                    <Text style={s.backBtnText}>← Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={s.container}>
            <Text style={s.title}>📋 Get Coverage</Text>
            <Text style={s.sub}>Select a plan that fits your needs</Text>

            {PLANS.map(plan => (
                <TouchableOpacity
                    key={plan.type}
                    style={[s.planCard, selected === plan.type && s.planSelected]}
                    onPress={() => { setSelected(plan.type); setQuote(null); }}>
                    <View style={s.planRow}>
                        <Text style={s.planLabel}>{plan.label}</Text>
                        <Text style={[s.planPrice, { color: plan.color }]}>{plan.price}</Text>
                    </View>
                    <Text style={s.planPayout}>Payout up to {plan.payout}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={s.quoteBtn} onPress={getQuote} disabled={loading}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.quoteBtnText}>Get AI Quote →</Text>
                }
            </TouchableOpacity>

            {quote && (
                <View style={s.quoteCard}>
                    <Text style={s.quoteTitle}>Your AI-Adjusted Quote</Text>
                    <View style={s.quoteRow}>
                        <Text style={s.quoteLabel}>Risk Level</Text>
                        <Text style={s.quoteVal}>{quote.risk_label?.toUpperCase()}</Text>
                    </View>
                    <View style={s.quoteRow}>
                        <Text style={s.quoteLabel}>Base Premium</Text>
                        <Text style={s.quoteVal}>₹{quote.base_premium}/week</Text>
                    </View>
                    <View style={s.quoteRow}>
                        <Text style={s.quoteLabel}>Risk Adjustment</Text>
                        <Text style={s.quoteVal}>+₹{quote.adjustment}</Text>
                    </View>
                    <View style={[s.quoteRow, s.quoteFinal]}>
                        <Text style={s.quoteFinalLabel}>Final Premium</Text>
                        <Text style={s.quoteFinalVal}>₹{quote.adjusted_premium}/week</Text>
                    </View>
                    <View style={s.quoteRow}>
                        <Text style={s.quoteLabel}>Payout Cap</Text>
                        <Text style={s.quoteVal}>₹{quote.payout_cap}</Text>
                    </View>

                    <TouchableOpacity style={s.buyBtn} onPress={buyPolicy} disabled={buying}>
                        {buying
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={s.buyBtnText}>Activate Policy ✅</Text>
                        }
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 48, marginBottom: 6 },
    sub: { color: '#94a3b8', marginBottom: 24 },
    planCard: {
        backgroundColor: '#1e293b', borderRadius: 14, padding: 16,
        marginBottom: 10, borderWidth: 2, borderColor: 'transparent'
    },
    planSelected: { borderColor: '#6366f1' },
    planRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    planLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    planPrice: { fontWeight: 'bold', fontSize: 16 },
    planPayout: { color: '#64748b', fontSize: 13 },
    quoteBtn: {
        backgroundColor: '#6366f1', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 8, marginBottom: 16
    },
    quoteBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    quoteCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 40 },
    quoteTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 16 },
    quoteRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    quoteLabel: { color: '#94a3b8' },
    quoteVal: { color: '#fff', fontWeight: 'bold' },
    quoteFinal: { borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 10, marginTop: 4 },
    quoteFinalLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    quoteFinalVal: { color: '#22c55e', fontWeight: 'bold', fontSize: 18 },
    buyBtn: {
        backgroundColor: '#22c55e', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 16
    },
    buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 14 },
    green: { borderLeftWidth: 4, borderLeftColor: '#22c55e' },
    cardLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 6 },
    cardVal: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    cardSub: { color: '#64748b', fontSize: 13, marginTop: 4 },
    backBtn: { backgroundColor: '#1e293b', padding: 14, borderRadius: 12, alignItems: 'center' },
    backBtnText: { color: '#6366f1', fontWeight: 'bold' },
});