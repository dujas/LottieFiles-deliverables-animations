/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosInstance,
  AxiosResponse,
  CustomParamsSerializer,
  InternalAxiosRequestConfig,
  ParamsSerializerOptions,
} from "axios";

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

export type HttpClientError = {
  message: string;
  status?: number;
  data?: any;
};

type ClientType = "anonymous" | "bearer";
export class HttpClient<CT extends ClientType = "anonymous"> {
  private clientType: CT;
  private axiosInstance: AxiosInstance;
  private abortController: AbortController | null = null;

  constructor(clientType: CT, config?: HttpClientConfig) {
    this.axiosInstance = axios.create(config);
    this.clientType = clientType;

    this.axiosInstance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleError.bind(this),
    );
    this.axiosInstance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleError.bind(this),
    );
  }

  private async handleRequest(
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    try {
      if (this.clientType === "bearer") {
        const token = ""; // TODO
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Failed to fetch token:", error);
    }

    this.abortController = new AbortController();
    config.signal = this.abortController.signal;
    return config;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    if (response.status === 403) {
      window.location.href = "/";
    }
    return response;
  }

  private handleError(error: any): Promise<HttpClientError> {
    if (axios.isAxiosError(error)) {
      const httpClientError: HttpClientError = {
        message: error.message ?? "An error occurred during the HTTP request.",
        status: error.response?.status,
        data: error.response?.data,
      };
      return Promise.reject(httpClientError);
    } else {
      const unexpectedError: HttpClientError = {
        message: `An unexpected error occurred: ${error}`,
      };
      return Promise.reject(unexpectedError);
    }
  }

  async get<T>(
    url: string,
    params?: Record<string, any>,
    paramsSerializer?: ParamsSerializerOptions | CustomParamsSerializer,
  ): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, {
      params,
      paramsSerializer,
    });
    return response.data;
  }

  async post<T, U>(
    url: string,
    data?: U,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, { params });
    return response.data;
  }

  async put<T, U>(
    url: string,
    data?: U,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, { params });
    return response.data;
  }

  async patch<T, U>(
    url: string,
    data?: U,
    params?: Record<string, any>,
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, { params });
    return response.data;
  }

  async delete<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, { params });
    return response.data;
  }

  cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}
