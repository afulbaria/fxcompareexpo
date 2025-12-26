export const PROVIDERS = [
  {
    id: 'wise',
    name: 'Wise',
    rate: 1.16,
    fee: 3.2,
    fca: true,
    speed: 'Instant',
    rating: 4.8,
    logo: {
      light: require('../assets/logos/wise-light.png'),
      dark: require('../assets/logos/wise-dark.png'),
    },
  },
  {
    id: 'revolut',
    name: 'Revolut',
    rate: 1.15,
    fee: 2.5,
    fca: true,
    speed: 'Same day',
    rating: 4.6,
    logo: {
      light: require('../assets/logos/revolut-light.png'),
      dark: require('../assets/logos/revolut-dark.png'),
    },
  },
  {
    id: 'paypal',
    name: 'PayPal',
    rate: 1.12,
    fee: 4.1,
    fca: false,
    speed: '1–2 days',
    rating: 4.2,
    logo: {
      light: require('../assets/logos/paypal-light.png'),
      dark: require('../assets/logos/paypal-dark.png'),
    },
  },
];
