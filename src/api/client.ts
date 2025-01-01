import { ApiResponse, AuthResponse } from "@/type";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("is not defined in environment variables");
}

class ApiClient {
  private baseUrl: string;
  private publicEndpoints = ["/auth/login", "/auth/register"];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  private isPublicEndpoint(endpoint: string): boolean {
    return this.publicEndpoints.includes(endpoint);
  }

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    });

    // Add authorization header for protected endpoints
    if (!this.isPublicEndpoint(endpoint)) {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Handle 401 errors 
    if (response.status === 401 && !this.isPublicEndpoint(endpoint)) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
      throw new Error("Session expired. Please login again.");
    }

    return data as ApiResponse<T>;
  }

  public async register(
    data: RegisterData
  ): Promise<ApiResponse<AuthResponse>> {
    return this.fetchApi<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.fetchApi<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Example of a protected endpoint
  public async getProfile(): Promise<ApiResponse<string>> {
    return this.fetchApi("/health", {
      method: "GET",
    });
  }
}

// Create a singleton instance
export const apiClient = new ApiClient(API_URL);
