'use server';

import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth/create-session'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { createUser, getUserByEmail } from '@/db/user.service'
import { parseSignUpFormData, parseSignInFormData } from '@/lib/validation'
import { createActionSuccess, createActionError, type ActionResult } from '@/types/actions'

export const signUp = async (formData: FormData): Promise<ActionResult> => {
  'use server';
  
  // Validate form data
  const validationResult = parseSignUpFormData(formData);
  if (!validationResult.success) {
    return validationResult.error;
  }
  
  const { email, password } = validationResult.data;

  try {
    const hashedPassword = await hashPassword(password);
    const user = await createUser(email, hashedPassword);
    
    const session = await createSession(user.id);
    const cookieStore = await cookies();
    
    cookieStore.set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    return createActionSuccess();
  } catch (error) {
    console.error('SignUp error:', error);
    return createActionError('Email already exists');
  }
}

export const signIn = async (formData: FormData): Promise<ActionResult> => {
  'use server';
  
  // Validate form data
  const validationResult = parseSignInFormData(formData);
  if (!validationResult.success) {
    return validationResult.error;
  }
  
  const { email, password } = validationResult.data;

  try {
    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return createActionError('Invalid email or password');
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return createActionError('Invalid email or password');
    }
  
    const session = await createSession(user.id);
    const cookieStore = await cookies();
    
    cookieStore.set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  
    return createActionSuccess();
  } catch (error) {
    console.error('SignIn error:', error);
    return createActionError('Authentication failed');
  }
}