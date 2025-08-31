import React from 'react';
import { Button } from '../ui/button';  
import { Input } from '../ui/input';
import { signIn } from '@/app/actions';

const SignInForm = () => {
  return (
    <div className="space-y-6">
      <form action={signIn} className="space-y-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
        
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
        >
          Sign in
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <a 
          href="/signup" 
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign up
        </a>
      </div>
    </div>
  );
};

export default SignInForm;
