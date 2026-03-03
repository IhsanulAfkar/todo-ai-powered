import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export type TResponse<T> = {
  data: T;
  message: string;
  status: number;
};

export type TValidationResponse = TResponse<Record<string, string[]>>;

export class HttpServer {
  private client: AxiosInstance;

  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'x-api-key': `${API_KEY}`,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });
  }

  async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<{ status: number; data: TResponse<T> }> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url,
        data,
        ...config,
      });

      return { status: response.status, data: response.data as TResponse<T> };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return {
          status: 400,
          data: error.response.data,
        };
      }

      throw error;
    }
  }

  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>('get', url, undefined, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>('post', url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>('put', url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>('delete', url, undefined, config);
  }
  public async raw(endpoint: string, options: RequestInit = {}) {
    return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + endpoint, {
      ...options,
      headers: {
        'x-api-key': API_KEY,
        ...(options.headers || {}),
      } as Record<string, string>,
    });
  }
}
export const httpServer = new HttpServer();
