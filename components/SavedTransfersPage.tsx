import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

// Placeholder backend functions and types
// Replace with real implementations as needed
interface SavedTransfer {
  id: string;
  name: string;
  from_currency: string;
  to_currency: string;
  amount: number;
  use_count: number;
  created_at: string;
}

async function getSavedTransfers(): Promise<SavedTransfer[]> {
  // TODO: Replace with real backend call
  return [];
}
async function deleteSavedTransfer(id: string): Promise<void> {
  // TODO: Replace with real backend call
}

interface SavedTransfersPageProps {
  onBack: () => void;
  onLoadTransfer: (from: string, to: string, amount: number) => void;
  darkMode?: boolean;
}

export function SavedTransfersPage({ onBack, onLoadTransfer, darkMode }: SavedTransfersPageProps) {
  const [savedTransfers, setSavedTransfers] = useState<SavedTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSavedTransfers();
  }, []);

  const loadSavedTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const transfers = await getSavedTransfers();
      setSavedTransfers(transfers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      await deleteSavedTransfer(id);
      setSavedTransfers(savedTransfers.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transfer');
    } finally {
      setDeleting(null);
    }
  };

  const handleLoadTransfer = (transfer: SavedTransfer) => {
    onLoadTransfer(transfer.from_currency, transfer.to_currency, transfer.amount);
  };

  const bgColor = darkMode ? '#071027' : '#F0F6FF';
  const cardBg = darkMode ? '#0D1122' : '#fff';
  const cardBorder = darkMode ? '#232B45' : '#E5EAF2';
  const errorBg = darkMode ? 'rgba(153,27,27,0.2)' : '#FEE2E2';
  const errorText = darkMode ? '#FCA5A5' : '#B91C1C';
  const errorBorder = '#B91C1C';

  return (
    <ThemedView style={{ flex: 1, backgroundColor: bgColor, paddingTop: 32, paddingHorizontal: 0 }}>
      <View style={{ paddingHorizontal: 20, maxWidth: 700, width: '100%', alignSelf: 'center' }}>
        <TouchableOpacity
          onPress={onBack}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
          accessibilityRole="button"
        >
          <IconSymbol name="arrow.left" color={darkMode ? '#A0AEC0' : '#475569'} size={22} />
          <ThemedText style={{ marginLeft: 8, color: darkMode ? '#A0AEC0' : '#475569', fontSize: 16 }}>Back</ThemedText>
        </TouchableOpacity>

        <View style={{ marginBottom: 32 }}>
          <ThemedText type="title" style={{ fontSize: 32, fontWeight: 'bold', color: darkMode ? '#fff' : '#222', marginBottom: 4 }}>
            Saved Transfers
          </ThemedText>
          <ThemedText style={{ fontSize: 18, color: darkMode ? '#A0AEC0' : '#64748B' }}>
            Quick access to your frequently used transfer routes
          </ThemedText>
        </View>

        {error && (
          <View style={{ backgroundColor: errorBg, borderLeftWidth: 4, borderLeftColor: errorBorder, padding: 12, borderRadius: 8, marginBottom: 24 }}>
            <ThemedText style={{ color: errorText }}>{error}</ThemedText>
          </View>
        )}

        {loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
            <ActivityIndicator size="large" color={darkMode ? '#60A5FA' : '#2563EB'} style={{ marginBottom: 16 }} />
            <ThemedText style={{ color: darkMode ? '#A0AEC0' : '#64748B' }}>Loading your saved transfers...</ThemedText>
          </View>
        ) : savedTransfers.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: darkMode ? '#232B45' : '#CBD5E1', backgroundColor: darkMode ? '#0D1122' : '#F1F5F9', marginBottom: 16 }}>
            <IconSymbol name="plus" color={darkMode ? '#64748B' : '#A0AEC0'} size={48} style={{ marginBottom: 12 }} />
            <ThemedText style={{ fontSize: 18, fontWeight: '600', color: darkMode ? '#CBD5E1' : '#334155', marginBottom: 4 }}>
              No saved transfers yet
            </ThemedText>
            <ThemedText style={{ color: darkMode ? '#64748B' : '#64748B' }}>
              Save your favorite transfer routes on the comparison page to access them quickly
            </ThemedText>
          </View>
        ) : (
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 32 }}>
            {savedTransfers.map((transfer) => (
              <ThemedView
                key={transfer.id}
                style={{
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                  padding: 24,
                  borderWidth: 1,
                  borderColor: cardBorder,
                  backgroundColor: cardBg,
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: darkMode ? '#fff' : '#222', marginBottom: 4 }}>
                      {transfer.name}
                    </ThemedText>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 0 }}>
                      <ThemedText style={{ backgroundColor: darkMode ? 'rgba(37,99,235,0.2)' : '#DBEAFE', color: darkMode ? '#60A5FA' : '#2563EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, fontSize: 16, fontWeight: '600' }}>
                        {transfer.from_currency}
                      </ThemedText>
                      <ThemedText style={{ color: darkMode ? '#64748B' : '#A0AEC0', fontSize: 18, marginHorizontal: 4 }}>→</ThemedText>
                      <ThemedText style={{ backgroundColor: darkMode ? 'rgba(22,163,74,0.2)' : '#DCFCE7', color: darkMode ? '#4ADE80' : '#16A34A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, fontSize: 16, fontWeight: '600' }}>
                        {transfer.to_currency}
                      </ThemedText>
                      <ThemedText style={{ color: darkMode ? '#A0AEC0' : '#64748B', fontSize: 15, marginLeft: 8 }}>
                        {transfer.amount.toLocaleString()}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={{ alignItems: 'center', minWidth: 60 }}>
                    <ThemedText style={{ fontWeight: '600', fontSize: 16, color: darkMode ? '#CBD5E1' : '#64748B' }}>{transfer.use_count}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: darkMode ? '#64748B' : '#A0AEC0' }}>times used</ThemedText>
                  </View>
                </View>
                <ThemedText style={{ fontSize: 12, color: darkMode ? '#64748B' : '#64748B', marginBottom: 12 }}>
                  Saved {new Date(transfer.created_at).toLocaleDateString()}
                </ThemedText>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => handleLoadTransfer(transfer)}
                    style={{ flex: 1, backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  >
                    <IconSymbol name="play" color="#fff" size={18} />
                    <ThemedText style={{ color: '#fff', fontWeight: '600', fontSize: 15, marginLeft: 6 }}>Run Comparison</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(transfer.id)}
                    disabled={deleting === transfer.id}
                    style={{ backgroundColor: darkMode ? 'rgba(239,68,68,0.15)' : '#FEE2E2', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, opacity: deleting === transfer.id ? 0.6 : 1 }}
                  >
                    {deleting === transfer.id ? (
                      <ActivityIndicator size="small" color={darkMode ? '#FCA5A5' : '#B91C1C'} />
                    ) : (
                      <IconSymbol name="trash" color={darkMode ? '#FCA5A5' : '#B91C1C'} size={18} />
                    )}
                    <ThemedText style={{ color: darkMode ? '#FCA5A5' : '#B91C1C', fontWeight: '600', fontSize: 15, marginLeft: 6 }}>Delete</ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            ))}
          </ScrollView>
        )}
      </View>
    </ThemedView>
  );
}
