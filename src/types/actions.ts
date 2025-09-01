/**
 * Standardized action result types for consistent API responses across the application
 */

export interface ActionSuccess<T = void> {
  success: true;
  data?: T;
}

export interface ActionError {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;

// Helper functions for creating consistent responses
export const createActionSuccess = <T>(data?: T): ActionSuccess<T> => ({
  success: true,
  data,
});

export const createActionError = (
  error: string, 
  fieldErrors?: Record<string, string[]>
): ActionError => ({
  success: false,
  error,
  fieldErrors,
});