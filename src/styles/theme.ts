export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  placeholder: string;
  overlay: string;
  tabBar: string;
  modalContent: string;
  inputBackground: string;
}

export const lightColors: ThemeColors = {
  background: '#fff',
  surface: '#f5f5f5',
  text: '#333',
  textSecondary: '#666',
  textTertiary: '#999',
  border: '#ccc',
  borderLight: '#eee',
  primary: '#2196F3',
  secondary: '#FF9800',
  success: 'green',
  danger: '#e74c3c',
  placeholder: '#999',
  overlay: 'rgba(0,0,0,0.5)',
  tabBar: '#fff',
  modalContent: '#fff',
  inputBackground: '#fff',
};

export const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#e0e0e0',
  textSecondary: '#aaaaaa',
  textTertiary: '#777777',
  border: '#444',
  borderLight: '#333',
  primary: '#64b5f6',
  secondary: '#ffb74d',
  success: '#66bb6a',
  danger: '#ef5350',
  placeholder: '#777',
  overlay: 'rgba(0,0,0,0.7)',
  tabBar: '#1e1e1e',
  modalContent: '#1e1e1e',
  inputBackground: '#2a2a2a',
};
