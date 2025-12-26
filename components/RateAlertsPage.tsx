import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CurrencyInput } from './CurrencyInput';
import { ThemedText } from './themed-text';

// TODO: Replace with your actual createRateAlert implementation
async function createRateAlert(alert: any) {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

const CURRENCIES = ['EUR', 'USD', 'INR', 'PKR', 'PHP', 'NGN', 'AUD', 'CAD', 'CHF', 'JPY', 'CNY', 'AED', 'ZAR'];

interface RateAlertsPageProps {
  onBack: () => void;
}

export function RateAlertsPage({ onBack }: RateAlertsPageProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';
  const colors = Colors[darkMode ? 'dark' : 'light'];
  const [toCurrency, setToCurrency] = useState('EUR');
  const [targetRate, setTargetRate] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !targetRate) {
      setError('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    const rate = parseFloat(targetRate);
    if (isNaN(rate) || rate <= 0) {
      setError('Please enter a valid target rate');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await createRateAlert({
        email,
        to_currency: toCurrency,
        target_rate: rate,
      });
      setSuccess(true);
      setEmail('');
      setTargetRate('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: darkMode ? '#151718' : '#F3F4F6' }} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={{ color: colors.icon, fontSize: 18 }}>←</Text>
        <ThemedText style={{ marginLeft: 6 }}>Back</ThemedText>
      </TouchableOpacity>
      <View style={[styles.card, { backgroundColor: darkMode ? '#0D1122' : '#fff', borderColor: darkMode ? '#374151' : '#E5E7EB' }]}> 
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <Text style={{ fontSize: 36, color: '#2563EB', marginBottom: 8 }}>🔔</Text>
          <ThemedText type="title">Rate Alerts</ThemedText>
          <ThemedText style={{ color: '#9CA3AF', marginTop: 4 }}>Get notified when exchange rates hit your target</ThemedText>
        </View>
        {success && (
          <View style={[styles.alert, darkMode ? styles.successDark : styles.successLight]}>
            <Text style={{ color: darkMode ? '#6EE7B7' : '#166534', fontWeight: 'bold' }}>Alert created successfully! We&apos;ll notify you when the rate is reached.</Text>
          </View>
        )}
        {error && (
          <View style={[styles.alert, darkMode ? styles.errorDark : styles.errorLight]}>
            <Text style={{ color: darkMode ? '#FCA5A5' : '#B91C1C' }}>{error}</Text>
          </View>
        )}
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>To Currency</ThemedText>
          <CurrencyInput
            value={toCurrency}
            onChange={setToCurrency}
            currencies={CURRENCIES}
            darkMode={darkMode}
          />
          <ThemedText style={styles.helper}>Get alerts for GBP to {toCurrency} exchange rate</ThemedText>
        </View>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Target Rate</ThemedText>
          <TextInput
            value={targetRate}
            onChangeText={setTargetRate}
            keyboardType="decimal-pad"
            editable={!loading}
            style={[styles.input, darkMode ? styles.inputDark : styles.inputLight, loading && { opacity: 0.5 }]}
            placeholder="e.g., 1.2500"
            placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
          />
          <ThemedText style={styles.helper}>We&apos;ll notify you when GBP to {toCurrency} reaches this rate</ThemedText>
        </View>
        <View style={styles.formGroup}>
          <ThemedText style={styles.label}>Email Address</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
            style={[styles.input, darkMode ? styles.inputDark : styles.inputLight, loading && { opacity: 0.5 }]}
            placeholder="your.email@example.com"
            placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : null}
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{loading ? 'Creating Alert...' : 'Create Alert'}</Text>
        </TouchableOpacity>
        <ThemedText style={styles.note}>
          Note: This is an MVP feature. Alerts are saved but email notifications are not yet implemented.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    minHeight: '100%',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  card: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  alert: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  successLight: {
    backgroundColor: '#ECFDF5',
  },
  successDark: {
    backgroundColor: '#064E3B',
  },
  errorLight: {
    backgroundColor: '#FEE2E2',
  },
  errorDark: {
    backgroundColor: '#7F1D1D',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '600',
  },
  helper: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
    borderWidth: 1,
  },
  inputDark: {
    backgroundColor: '#1A1F3A',
    color: '#fff',
    borderColor: '#374151',
  },
  inputLight: {
    backgroundColor: '#fff',
    color: '#222',
    borderColor: '#D1D5DB',
  },
  submitBtn: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  note: {
    marginTop: 24,
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
  },
});
