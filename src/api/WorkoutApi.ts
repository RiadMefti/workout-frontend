// src/api/WorkoutApi.ts
import { ApiResponse, WorkoutSplitDTO } from "@/type"; // Assuming SplitDTO is defined similarly to WorkoutDTO
import { ApiClient } from "./clientApi";

export class SplitClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  // Get all splits
  public async getSplits(): Promise<ApiResponse<WorkoutSplitDTO[]>> {
    return this.fetchApi<WorkoutSplitDTO[]>("/workout", {
      method: "GET",
    });
  }

  // Create new split
  public async createSplit(
    data: Omit<WorkoutSplitDTO, "id">
  ): Promise<ApiResponse<WorkoutSplitDTO>> {
    return this.fetchApi<WorkoutSplitDTO>("/workout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Update existing split
  public async editSplit(
    id: string,
    data: Partial<WorkoutSplitDTO>
  ): Promise<ApiResponse<WorkoutSplitDTO>> {
    return this.fetchApi<WorkoutSplitDTO>(`/workout/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Delete split
  public async deleteSplit(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/workout/${id}`, {
      method: "DELETE",
    });
  }

  public async getUserNextWorkoutIndex(): Promise<ApiResponse<number>> {
    return this.fetchApi<number>("/workout/next-workout-index", {
      method: "GET",
    });
  }

  // Increment user's next workout index
  public async incrementUserNextWorkoutIndex(
    index: number
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(
      `/workout/next-workout-index/${index}`,
      {
        method: "POST",
      }
    );
  }
  // Get active split
  public async getActiveSplit(): Promise<ApiResponse<string | null>> {
    return this.fetchApi<string | null>("/workout/active-split", {
      method: "GET",
    });
  }

  // Set active split
  public async setActiveSplit(
    splitId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(
      `/workout/active-split/${splitId}`,
      {
        method: "POST",
      }
    );
  }
}

// Export a singleton instance
export const splitClient = new SplitClient(import.meta.env.VITE_API_URL);
