import { Platform, PermissionsAndroid } from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice as RNDevice,
} from 'react-native-bluetooth-classic';

interface BluetoothDevice {
  address: string;
  name: string;
}

type EventHandler = (data: any) => void;

class BluetoothService {
  private nativeDevice: RNDevice | null = null;
  private listeners: { [event: string]: EventHandler[] } = {};
  private dataSubscription: { remove: () => void } | null = null;
  private _connected: boolean = false;

  get isConnected(): boolean {
    return this._connected;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const apiLevel = Platform.Version as number;
      if (apiLevel >= 31) {
        const granted = await PermissionsAndroid.requestMultiple([
          'android.permission.BLUETOOTH_SCAN',
          'android.permission.BLUETOOTH_CONNECT',
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        const allGranted = Object.values(granted).every(
          (result) => result === PermissionsAndroid.RESULTS.GRANTED,
        );
        return allGranted;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch {
      return false;
    }
  }

  async getBondedDevices(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map((d: RNDevice) => ({
        address: d.address,
        name: d.name || 'Desconhecido',
      }));
    } catch (error) {
      console.error('[BT] Erro ao buscar dispositivos:', error);
      return [];
    }
  }

  async startDiscovery(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      return devices.map((d: RNDevice) => ({
        address: d.address,
        name: d.name || 'Desconhecido',
      }));
    } catch (error) {
      console.error('[BT] Erro ao escanear:', error);
      return [];
    }
  }

  async cancelDiscovery(): Promise<void> {
    try {
      await RNBluetoothClassic.cancelDiscovery();
    } catch (error) {
      console.error('[BT] Erro ao cancelar scan:', error);
    }
  }

  async connect(address: string): Promise<boolean> {
    try {
      if (this.nativeDevice) {
        await this.disconnect();
      }

      const device = await RNBluetoothClassic.connectToDevice(address, {
        delimiter: '\n',
        charset: 'ascii',
      });

      this.nativeDevice = device;
      this._connected = true;

      this.dataSubscription = device.onDataReceived((event) => {
        const message = event.data || '';
        this.emit('data', message);

        if (message.includes('PORTAO_ABERTO')) this.emit('PORTAO_ABERTO', {});
        else if (message.includes('PORTAO_FECHADO')) this.emit('PORTAO_FECHADO', {});
        else if (message.includes('OK')) this.emit('COMANDO_OK', { message });
        else if (message.includes('ERRO')) this.emit('COMANDO_ERRO', { message });
      });

      this.emit('connected', { address });
      return true;
    } catch (error) {
      console.error('[BT] Erro ao conectar:', error);
      this._connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.dataSubscription) {
        this.dataSubscription.remove();
        this.dataSubscription = null;
      }

      if (this.nativeDevice) {
        await this.nativeDevice.disconnect();
        this.nativeDevice = null;
      }

      this._connected = false;
      this.emit('disconnected', {});
    } catch (error) {
      console.error('[BT] Erro ao desconectar:', error);
      this._connected = false;
    }
  }

  async send(command: string): Promise<boolean> {
    if (!this.nativeDevice || !this._connected) {
      console.warn('[BT] Não conectado a nenhum dispositivo');
      return false;
    }

    try {
      await this.nativeDevice.write(`${command}\n`);
      this.emit('sent', { command });
      return true;
    } catch (error) {
      console.error('[BT] Erro ao enviar comando:', error);
      this._connected = false;
      this.emit('disconnected', {});
      return false;
    }
  }

  async openGate(): Promise<boolean> {
    return this.send('OPEN');
  }

  async lockGate(): Promise<boolean> {
    return this.send('CLOSE');
  }

  async requestStatus(): Promise<boolean> {
    return this.send('STATUS');
  }

  on(event: string, handler: EventHandler): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);

    return () => {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler);
    };
  }

  private emit(event: string, data: any): void {
    const handlers = this.listeners[event] || [];
    handlers.forEach((handler) => handler(data));
  }

  removeAllListeners(): void {
    this.listeners = {};
  }
}

export default new BluetoothService();
