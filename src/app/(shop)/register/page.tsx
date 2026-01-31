'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Loader2, Check } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/account';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength indicators
  const passwordMinLength = password.length >= 8;
  const passwordHasLetter = /[a-zA-Z]/.test(password);
  const passwordHasNumber = /\d/.test(password);
  const passwordStrength = [passwordMinLength, passwordHasLetter, passwordHasNumber].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (passwordStrength < 3) {
      setError('Please create a stronger password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created!', {
        description: 'Welcome to L&apos;Artisan Baking Atelier',
      });

      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            autoComplete="name"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            className="h-12"
          />

          {/* Password strength indicators */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordMinLength ? 'bg-caramel-500 text-white' : 'bg-bread-200'}`}>
                {passwordMinLength && <Check className="w-3 h-3" />}
              </div>
              <span className={passwordMinLength ? 'text-cocoa-800' : 'text-cocoa-500'}>
                At least 8 characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordHasLetter ? 'bg-caramel-500 text-white' : 'bg-bread-200'}`}>
                {passwordHasLetter && <Check className="w-3 h-3" />}
              </div>
              <span className={passwordHasLetter ? 'text-cocoa-800' : 'text-cocoa-500'}>
                Contains a letter
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordHasNumber ? 'bg-caramel-500 text-white' : 'bg-bread-200'}`}>
                {passwordHasNumber && <Check className="w-3 h-3" />}
              </div>
              <span className={passwordHasNumber ? 'text-cocoa-800' : 'text-cocoa-500'}>
                Contains a number
              </span>
            </div>
          </div>

          {/* Strength bar */}
          <div className="flex gap-1 h-1 mt-3">
            <div className={`flex-1 rounded-full transition-colors ${passwordStrength >= 1 ? 'bg-caramel-500' : 'bg-bread-200'}`} />
            <div className={`flex-1 rounded-full transition-colors ${passwordStrength >= 2 ? 'bg-caramel-500' : 'bg-bread-200'}`} />
            <div className={`flex-1 rounded-full transition-colors ${passwordStrength >= 3 ? 'bg-caramel-500' : 'bg-bread-200'}`} />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isLoading || passwordStrength < 3}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-cocoa-600 mt-6">
        Already have an account?{' '}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-medium text-espresso-600 hover:text-espresso-800 underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-semibold text-cocoa-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-cocoa-600">
            Join our community of artisan bakers
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-bread-200 p-8 shadow-soft">
          <Suspense fallback={
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-caramel-500" />
            </div>
          }>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
