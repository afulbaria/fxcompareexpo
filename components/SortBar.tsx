import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTailwind } from 'tailwind-rn';

export type SortOption = 'best-rate' | 'lowest-fee' | 'fca-only';

interface SortBarProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  darkMode: boolean;
}

export function SortBar({ value, onChange, darkMode }: SortBarProps) {
  const tailwind = useTailwind();

  const options: { value: SortOption; label: string }[] = [
    { value: 'best-rate', label: 'Best Rate' },
    { value: 'lowest-fee', label: 'Lowest Fee' },
    { value: 'fca-only', label: 'FCA Only' },
  ];

  const bgColor = darkMode ? 'bg-[#1A1F3A]' : 'bg-gray-50';
  const activeColor = 'bg-blue-600 text-white';
  const inactiveColor = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tailwind(`rounded-lg p-2 ${bgColor} mb-4`)}>
      <View style={tailwind('flex-row gap-2')}>
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onChange(option.value)}
              style={tailwind(
                `px-4 py-2 rounded-lg ${isActive ? activeColor : ''}`
              )}
            >
              <Text style={tailwind(`${isActive ? 'text-white' : inactiveColor} font-medium text-sm`)}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
