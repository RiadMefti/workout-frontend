export interface AuthState {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  tokenType: string;
  authState: AuthState;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode: number;
}

export type UserDTO = {
  _id: string;
  name: string;
  email: string;
  profile_picture: string;
  next_workout: string | null;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// DTO type
export type WorkoutDTO = {
  id: string;
  name: string;
  description?: string;
  exercises: Array<{
    name: string;
    type: "strength" | "cardio";
    sets?: number;
    reps?: number;
    duration?: number;
    distance?: number;
  }>;
};

export type WorkoutRecordDTO = {
  id: string;
  workoutId: string;
  date: Date;
  exercises: Array<{
    name: string;
    type: "strength" | "cardio";
    bestReps?: number;
    bestWeight?: number;
    duration?: number;
    distance?: number;
  }>;
};

export type Exercise = {
  name: string;
  type: "strength" | "cardio";
  sets?: number;
  reps?: number;
  duration?: number;
  distance?: number;
};
