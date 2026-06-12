import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { lightColors, ThemeColors } from './theme';

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 70,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 30,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    statusText: {
      textAlign: 'center',
      marginBottom: 10,
    },
    statusConnected: {
      color: colors.success,
    },
    statusDisconnected: {
      color: colors.danger,
    },
    userInfo: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 15,
      fontSize: 16,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
      marginVertical: 5,
    },
    buttonSecondary: {
      backgroundColor: colors.secondary,
    },
    buttonCancel: {
      backgroundColor: colors.textTertiary,
      flex: 1,
      marginRight: 10,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '600',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
      marginVertical: 20,
    },
    linkText: {
      color: colors.primary,
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
    },
    logoutButton: {
      padding: 8,
    },
    logoutText: {
      color: colors.danger,
      fontSize: 16,
      fontWeight: '600',
    },
    logsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.text,
    },
    logItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    logText: {
      fontSize: 14,
      color: colors.text,
    },
    logSubtext: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 2,
    },
    tabBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.tabBar,
    },
    tabItem: {
      flex: 1,
      padding: 12,
      alignItems: 'center',
    },
    tabItemActive: {
      borderTopWidth: 2,
      borderColor: colors.primary,
    },
    tabText: {
      fontSize: 12,
      color: colors.textTertiary,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    screenHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    listItemContent: {
      flex: 1,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    listItemSubtitle: {
      fontSize: 13,
      color: colors.textTertiary,
      marginTop: 2,
    },
    deleteButton: {
      backgroundColor: colors.danger,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '500',
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textTertiary,
      marginTop: 40,
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.overlay,
      padding: 20,
    },
    modalContent: {
      backgroundColor: colors.modalContent,
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.text,
    },
    modalButtons: {
      flexDirection: 'row',
      marginTop: 10,
    },

    // Bluetooth
    bluetoothStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 15,
    },
    bluetoothStatusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginHorizontal: 8,
    },
    bluetoothStatusText: {
      fontSize: 14,
      fontWeight: '500',
    },
    bluetoothLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    bluetoothDeviceList: {
      maxHeight: 200,
      marginBottom: 10,
    },
    bluetoothDeviceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderColor: colors.borderLight,
    },
    bluetoothDeviceInfo: {
      flex: 1,
    },
    bluetoothDeviceName: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    bluetoothDeviceAddress: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 2,
    },
    bluetoothConnectBtn: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}

export function useStyles() {
  const { colors } = useTheme();
  return createStyles(colors);
}

export const styles = createStyles(lightColors);
