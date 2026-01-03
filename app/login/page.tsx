'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { requestMagicLinkSchema } from '@/lib/schemas/auth';
import type { RequestMagicLinkInput } from '@/lib/schemas/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    // Validate email
    const validationResult = requestMagicLinkSchema.safeParse({ email });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0]?.message || 'Invalid email');
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestMagicLink(email);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send magic link. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">AI Chat Web Portal</h1>
          <p className="mt-2 text-lg text-gray-600">Sign in with magic link</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isSuccess}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {isSuccess && (
            <div className="rounded-md bg-green-50 p-4 space-y-3">
              <p className="text-sm text-green-800">
                Check your email for the magic link. Click the link to sign in.
              </p>
              {process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-xs text-green-700 mb-2 font-semibold">
                    🧪 Development Mode - Test Magic Link:
                  </p>
                  <a
                    href="/auth/callback?token=test-magic-link-token"
                    className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    /auth/callback?token=test-magic-link-token
                  </a>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : isSuccess ? 'Link Sent' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </main>
  );
}

