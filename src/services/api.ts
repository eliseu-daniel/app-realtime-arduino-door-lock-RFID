import { env } from '../config/env';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    method: string,
    path: string,
    body?: Record<string, any>,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    try {
      let url = `${env.apiUrl}${path}`;

      if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
        const qs = searchParams.toString();
        if (qs) url += `?${qs}`;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const status = response.status;
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (status >= 400) {
        return { data, error: data?.error || `Erro ${status}`, status };
      }

      return { data, status };
    } catch (error: any) {
      return { error: error.message || 'Erro de conexão', status: 0 };
    }
  }

  // Auth
  async login(email: string, senha: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('POST', '/auth/login', { email, senha });
  }

  async register(nome: string, email: string, senha: string, role: string = 'usuario'): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('POST', '/auth/register', { nome, email, senha, role });
  }

  async getMe(): Promise<ApiResponse<any>> {
    return this.request('GET', '/auth/me');
  }

  // Devices
  async getDevices(): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/devices');
  }

  async createDevice(nome: string, serial_number: string): Promise<ApiResponse<any>> {
    return this.request('POST', '/devices', { nome, serial_number });
  }

  async updateDevice(id: number, data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.request('PUT', `/devices/${id}`, data);
  }

  async deleteDevice(id: number): Promise<ApiResponse<void>> {
    return this.request('DELETE', `/devices/${id}`);
  }

  // Logs
  async getLogs(limit: number = 50, offset: number = 0): Promise<ApiResponse<any[]>> {
    return this.request('GET', '/logs', undefined, { limit, offset });
  }

  async getLog(id: number): Promise<ApiResponse<any>> {
    return this.request('GET', `/logs/${id}`);
  }

  async getDeviceLogs(deviceId: number): Promise<ApiResponse<any[]>> {
    return this.request('GET', `/logs/device/${deviceId}`);
  }

  async getUserLogs(userId: number): Promise<ApiResponse<any[]>> {
    return this.request('GET', `/logs/user/${userId}`);
  }
}

const api = new ApiService();
export default api;
