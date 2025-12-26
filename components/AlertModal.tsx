import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type AlertModalProps = {
  visible: boolean;
  onClose: () => void;
  darkMode: boolean;
  fromCurrency: string;
  toCurrency?: string; // For single currency mode
  currencies: string[]; // All available currencies
  onSave: (alert: { from: string; to: string; targetRate: number }[]) => void;
};

export default function AlertModal({
  visible,
  onClose,
  darkMode,
  fromCurrency,
  toCurrency,
  currencies,
  onSave,
}: AlertModalProps) {
  const bg = darkMode ? '#0D1122' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#111827';
  const muted = darkMode ? '#9CA3AF' : '#6B7280';

  // If single currency mode, only allow that currency; otherwise multi-select
  const initialTargets = toCurrency ? [toCurrency] : [];
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(initialTargets);
  const [rates, setRates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (toCurrency) {
      setSelectedCurrencies([toCurrency]);
      setRates({ [toCurrency]: '' });
    }
  }, [toCurrency]);

  const toggleCurrency = (c: string) => {
    if (selectedCurrencies.includes(c)) {
      const newSelected = selectedCurrencies.filter((sc) => sc !== c);
      setSelectedCurrencies(newSelected);
      const newRates = { ...rates };
      delete newRates[c];
      setRates(newRates);
    } else {
      setSelectedCurrencies([...selectedCurrencies, c]);
      setRates({ ...rates, [c]: '' });
    }
  };

  const handleSave = () => {
    const alerts = selectedCurrencies
      .map((c) => {
        const value = parseFloat(rates[c]);
        if (!isNaN(value) && value > 0) return { from: fromCurrency, to: c, targetRate: value };
        return null;
      })
      .filter(Boolean) as { from: string; to: string; targetRate: number }[];

    if (alerts.length > 0) {
      onSave(alerts);
      onClose();
      setSelectedCurrencies(initialTargets);
      setRates({});
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View style={{ margin: 20, backgroundColor: bg, borderRadius: 20, padding: 20 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: text, fontSize: 18, fontWeight: '700' }}>Set Rate Alert</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={text} />
            </TouchableOpacity>
          </View>

          {/* Currency selection for multi-currency */}
          {!toCurrency && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 16 }}
            >
              {currencies.filter(c => c !== fromCurrency).map((c) => {
                const active = selectedCurrencies.includes(c);
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => toggleCurrency(c)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 12,
                      marginRight: 8,
                      backgroundColor: active ? '#2563EB' : darkMode ? '#1F2937' : '#E5E7EB',
                    }}
                  >
                    <Text style={{ color: active ? '#fff' : muted, fontWeight: '600' }}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Target rate inputs */}
          {selectedCurrencies.map((c) => (
            <View key={c} style={{ marginBottom: 12 }}>
              <Text style={{ color: muted, marginBottom: 4 }}>{fromCurrency} → {c} Target Rate</Text>
              <TextInput
                value={rates[c]}
                onChangeText={(val) => setRates({ ...rates, [c]: val })}
                keyboardType="numeric"
                placeholder="Enter target rate"
                placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
                style={{
                  borderWidth: 1,
                  borderColor: darkMode ? '#1F2937' : '#D1D5DB',
                  borderRadius: 12,
                  padding: 12,
                  color: text,
                }}
              />
            </View>
          ))}

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              marginTop: 10,
              backgroundColor: '#2563EB',
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Save Alert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
