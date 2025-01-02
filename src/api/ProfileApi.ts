import { ApiResponse } from "@/type";
import { ApiClient } from "./clientApi";

export class ProfileClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  public async getProfile(): Promise<ApiResponse<string>> {
    return this.fetchApi("/health", {
      method: "GET",
    });
  }
}

export const profileClient = new ProfileClient(import.meta.env.VITE_API_URL);
