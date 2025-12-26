import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  provider: any;
  amount: number;
  darkMode: boolean;
  highlight?: boolean;
  reasons?: string[];
  badges?: { label: string; color: string; bg: string }[];
  saveText?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onViewDetails: (p: any) => void;
};

export function ProviderCard({
  provider,
  amount,
  darkMode,
  highlight,
  reasons,
  badges,
  saveText,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
}: Props) {
  const bg = darkMode ? '#0D1122' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#111827';
  const muted = darkMode ? '#9CA3AF' : '#6B7280';

  const trendIcon =
    provider.trend === 'up'
      ? 'arrow-up'
      : provider.trend === 'down'
      ? 'arrow-down'
      : 'remove';
  const trendColor =
    provider.trend === 'up'
      ? '#10B981'
      : provider.trend === 'down'
      ? '#EF4444'
      : muted;

  const logoSource = darkMode ? provider.logo.light : provider.logo.dark;

  // Animation refs
  const badgeAnimations = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    if (badges?.length && badgeAnimations.length === 0) {
      // Initialize Animated.Values
      badges.forEach(() => badgeAnimations.push(new Animated.Value(0)));

      // Animate badges sequentially
      Animated.stagger(
        100,
        badgeAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [badges]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onViewDetails(provider)}
      style={{
        backgroundColor: bg,
        borderRadius: 20,
        padding: 16,
        borderWidth: highlight ? 2 : 1,
        borderColor: highlight ? '#2563EB' : darkMode ? '#1F2937' : '#E5E7EB',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {logoSource && (
          <Image
            source={logoSource}
            style={{ width: 36, height: 36, resizeMode: 'contain' }}
          />
        )}

        <View style={{ flex: 1 }}>
          {/* Name + favorite */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: text, fontSize: 16, fontWeight: '700' }}>
              {provider.name}
            </Text>

            {onToggleFavorite && (
              <TouchableOpacity onPress={() => onToggleFavorite(provider.id)}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite ? '#EF4444' : muted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Animated Badges */}
          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              marginTop: 6,
              flexWrap: 'wrap',
            }}
          >
            {badges?.map((b, i) => {
              const anim = badgeAnimations[i] || new Animated.Value(0);
              return (
                <Animated.View
                  key={i}
                  style={{
                    opacity: anim,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      },
                    ],
                    backgroundColor: b.bg,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: b.color,
                    }}
                  >
                    {b.label}
                  </Text>
                </Animated.View>
              );
            })}
          </View>

          {/* Speed / FCA */}
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 6,
              flexWrap: 'wrap',
            }}
          >
            <View
              style={{
                backgroundColor: darkMode ? '#0B1225' : '#F1F5F9',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text style={{ fontSize: 12, color: muted }}>{provider.speed}</Text>
            </View>

            {provider.fca && (
              <View
                style={{
                  backgroundColor: darkMode ? '#062C22' : '#ECFDF5',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontSize: 12, color: '#10B981' }}>FCA Regulated</Text>
              </View>
            )}
          </View>

          {/* Rating */}
          <Text style={{ marginTop: 4, fontSize: 12, color: muted }}>
            ⭐ {provider.rating.toFixed(1)} user rating
          </Text>
        </View>
      </View>

      {/* Rate, Fee, Trend */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Text style={{ color: muted }}>Rate: {provider.rate}</Text>
        <Ionicons name={trendIcon as any} size={16} color={trendColor} />
        <Text style={{ color: muted }}>Fee: £{provider.fee}</Text>
        {saveText && (
          <Text style={{ color: '#2563EB', fontWeight: '600' }}>{saveText}</Text>
        )}
      </View>

      {/* Reasons why best */}
      {highlight && reasons?.length > 0 && (
        <View
          style={{
            marginTop: 10,
            backgroundColor: darkMode ? '#0B1225' : '#F1F5F9',
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: darkMode ? '#93C5FD' : '#2563EB',
            }}
          >
            Why this is best
          </Text>

          {reasons.map((r, i) => (
            <Text
              key={i}
              style={{
                fontSize: 12,
                color: darkMode ? '#CBD5E1' : '#475569',
                marginTop: 2,
              }}
            >
              • {r}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
