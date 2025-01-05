// src/api/WorkoutApi.ts
import { ApiResponse, WorkoutDTO } from "@/type";
import { ApiClient } from "./clientApi";

export class WorkoutClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  // Get all workouts
  public async getWorkouts(): Promise<ApiResponse<WorkoutDTO[]>> {
    return this.fetchApi<WorkoutDTO[]>("/workout", {
      method: "GET",
    });
  }

  // Get single workout by ID
  public async getWorkout(id: string): Promise<ApiResponse<WorkoutDTO>> {
    return this.fetchApi<WorkoutDTO>(`/workout/${id}`, {
      method: "GET",
    });
  }

  // Create new workout
  public async createWorkout(
    data: Omit<WorkoutDTO, "id">
  ): Promise<ApiResponse<WorkoutDTO>> {
    return this.fetchApi<WorkoutDTO>("/workout", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Update existing workout
  public async editWorkout(
    id: string,
    data: Partial<WorkoutDTO>
  ): Promise<ApiResponse<WorkoutDTO>> {
    return this.fetchApi<WorkoutDTO>(`/workout/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Delete workout
  public async deleteWorkout(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/workout/${id}`, {
      method: "DELETE",
    });
  }

  // Helper method to process workout data before sending
  private validateWorkoutData(data: Partial<WorkoutDTO>): void {
    if ("exercises" in data) {
      data.exercises?.forEach((exercise) => {
        if (exercise.type === "strength") {
          // Remove cardio-specific fields for strength exercises
          delete exercise.duration;
          delete exercise.distance;
        } else if (exercise.type === "cardio") {
          // Remove strength-specific fields for cardio exercises
          delete exercise.sets;
          delete exercise.reps;
        }
      });
    }
  }
}

// Export a singleton instance
export const workoutClient = new WorkoutClient(import.meta.env.VITE_API_URL);
