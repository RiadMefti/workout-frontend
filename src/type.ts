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
  
  export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;