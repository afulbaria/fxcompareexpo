import { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import CompareScreen from './app/compare';
import { Homepage } from './components/Homepage';
import { Navigation } from './components/Navigation';
import { ProviderDetailPage } from './components/ProviderDetailPage';
import { RateAlertsPage } from './components/RateAlertsPage';
import { SavedTransfersPage } from './components/SavedTransfersPage';

// type definitions
type Page = 'home' | 'compare' | 'provider' | 'alerts' | 'savedTransfers';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProviderId] = useState<string | null>(null);
  const [compareParams, setCompareParams] = useState<{ from: string; to: string; amount: number } | null>(null);
  const [darkMode, setDarkMode] = useState(false); // For now, not persisted

  // To persist darkMode, use AsyncStorage and useEffect if desired
  // useEffect(() => { ... }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleNavigate = (newPage: 'home' | 'alerts' | 'savedTransfers') => setPage(newPage);

  const handleBack = () => {
    if (page === 'provider') setPage('compare');
    else if (page === 'savedTransfers') setPage('home');
    else setPage('home');
  };

  // When user triggers a comparison from Homepage or SavedTransfersPage
  const handleCompare = (from: string, to: string, amount: number) => {
    setCompareParams({ from, to, amount });
    setPage('compare');
  };

  // For SavedTransfersPage
  const handleLoadSavedTransfer = (from: string, to: string, amount: number) => {
    handleCompare(from, to, amount);
  };

  const bgColor = darkMode ? '#071027' : '#F0F6FF';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>  
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      {/* Navigation for non-home pages */}
      {page !== 'home' && (
        <Navigation
          currentPage={page}
          onNavigate={handleNavigate}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      {/* Homepage */}
      {page === 'home' && (
        <Homepage
          onCompare={handleCompare}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
      {/* Comparison page (from /app/compare.tsx) */}
      {page === 'compare' && compareParams && (
        <CompareScreen key={JSON.stringify(compareParams)} />
      )}
      {/* Provider detail page */}
      {page === 'provider' && selectedProviderId && (
        <ProviderDetailPage
          providerId={selectedProviderId}
          onBack={handleBack}
        />
      )}
      {/* Rate alerts page */}
      {page === 'alerts' && (
        <RateAlertsPage
          onBack={() => setPage('home')}
        />
      )}
      {/* Saved transfers page */}
      {page === 'savedTransfers' && (
        <SavedTransfersPage
          onBack={() => setPage('home')}
          onLoadTransfer={handleLoadSavedTransfer}
          darkMode={darkMode}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    width: '100%',
  },
});
