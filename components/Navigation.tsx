import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'alerts' | 'savedTransfers') => void;
  onToggleDarkMode: () => void;
}

export function Navigation({ currentPage, onNavigate, onToggleDarkMode }: NavigationProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const darkMode = colorScheme === 'dark';
  const colors = Colors[darkMode ? 'dark' : 'light'];

  return (
    <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: darkMode ? '#374151' : '#E5E7EB' }]}> 
      <TouchableOpacity
        onPress={() => onNavigate('home')}
        style={styles.left}
        accessibilityRole="button"
      >
        <IconSymbol name="chevron.left.forwardslash.chevron.right" size={26} color={colors.tint} />
        <ThemedText type="title" style={{ marginLeft: 8 }}>{'FXCompare UK'}</ThemedText>
      </TouchableOpacity>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={() => onNavigate('savedTransfers')}
          style={[styles.iconBtn, currentPage === 'savedTransfers' && { backgroundColor: colors.tint }]}
          accessibilityRole="button"
        >
          <IconSymbol name="house.fill" size={22} color={currentPage === 'savedTransfers' ? '#fff' : colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigate('alerts')}
          style={[styles.iconBtn, currentPage === 'alerts' && { backgroundColor: colors.tint }]}
          accessibilityRole="button"
        >
          <IconSymbol name="paperplane.fill" size={22} color={currentPage === 'alerts' ? '#fff' : colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onToggleDarkMode}
          style={styles.iconBtn}
          accessibilityRole="button"
        >
          <IconSymbol name={darkMode ? 'chevron.right' : 'chevron.right'} size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 50,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
