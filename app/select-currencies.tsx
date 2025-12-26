import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CURRENCIES = ['GBP', 'EUR', 'USD', 'INR', 'AUD', 'CAD'];

export default function SelectCurrencies() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const from = params.from as string;
  const amount = Number(params.amount);
  const darkMode = params.dark === 'true';

  const [selected, setSelected] = useState<string[]>([]);

  const bg = darkMode ? '#071027' : '#F3F4F6';
  const card = darkMode ? '#0D1122' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#111827';
  const muted = darkMode ? '#9CA3AF' : '#6B7280';

  const toggle = (c: string) => {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    router.push({
      pathname: '/compare',
      params: {
        from,
        to: selected.join(','),
        amount,
        dark: darkMode,
        multi: 'true',
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color={text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: '700', color: text }}>
            Select target currencies
          </Text>
        </View>

        {/* Currency list */}
        <View style={{ gap: 12 }}>
          {CURRENCIES.filter((c) => c !== from).map((c) => {
            const active = selected.includes(c);

            return (
              <TouchableOpacity
                key={c}
                onPress={() => toggle(c)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: card,
                  borderRadius: 14,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: active ? '#2563EB' : darkMode ? '#1F2937' : '#E5E7EB',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: text, fontSize: 16, fontWeight: '600' }}>{c}</Text>
                {active && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer button */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={selected.length === 0}
          style={{
            marginTop: 28,
            backgroundColor: selected.length ? '#2563EB' : darkMode ? '#1F2937' : '#D1D5DB',
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
            Compare {selected.length || ''} currencies
          </Text>
        </TouchableOpacity>

        <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: muted }}>
          You can select more than one currency
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
