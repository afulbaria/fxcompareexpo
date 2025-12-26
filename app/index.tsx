import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlertModal from '../components/AlertModal';
import { CurrencyInput } from '../components/CurrencyInput';
import { checkAlerts } from '../utils/checkAlerts';
import { requestNotificationPermission } from '../utils/notifications';

const CURRENCIES = ['GBP', 'EUR', 'USD', 'INR', 'AUD', 'CAD'];

export default function Index() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState<'single' | 'multi'>('single');

  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');

  const [alertsVisible, setAlertsVisible] = useState(false);
  const [alerts, setAlerts] = useState<
    { from: string; to: string; targetRate: number }[]
  >([]);
  const [editingAlert, setEditingAlert] = useState<
    { from: string; to: string; targetRate: number } | null
  >(null);

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    // Load saved alerts
    AsyncStorage.getItem('alerts').then((res) => {
      if (res) setAlerts(JSON.parse(res));
    });

    // Periodically check alerts
    const interval = setInterval(() => {
      checkAlerts();
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCompare = () => {
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    if (mode === 'single') {
      router.push({
        pathname: '/compare',
        params: {
          from: fromCurrency,
          to: toCurrency,
          amount: parsed,
          dark: darkMode,
        },
      });
    } else {
      router.push({
        pathname: '/select-currencies',
        params: {
          from: fromCurrency,
          amount: parsed,
          dark: darkMode,
        },
      });
    }
  };

  const handleSaveAlerts = async (newAlerts: typeof alerts) => {
    let updated: typeof alerts = [];
    if (editingAlert) {
      updated = alerts.map((a) =>
        a.from === editingAlert.from &&
        a.to === editingAlert.to &&
        a.targetRate === editingAlert.targetRate
          ? newAlerts[0]
          : a
      );
    } else {
      updated = [...alerts, ...newAlerts];
    }
    setAlerts(updated);
    await AsyncStorage.setItem('alerts', JSON.stringify(updated));
    setEditingAlert(null);
  };

  const handleEditAlert = (alert: typeof editingAlert) => {
    if (!alert) return;
    setEditingAlert(alert);
    setAlertsVisible(true);
  };

  const handleDeleteAlert = (alert: typeof editingAlert) => {
    Alert.alert(
      'Delete Alert',
      `Delete alert for ${alert?.from} → ${alert?.to}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = alerts.filter(
              (a) =>
                !(
                  a.from === alert?.from &&
                  a.to === alert?.to &&
                  a.targetRate === alert?.targetRate
                )
            );
            setAlerts(updated);
            await AsyncStorage.setItem('alerts', JSON.stringify(updated));
          },
        },
      ]
    );
  };

  const bg = darkMode ? '#071027' : '#F3F4F6';
  const card = darkMode ? '#0D1122' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#111827';
  const muted = darkMode ? '#9CA3AF' : '#6B7280';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <View>
            <Text style={{ fontSize: 30, fontWeight: '800', color: text }}>
              FXCompare
            </Text>
            <Text style={{ marginTop: 4, color: muted }}>
              Compare international money transfers
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons
              name={darkMode ? 'moon' : 'sunny'}
              size={20}
              color={text}
            />
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* Mode Selector */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: card,
            borderRadius: 16,
            padding: 6,
            marginBottom: 20,
          }}
        >
          {['single', 'multi'].map((m) => {
            const active = mode === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m as any)}
                activeOpacity={0.85}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: active ? '#2563EB' : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ color: active ? '#fff' : muted, fontWeight: '600' }}
                >
                  {m === 'single' ? 'Single currency' : 'Multiple currencies'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transfer Card */}
        <View
          style={{
            backgroundColor: card,
            borderRadius: 20,
            padding: 18,
            shadowColor: '#000',
            shadowOpacity: darkMode ? 0 : 0.05,
            shadowRadius: 12,
          }}
        >
          <Text style={{ color: muted, marginBottom: 6 }}>From</Text>

          <CurrencyInput
            value={fromCurrency}
            onChange={setFromCurrency}
            currencies={CURRENCIES}
            darkMode={darkMode}
          />

          <Text style={{ color: muted, marginVertical: 12 }}>
            {mode === 'single' ? 'To' : 'Compare against'}
          </Text>

          {mode === 'single' ? (
            <CurrencyInput
              value={toCurrency}
              onChange={setToCurrency}
              currencies={CURRENCIES.filter((c) => c !== fromCurrency)}
              darkMode={darkMode}
            />
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: darkMode ? '#1F2937' : '#D1D5DB',
                borderRadius: 12,
                padding: 14,
              }}
            >
              <Text style={{ color: muted }}>
                Select multiple target currencies on next step
              </Text>
            </View>
          )}

          <Text style={{ color: muted, marginTop: 14 }}>Amount</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: darkMode ? '#1F2937' : '#D1D5DB',
              borderRadius: 12,
              padding: 14,
              fontSize: 16,
              color: text,
            }}
          />

          {/* Set Alerts Button */}
          <TouchableOpacity
            onPress={() => setAlertsVisible(true)}
            style={{
              marginTop: 18,
              backgroundColor: '#10B981',
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
              Set Rate Alert
            </Text>
          </TouchableOpacity>

          {/* Compare Now Button */}
          <TouchableOpacity
            onPress={handleCompare}
            activeOpacity={0.9}
            style={{
              marginTop: 14,
              backgroundColor: '#2563EB',
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: '700',
                fontSize: 16,
                letterSpacing: 0.3,
              }}
            >
              Compare Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Saved Alerts */}
        {alerts.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: muted, fontWeight: '600', marginBottom: 8 }}>
              Saved Alerts
            </Text>
            {alerts.map((alertItem, index) => (
              <View
                key={`${alertItem.from}-${alertItem.to}-${index}`}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: darkMode ? '#0B1225' : '#EFF6FF',
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: text, fontWeight: '600' }}>
                  {alertItem.from} → {alertItem.to}: {alertItem.targetRate}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => handleEditAlert(alertItem)}>
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={darkMode ? '#93C5FD' : '#2563EB'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAlert(alertItem)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={darkMode ? '#EF4444' : '#DC2626'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Trust Footer */}
        <Text
          style={{
            marginTop: 18,
            textAlign: 'center',
            fontSize: 12,
            color: muted,
          }}
        >
          Independent comparison. No hidden fees.
        </Text>
      </ScrollView>

      {/* Alert Modal */}
      <AlertModal
        visible={alertsVisible}
        onClose={() => {
          setAlertsVisible(false);
          setEditingAlert(null);
        }}
        darkMode={darkMode}
        fromCurrency={fromCurrency}
        toCurrency={mode === 'single' && !editingAlert ? toCurrency : undefined}
        currencies={CURRENCIES}
        onSave={handleSaveAlerts}
      />
    </SafeAreaView>
  );
}
