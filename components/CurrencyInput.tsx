import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
  currencies: string[];
  darkMode: boolean;
}

export function CurrencyInput({ value, onChange, currencies, darkMode }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          borderColor: darkMode ? '#333' : '#ccc',
          borderRadius: 10,
          padding: 12,
          backgroundColor: darkMode ? '#1A1F3A' : '#fff',
        }}
      >
        <Text style={{ color: darkMode ? '#fff' : '#111', fontSize: 16 }}>
          {value}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          onPress={() => setOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: darkMode ? '#0D1122' : '#fff',
              borderRadius: 12,
              maxHeight: '70%',
            }}
          >
            <FlatList
              data={currencies}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  style={{
                    padding: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: darkMode ? '#333' : '#eee',
                  }}
                >
                  <Text style={{ color: darkMode ? '#fff' : '#111' }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
