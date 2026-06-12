import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import bt from '@/services/bluetooth';
import { useAuth } from '@/contexts/AuthContext';
import { useStyles } from '@/styles/styles';


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

  const styles = useStyles();
  const { user, logout } = useAuth();


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Controle de Acesso</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <Text style={styles.userInfo}>Bem-vindo, {user.nome}</Text>
      )}

      {/* <Text style={styles.title}>Bluetooth </Text> */}
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
            <TouchableOpacity
              onPress={() => handleConnect(item.address)}
              style={styles.bluetoothDeviceItem}
            >
              <View style={styles.bluetoothDeviceInfo}>
                <Text style={styles.bluetoothDeviceName}>{item.name}</Text>
                <Text style={styles.bluetoothDeviceAddress}>{item.address}</Text>
              </View>
              <Text style={styles.bluetoothConnectBtn}>Conectar</Text>
            </TouchableOpacity>
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
