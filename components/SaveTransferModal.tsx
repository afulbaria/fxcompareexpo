import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, useState } from 'react-native';


// TODO: Replace with your actual saveTransfer implementation
async function saveTransfer(transfer: any) {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

interface SaveTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export function SaveTransferModal({
  isOpen,
  onClose,
  fromCurrency,
  toCurrency,
  amount,
}: SaveTransferModalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';
  const [name, setName] = useState(`${fromCurrency} to ${toCurrency}`);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name for this transfer');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await saveTransfer({
        user_email: null,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        amount,
        name: name.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setName(`${fromCurrency} to ${toCurrency}`);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to save transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, darkMode ? styles.modalDark : styles.modalLight]}>
          <View style={styles.header}>
            <ThemedText type="title">Save This Transfer</ThemedText>
            <TouchableOpacity onPress={onClose} disabled={loading} style={styles.closeBtn}>
              <Text style={{ fontSize: 22, color: darkMode ? '#E6EEF6' : '#222' }}>×</Text>
            </TouchableOpacity>
          </View>

          {success && (
            <View style={[styles.alert, darkMode ? styles.successDark : styles.successLight]}>
              <Text style={{ color: darkMode ? '#6EE7B7' : '#166534', fontWeight: 'bold' }}>Transfer saved successfully!</Text>
            </View>
          )}

          {error && (
            <View style={[styles.alert, darkMode ? styles.errorDark : styles.errorLight]}>
              <Text style={{ color: darkMode ? '#FCA5A5' : '#B91C1C' }}>{error}</Text>
            </View>
          )}

          <View style={styles.section}>
            <ThemedText type="subtitle">Transfer Details</ThemedText>
            <View style={[styles.detailsBox, darkMode ? styles.detailsDark : styles.detailsLight]}>
              <View style={styles.rowBetween}>
                <Text style={{ color: darkMode ? '#9CA3AF' : '#374151' }}>From:</Text>
                <Text style={{ color: darkMode ? '#E6EEF6' : '#222', fontWeight: 'bold' }}>{fromCurrency}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={{ color: darkMode ? '#9CA3AF' : '#374151' }}>To:</Text>
                <Text style={{ color: darkMode ? '#E6EEF6' : '#222', fontWeight: 'bold' }}>{toCurrency}</Text>
              </View>
              <View style={styles.rowBetween}>
                <Text style={{ color: darkMode ? '#9CA3AF' : '#374151' }}>Amount:</Text>
                <Text style={{ color: darkMode ? '#E6EEF6' : '#222', fontWeight: 'bold' }}>{amount.toLocaleString()} {fromCurrency}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText>Nickname for this transfer</ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Monthly rent payment"
              editable={!loading}
              style={[
                styles.input,
                darkMode ? styles.inputDark : styles.inputLight,
                loading && { opacity: 0.5 },
              ]}
              placeholderTextColor={darkMode ? '#6B7280' : '#9CA3AF'}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading || success}
              style={[styles.cancelBtn, darkMode ? styles.cancelDark : styles.cancelLight, (loading || success) && { opacity: 0.5 }]}
            >
              <Text style={{ color: darkMode ? '#fff' : '#222', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={loading || success}
              style={[styles.saveBtn, (loading || success) && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              ) : null}
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{success ? 'Saved!' : loading ? 'Saving...' : 'Save Transfer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalDark: {
    backgroundColor: '#0D1122',
    borderColor: '#374151',
    borderWidth: 1,
  },
  modalLight: {
    backgroundColor: '#fff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
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
  section: {
    marginBottom: 18,
  },
  detailsBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  detailsDark: {
    backgroundColor: '#1A1F3A',
  },
  detailsLight: {
    backgroundColor: '#F3F4F6',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelDark: {
    backgroundColor: '#374151',
  },
  cancelLight: {
    backgroundColor: '#E5E7EB',
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
