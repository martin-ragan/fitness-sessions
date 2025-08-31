# Component Architecture

This directory contains reusable UI components organized by purpose and functionality.

## Structure

```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx        # Reusable button with variants
│   ├── FormInput.tsx     # Form input with validation
│   ├── Divider.tsx       # Content separator
│   └── index.ts          # UI component exports
├── auth/                  # Authentication components
│   ├── SignUpForm.tsx    # Sign up form with validation
│   ├── SignInForm.tsx    # Sign in form with validation
│   ├── GoogleSignInButton.tsx # Google OAuth button
│   └── index.ts          # Auth component exports
├── layout/                # Layout components
│   └── AuthLayout.tsx    # Authentication page layout
└── ProtectedRoute.tsx    # Route protection component
```

## UI Components

### Button
A flexible button component with multiple variants and states.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- All standard button HTML attributes

### FormInput
A form input component with built-in validation and error handling.

```tsx
import { FormInput } from '@/components/ui';

<FormInput
  label="Email"
  type="email"
  error="Invalid email"
  placeholder="Enter your email"
/>
```

**Props:**
- `label`: string
- `error`: string (optional)
- `helperText`: string (optional)
- All standard input HTML attributes

### Divider
A content separator with optional text.

```tsx
import { Divider } from '@/components/ui';

<Divider text="or continue with" />
```

## Auth Components

### SignUpForm
Complete sign-up form with email/password and Google OAuth.

```tsx
import { SignUpForm } from '@/components/auth';

<SignUpForm 
  onSuccess={() => console.log('Success!')}
  redirectTo="/dashboard"
/>
```

### SignInForm
Complete sign-in form with email/password and Google OAuth.

```tsx
import { SignInForm } from '@/components/auth';

<SignInForm 
  onSuccess={() => console.log('Success!')}
  redirectTo="/dashboard"
/>
```

### GoogleSignInButton
Standalone Google OAuth button.

```tsx
import { GoogleSignInButton } from '@/components/auth';

<GoogleSignInButton 
  onClick={handleGoogleSignIn}
  isLoading={false}
/>
```

## Layout Components

### AuthLayout
Reusable layout for authentication pages.

```tsx
import AuthLayout from '@/components/layout/AuthLayout';

<AuthLayout
  title="Welcome back"
  subtitle="Sign in to continue"
>
  <SignInForm />
</AuthLayout>
```

## Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components are designed to be reused across the app
3. **Composition**: Complex components are built from simpler ones
4. **Accessibility**: All components follow accessibility best practices
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Modern UI**: Clean, modern design with smooth transitions

## Usage Examples

### Creating a Custom Form
```tsx
import { FormInput, Button } from '@/components/ui';

function CustomForm() {
  return (
    <form>
      <FormInput label="Name" placeholder="Enter your name" />
      <FormInput label="Email" type="email" error="Invalid email" />
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </form>
  );
}
```

### Building a Custom Auth Page
```tsx
import AuthLayout from '@/components/layout/AuthLayout';
import { SignUpForm } from '@/components/auth';

export default function CustomSignUpPage() {
  return (
    <AuthLayout
      title="Join our community"
      subtitle="Start your journey today"
    >
      <SignUpForm redirectTo="/onboarding" />
    </AuthLayout>
  );
}
```
