// data/mockData.ts

export const CURRENCIES = [
  'GBP',
  'EUR',
  'USD',
  'INR',
  'PKR',
  'AUD',
  'CAD',
  'CHF',
  'JPY',
  'CNY',
  'AED',
];

export type Provider = {
  id: string;
  name: string;
  fee: number;
  markup: number;
  trustScore: number;
  speed: 'fast' | 'medium' | 'slow';
  fcaAuthorised: boolean;
  payoutMethods: string[];
  referralLink: string;
};

export const PROVIDERS: Provider[] = [
  {
    id: 'wise',
    name: 'Wise',
    fee: 0.5,
    markup: 0.4,
    trustScore: 4.8,
    speed: 'fast',
    fcaAuthorised: true,
    payoutMethods: ['Bank Transfer', 'Debit Card'],
    referralLink: 'https://wise.com',
  },
  {
    id: 'remitly',
    name: 'Remitly',
    fee: 1.99,
    markup: 0.6,
    trustScore: 4.5,
    speed: 'medium',
    fcaAuthorised: true,
    payoutMethods: ['Bank Transfer', 'Cash Pickup'],
    referralLink: 'https://remitly.com',
  },
  {
    id: 'western-union',
    name: 'Western Union',
    fee: 3.5,
    markup: 1.2,
    trustScore: 4.2,
    speed: 'slow',
    fcaAuthorised: true,
    payoutMethods: ['Cash Pickup'],
    referralLink: 'https://westernunion.com',
  },
];

export function getExchangeRate(from: string, to: string) {
  if (from === to) return 1;
  return 1.12; // mock rate for now
}
