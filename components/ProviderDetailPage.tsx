import React from 'react';
import { CheckCircle2, Linking, Modal, ScrollView, Shield, Text, TouchableOpacity, View, X } from 'react-native';

import { useTailwind } from 'tailwind-rn';
import { Provider } from '../data/mockData';

interface ProviderDetailPageProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function ProviderDetailPage({ provider, isOpen, onClose, darkMode }: ProviderDetailPageProps) {
  const tailwind = useTailwind();

  if (!provider) return null;

  const bgClass = darkMode ? 'bg-[#0D1122]' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const mutedClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={tailwind('flex-1 justify-center items-center bg-black/50 p-4')}>
        <View style={tailwind(`rounded-2xl p-4 w-full max-h-[90%] border ${bgClass}`)}>
          <View style={tailwind(`flex-row justify-between items-center border-b pb-2 ${borderClass}`)}>
            <Text style={tailwind(`text-xl font-bold ${textClass}`)}>{provider.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={darkMode ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={tailwind('mt-3')}>
            {provider.fcaAuthorised && (
              <View style={tailwind(`flex-row items-center p-3 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} mb-3`)}>
                <Shield size={16} color={darkMode ? '#34D399' : '#059669'} />
                <Text style={tailwind(`ml-2 font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`)}>FCA Authorised</Text>
              </View>
            )}

            <View style={tailwind(`p-4 rounded-lg ${darkMode ? 'bg-[#1A1F3A]' : 'bg-gray-50'} mb-3`)}>
              <View style={tailwind('flex-row justify-between mb-1')}>
                <Text style={tailwind(`${mutedClass}`)}>Transfer Fee</Text>
                <Text style={tailwind(`${textClass} font-semibold`)}>£{provider.fee.toFixed(2)}</Text>
              </View>
              <View style={tailwind('flex-row justify-between mb-1')}>
                <Text style={tailwind(`${mutedClass}`)}>Markup</Text>
                <Text style={tailwind(`${textClass} font-semibold`)}>{provider.markup.toFixed(2)}%</Text>
              </View>
              <View style={tailwind('flex-row justify-between')}>
                <Text style={tailwind(`${mutedClass}`)}>Trust Score</Text>
                <Text style={tailwind(`${textClass} font-semibold`)}>{provider.trustScore.toFixed(1)}/5.0</Text>
              </View>
            </View>

            <View style={tailwind('mb-3')}>
              <Text style={tailwind(`font-semibold ${textClass} mb-1`)}>Speed</Text>
              <Text style={tailwind(`${mutedClass}`)}>{provider.speed.charAt(0).toUpperCase() + provider.speed.slice(1)}</Text>
            </View>

            <View style={tailwind('mb-3')}>
              <Text style={tailwind(`font-semibold ${textClass} mb-1`)}>Payout Methods</Text>
              <View style={tailwind('flex-row flex-wrap gap-2')}>
                {provider.payoutMethods.map((method) => (
                  <View
                    key={method}
                    style={tailwind(`flex-row items-center px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mr-2 mb-2`)}
                  >
                    <CheckCircle2 size={14} color={darkMode ? 'white' : 'black'} />
                    <Text style={tailwind(`ml-1 ${textClass} text-xs`)}>{method}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={tailwind('bg-blue-600 py-3 rounded-lg mb-4')}
              onPress={() => Linking.openURL(provider.referralLink)}
            >
              <Text style={tailwind('text-white text-center font-semibold')}>Go to Provider</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
