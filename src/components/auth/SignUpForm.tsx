import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { signUp } from '@/app/actions';

const SignUpForm = () => {
  return (
    <div className="space-y-6">
      <form action={signUp} className="space-y-4">
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
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
        >
          Create account
        </Button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a 
          href="/"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign in
        </a>
      </div>
    </div>
  );
};

export default SignUpForm;
