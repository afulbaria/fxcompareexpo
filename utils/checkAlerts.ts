import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchLiveRates } from './fxApi';
import { scheduleNotification } from './notifications';

export async function checkAlerts() {
  const stored = await AsyncStorage.getItem('alerts');
  if (!stored) return;

  const alerts = JSON.parse(stored) as { from: string; to: string; targetRate: number }[];
  const rates = await fetchLiveRates(alerts.map(a => a.from), alerts.map(a => a.to));

  alerts.forEach(async (alert) => {
    const rate = rates[alert.from]?.[alert.to];
    if (rate && rate >= alert.targetRate) {
      await scheduleNotification(
        'Rate Alert Triggered!',
        `${alert.from} → ${alert.to} has reached your target of ${alert.targetRate}. Current rate: ${rate}`
      );
      // Optional: remove triggered alert
      // const updated = alerts.filter(a => a !== alert);
      // await AsyncStorage.setItem('alerts', JSON.stringify(updated));
    }
  });
}
