import { ApiResponse } from "@/type";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

//This is the base class for all API clients. It contains the common logic for making API requests.
//The constructor takes the base URL of the API as an argument. The publicEndpoints property is an array of endpoints that don't require authentication.
//The getAuthToken method retrieves the authentication token from local storage.
//The isPublicEndpoint method checks if an endpoint is public or not.
//The fetchApi method makes a request to the API with the given endpoint and options.
//It adds the necessary headers for authentication and handles the response status codes.
//If the response status is 401 (unauthorized), it clears the authentication token from local storage and redirects the user to the login page.
export class ApiClient {
  protected baseUrl: string;
  protected publicEndpoints: string[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected getAuthToken(): string | null {
    return localStorage.getItem("token");
  }

  protected isPublicEndpoint(endpoint: string): boolean {
    return this.publicEndpoints.includes(endpoint);
  }

  protected async fetchApi<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    });

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

    if (response.status === 401 && !this.isPublicEndpoint(endpoint)) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
      throw new Error("Session expired. Please login again.");
    }

    return data as ApiResponse<T>;
  }
}
