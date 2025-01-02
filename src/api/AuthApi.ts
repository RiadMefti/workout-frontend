import { ApiResponse, AuthResponse } from "@/type";
import { ApiClient } from "./clientApi";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
    this.publicEndpoints = ["/auth/login", "/auth/register"];
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
}

export const authClient = new AuthClient(import.meta.env.VITE_API_URL);
