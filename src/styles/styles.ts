import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
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
    color: 'green',
  },
  statusDisconnected: {
    color: 'red',
  },
  userInfo: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  buttonSecondary: {
    backgroundColor: '#FF9800',
  },
  buttonCancel: {
    backgroundColor: '#999',
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
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  logsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  logText: {
    fontSize: 14,
    color: '#333',
  },
  logSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderColor: '#2196F3',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
  },
  tabTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2196F3',
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
    borderColor: '#eee',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  listItemSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
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
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#555',
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
    borderColor: '#eee',
  },
  bluetoothDeviceInfo: {
    flex: 1,
  },
  bluetoothDeviceName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  bluetoothDeviceAddress: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bluetoothConnectBtn: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
});
