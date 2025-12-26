import { RateAlertsPage } from '../components/RateAlertsPage';
import { useRouter } from 'expo-router';

export default function AlertsScreen() {
  const router = useRouter();
  return <RateAlertsPage onBack={() => router.back()} />;
}
