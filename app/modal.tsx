import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export default function ProviderModal({
  provider,
  visible,
  onClose,
  darkMode,
}: any) {
  if (!provider) return null;

  const bg = darkMode ? '#071027' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#111827';
  const muted = darkMode ? '#9CA3AF' : '#6B7280';

  const feeAmount = provider.fee;
  const rate = provider.rate;
  const received = ((1000 - feeAmount) * rate).toFixed(2); // example based on amount

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: bg,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 20,
          }}
        >
          <Text style={{ color: text, fontSize: 18, fontWeight: '800' }}>
            {provider.name}
          </Text>

          <Text style={{ color: muted, marginTop: 4 }}>
            Fee transparency
          </Text>

          <View style={{ marginTop: 16 }}>
            <Row label="Amount sent" value="£1000.00" text={text} />
            <Row label="Transfer fee" value={`- £${feeAmount.toFixed(2)}`} text={text} />
            <Row label="Exchange rate" value={rate.toString()} text={text} />
            <Row label="Recipient gets" value={`${received}`} text={text} highlight />
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={{
              marginTop: 24,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: '#2563EB',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value, text, highlight }: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 6,
      }}
    >
      <Text style={{ color: text, fontSize: highlight ? 16 : 14, fontWeight: highlight ? '700' : '500' }}>
        {label}
      </Text>
      <Text style={{ color: text, fontSize: highlight ? 16 : 14, fontWeight: highlight ? '700' : '500' }}>
        {value}
      </Text>
    </View>
  );
}
