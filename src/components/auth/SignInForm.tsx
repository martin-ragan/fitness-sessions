'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';  
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { signIn } from '@/actions';
import { LogIn, Mail, Lock, Dumbbell, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn(formData);
      
      if (result.success) {
        router.push('/workouts');
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Fitness Sessions
          </h1>
          <p className="text-slate-600">
            Track your workouts and achieve your fitness goals
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border-slate-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600">
              Sign in to continue your fitness journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="pl-10 w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="pl-10 w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">New to Fitness Sessions?</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200"
              >
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
