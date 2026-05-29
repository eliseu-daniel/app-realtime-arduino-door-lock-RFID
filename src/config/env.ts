import Constants from 'expo-constants';

interface Env {
  apiUrl: string;
  wsUrl: string;
}

const extra = Constants.expoConfig?.extra as Record<string, any> | undefined;

export const env: Env = {
  apiUrl: (extra?.apiUrl as string) || 'http://localhost:3000/api',
  wsUrl: (extra?.wsUrl as string) || 'ws://localhost:3000',
};
