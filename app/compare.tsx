import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProviderCard } from '../components/ProviderCard';
import { PROVIDERS } from '../data/providers';
import ProviderModal from './modal';

export default function CompareScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const amount = Number(params.amount);
  const darkModeInitial = params.dark === 'true';

  const [darkMode, setDarkMode] = useState(darkModeInitial);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites on mount
  useEffect(() => {
    (async () => {
      const favs = await AsyncStorage.getItem('favorites');
      if (favs) setFavorites(JSON.parse(favs));
    })();
  }, []);

  const toggleFavorite = async (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const providersWithNet = useMemo(() => {
    return PROVIDERS.map((p) => {
      const net = amount * p.rate - p.fee;
      return { ...p, net };
    }).sort((a, b) => b.net - a.net);
  }, [amount]);

  const bestProviderId = providersWithNet[0]?.id;
  const lowestFee = Math.min(...providersWithNet.map(p => p.fee));
  const highestRating = Math.max(...providersWithNet.map(p => p.rating));
  const fastestId = providersWithNet.find(p => p.speed === 'Instant')?.id;

  const bg = darkMode ? '#071027' : '#F3F4F6';
  const text = darkMode ? '#fff' : '#111';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={22} color={text} />
            <Text style={{ color: text, marginLeft: 6 }}>Back</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', height: 32 }}>
            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={18} color={text} style={{ marginRight: 6 }} />
            <Switch value={darkMode} onValueChange={setDarkMode} style={{ transform: [{ scale: 0.85 }] }} />
          </View>
        </View>

        {/* Providers */}
        <View style={{ gap: 16 }}>
          {providersWithNet.map((provider) => {
            const badges = [];
            const reasons = [];

            if (provider.id === bestProviderId) {
              badges.push({ label: 'Best overall', color: '#2563EB', bg: darkMode ? '#0B1225' : '#EFF6FF' });
              reasons.push('You receive the most money');
            }

            if (provider.fee === lowestFee) {
              badges.push({ label: 'Lowest fee', color: '#10B981', bg: darkMode ? '#062C22' : '#ECFDF5' });
              reasons.push('Lowest transfer fee');
            }

            if (provider.rating === highestRating) {
              badges.push({ label: 'Top rated', color: '#F59E0B', bg: darkMode ? '#2A1C00' : '#FFFBEB' });
            }

            if (provider.id === fastestId) {
              badges.push({ label: 'Fastest', color: '#6366F1', bg: darkMode ? '#0B1225' : '#EEF2FF' });
            }

            return (
              <ProviderCard
                key={provider.id}
                provider={provider}
                amount={amount}
                darkMode={darkMode}
                highlight={provider.id === bestProviderId}
                reasons={provider.id === bestProviderId ? reasons : undefined}
                badges={badges}
                isFavorite={favorites.includes(provider.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={(p) => {
                  setSelectedProvider(p);
                  setModalVisible(true);
                }}
              />
            );
          })}
        </View>
      </ScrollView>

      <ProviderModal
        provider={selectedProvider}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
}
