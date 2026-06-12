import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Clipboard } from 'react-native';
import bt from '@/services/bluetooth';
import { useDevice } from '@/contexts/DeviceContext';
import { styles } from '@/styles/styles';

interface BluetoothDevice {
  address: string;
  name: string;
}

interface LogEntry {
  id: string;
  message: string;
  time: string;
}

export default function BluetoothScreen() {
  const { selectedDevice } = useDevice();
  const [deviceList, setDeviceList] = useState<BluetoothDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<string | null>(null);
  const [btEnabled, setBtEnabled] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    checkPermissions();

    const unsubConnected = bt.on('connected', (data: any) => {
      setConnected(true);
      setConnectedDevice(data.address);
      addLog(`Conectado ao dispositivo ${data.address}`);
    });

    const unsubDisconnected = bt.on('disconnected', () => {
      setConnected(false);
      setConnectedDevice(null);
      addLog('Desconectado');
    });

    const unsubData = bt.on('data', (data: string) => {
      addLog(`Recebido: ${data}`);
    });

    const unsubOpen = bt.on('PORTAO_ABERTO', () => {
      addLog('Portão aberto via Bluetooth');
    });

    const unsubClose = bt.on('PORTAO_FECHADO', () => {
      addLog('Portão fechado via Bluetooth');
    });

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubData();
      unsubOpen();
      unsubClose();
    };
  }, []);

  // Conectar automaticamente quando um device é selecionado
  useEffect(() => {
    if (selectedDevice && !connected) {
      addLog(`Device selecionado: ${selectedDevice.nome}`);
      handleConnect(selectedDevice.serial_number);
    }
  }, [selectedDevice]);

  async function checkPermissions() {
    const granted = await bt.requestPermissions();
    setBtEnabled(granted);
  }

  async function handleScan() {
    setScanning(true);

    const bonded = await bt.getBondedDevices();
    if (bonded.length > 0) {
      setDeviceList(bonded);
      addLog(`${bonded.length} dispositivo(s) pareado(s) encontrado(s)`);
    }

    const discovered = await bt.startDiscovery();
    const merged = new Map<string, BluetoothDevice>();

    for (const d of [...bonded, ...discovered]) {
      merged.set(d.address, d);
    }

    setDeviceList(Array.from(merged.values()));
    addLog(`Scan finalizado: ${merged.size} dispositivo(s)`);
    setScanning(false);
  }

  async function handleConnect(address: string) {
    addLog(`Conectando a ${address}...`);
    const success = await bt.connect(address);
    if (success) {
      addLog('Conexão estabelecida!');
    } else {
      addLog('Falha na conexão');
      Alert.alert('Erro', 'Não foi possível conectar ao dispositivo');
    }
  }

  async function handleCopyAddress(address: string) {
    await Clipboard.setString(address);
    Alert.alert('Sucesso', `Endereço copiado: ${address}`);
  }

  async function handleDisconnect() {
    await bt.disconnect();
  }

  async function handleOpenGate() {
    addLog('Solicitando abertura...');
    const sent = await bt.openGate();
    if (!sent) addLog('Erro: não conectado');
  }

  async function handleLockGate() {
    addLog('Solicitando fechamento...');
    const sent = await bt.lockGate();
    if (!sent) addLog('Erro: não conectado');
  }

  function addLog(message: string): void {
    setLogs((prev) => [
      { id: Date.now().toString(), message, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth</Text>
      {selectedDevice && (
        <Text style={styles.subtitle}>Device: {selectedDevice.nome}</Text>
      )}
      <Text style={styles.subtitle}>Controle direto via Bluetooth</Text>

      <View style={styles.bluetoothStatusRow}>
        <Text style={styles.bluetoothLabel}>Status:</Text>
        <View
          style={[
            styles.bluetoothStatusDot,
            { backgroundColor: connected ? 'green' : btEnabled ? 'orange' : 'red' },
          ]}
        />
        <Text
          style={[
            styles.bluetoothStatusText,
            { color: connected ? 'green' : btEnabled ? 'orange' : 'red' },
          ]}
        >
          {connected ? `Conectado ${connectedDevice ? `(${connectedDevice})` : ''}` : btEnabled ? 'Pronto para conectar' : 'Bluetooth não habilitado'}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={connected ? handleDisconnect : handleScan}
          style={[styles.button, connected && styles.buttonSecondary, scanning && styles.buttonDisabled]}
          disabled={scanning}
        >
          <Text style={styles.buttonText}>
            {scanning ? 'Escaneando...' : connected ? 'Desconectar' : 'Escanear'}
          </Text>
        </TouchableOpacity>
      </View>

      {!connected && deviceList.length > 0 && (
        <FlatList
          data={deviceList}
          keyExtractor={(item) => item.address}
          style={styles.bluetoothDeviceList}
          renderItem={({ item }) => (
            <View style={styles.bluetoothDeviceItem}>
              <View style={styles.bluetoothDeviceInfo}>
                <Text style={styles.bluetoothDeviceName}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleCopyAddress(item.address)}>
                  <Text style={styles.bluetoothDeviceAddress}>{item.address}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bluetoothDeviceActions}>
                <TouchableOpacity
                  onPress={() => handleCopyAddress(item.address)}
                  style={[styles.button, styles.buttonSmall]}
                >
                  <Text style={styles.buttonText}>Copiar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleConnect(item.address)}
                  style={[styles.button, styles.buttonSmall]}
                >
                  <Text style={styles.buttonText}>Conectar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {!connected && deviceList.length === 0 && !scanning && btEnabled && (
        <Text style={styles.emptyText}>
          Nenhum dispositivo encontrado.{'\n'}Toque em "Escanear" para procurar dispositivos Bluetooth.
        </Text>
      )}

      {connected && (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleOpenGate} style={styles.button}>
            <Text style={styles.buttonText}>ABRIR PORTÃO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLockGate}
            style={[styles.button, styles.buttonSecondary]}
          >
            <Text style={styles.buttonText}>FECHAR PORTÃO</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.logsTitle}>Log Bluetooth</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: 200 }}
        renderItem={({ item }) => (
          <View style={styles.logItem}>
            <Text style={styles.logText}>
              {item.time} - {item.message}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
