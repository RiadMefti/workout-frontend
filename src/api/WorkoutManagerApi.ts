import { ApiResponse, WorkoutRecordDTO } from "@/type";
import { ApiClient } from "./clientApi";

export class WorkoutManagerClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  // Get all workout records for the user
  public async getAllUserWorkouts(): Promise<ApiResponse<WorkoutRecordDTO[]>> {
    return this.fetchApi<WorkoutRecordDTO[]>("/workout-manager", {
      method: "GET",
    });
  }

  // Get specific workout record by ID
  public async getUserWorkoutById(
    id: string
  ): Promise<ApiResponse<WorkoutRecordDTO>> {
    return this.fetchApi<WorkoutRecordDTO>(`/workout-manager/${id}`, {
      method: "GET",
    });
  }
  // Post a new active workout record
  public async postUserActiveWorkout(
    workoutId: string,
    exercises: Array<{
      name: string;
      type: "strength" | "cardio";
      bestReps?: number;
      bestWeight?: number;
      duration?: number;
      distance?: number;
    }>
  ): Promise<ApiResponse<WorkoutRecordDTO>> {
    return this.fetchApi<WorkoutRecordDTO>("/workout-manager/active-workout", {
      method: "POST",
      body: JSON.stringify({
        workoutId,
        exercises,
      }),
    });
  }
}

// Export singleton instance
export const workoutManagerClient = new WorkoutManagerClient(
  import.meta.env.VITE_API_URL
);
