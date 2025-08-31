import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth/create-session'
import { hashPassword, comparePassword } from '@/lib/auth/password'
import { createUser, getUserByEmail } from '@/db/user.service'

export const signUp = async (formData: FormData) => {
  'use server';
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      error: 'Email and password are required',
    }
  }

  const hashedPassword = await hashPassword(password)

  try {
    const user = await createUser(email, hashedPassword)
    console.log('returned user', user);
    const session = await createSession();
    console.log(session.token)
    const cookieStore = await cookies();
    cookieStore.set('session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return {
      success: true
    }
  } catch (error) {
    return {
      error: 'Email already exists',
    }
  }
}

export const signIn = async (formData: FormData) => {
  'use server';
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      error: 'No such an email!',
    }
  }

  if (!user.password) {
    return {
      error: 'Invalid email or password',
    }
  }
  

  try {
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return {
        error: 'Invalid email or password',
      }
    }
  
    const session = await createSession()
  
    const cookieStore = await cookies();
  cookieStore.set('session', session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  
    return {
      success: true
    }
  } catch(e: unknown) {
    return {
      e
    }
  }
}
