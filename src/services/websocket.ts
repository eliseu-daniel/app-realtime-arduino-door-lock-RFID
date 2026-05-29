import { env } from '../config/env';

interface WebSocketMessage {
  event: string;
  token?: string | null;
  [key: string]: any;
}

type EventHandler = (data: WebSocketMessage) => void;

class AccessControlWS {
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private listeners: { [event: string]: EventHandler[] } = {};
  private reconnectInterval: number = 5000;
  private isConnected: boolean = false;

  connect(token: string): void {
    this.token = token;

    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(env.wsUrl);

    this.ws.onopen = (): void => {
      console.log('[WS] Conectado ao servidor');
      this.isConnected = true;

      this.send({
        event: 'AUTHENTICATE',
        token: this.token,
      });
    };

    this.ws.onmessage = (event: MessageEvent): void => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('[WS] Evento recebido:', data.event);

        const handlers = this.listeners[data.event] || [];
        handlers.forEach((handler) => handler(data));

        const allHandlers = this.listeners['*'] || [];
        allHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error('[WS] Erro ao processar mensagem:', error);
      }
    };

    this.ws.onerror = (error: Event): void => {
      console.error('[WS] Erro na conexão:', (error as any).message);
    };

    this.ws.onclose = (): void => {
      console.log('[WS] Desconectado');
      this.isConnected = false;

      setTimeout(() => {
        if (this.token) {
          console.log('[WS] Tentando reconectar...');
          this.connect(this.token);
        }
      }, this.reconnectInterval);
    };
  }

  send(data: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('[WS] Não conectado');
    }
  }

  openGate(): void {
    this.send({ event: 'OPEN_GATE' });
  }

  lockGate(): void {
    this.send({ event: 'LOCK_GATE' });
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

  disconnect(): void {
    this.token = null;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new AccessControlWS();
