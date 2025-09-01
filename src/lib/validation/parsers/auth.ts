import { safeValidate } from '../utils';
import { signUpSchema, signInSchema, type SignUpInput, type SignInInput } from '../schemas/auth';
import type { ActionError } from '@/types/actions';

/**
 * Authentication form parsing utilities
 */

export const parseSignUpFormData = (
  formData: FormData
): { success: true; data: SignUpInput } | { success: false; error: ActionError } => {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  return safeValidate(signUpSchema, rawData);
};

export const parseSignInFormData = (
  formData: FormData
): { success: true; data: SignInInput } | { success: false; error: ActionError } => {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  return safeValidate(signInSchema, rawData);
};