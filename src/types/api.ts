export interface ApiResponse<T> {
  data: T;
  meta: { statusCode: number; path: string; timestamp: string };
}
export interface ValidationIssue {
  field: string;
  messages?: Record<string, string>;
  nestedErrors: ValidationIssue[];
}
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  errors?: ValidationIssue[];
}
