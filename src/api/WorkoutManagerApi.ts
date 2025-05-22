import { ApiResponse, WorkoutRecordDTO, UserDTO } from "@/type";
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
    workoutRecord: WorkoutRecordDTO
  ): Promise<ApiResponse<WorkoutRecordDTO>> {
    return this.fetchApi<WorkoutRecordDTO>("/workout-manager/active-workout", {
      method: "POST",
      body: JSON.stringify({
        workoutRecord,
      }),
    });
  }

  // Get list of connections (should return UserDTO[])
  public async getConnections(): Promise<ApiResponse<UserDTO[]>> {
    return this.fetchApi<UserDTO[]>("/workout-manager/connections", {
      method: "GET",
    });
  }

  // Add a user to connections by email
  public async addConnection(
    email: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>("/workout-manager/connections", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Get all workouts for a connection by email
  public async getConnectionWorkouts(
    email: string
  ): Promise<ApiResponse<WorkoutRecordDTO[]>> {
    return this.fetchApi<WorkoutRecordDTO[]>(
      `/workout-manager/connections/${encodeURIComponent(email)}/workouts`,
      {
        method: "GET",
      }
    );
  }
}

// Export singleton instance
export const workoutManagerClient = new WorkoutManagerClient(
  import.meta.env.VITE_API_URL
);
