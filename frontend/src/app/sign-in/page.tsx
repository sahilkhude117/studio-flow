// app/(auth)/login/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/components/ForgotPassword';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/config';
import { useAuth } from '@/contexts/AuthContext';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const toggleVisibility = () => {
    setHidePass(!hidePass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin/`, {
        email,
        password,
      });
      const token = res.data.access;
      const userData = res.data.user || {
        id: res.data.id || '',
        email: email,
        username: res.data.username || email.split('@')[0],
      };

      login(userData, token);
      router.push('/flows');
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/profile' });
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-md mx-auto px-4 mt-8 ">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome Back to StudioFlow</h1>
            <p>Continue your automation with us</p>
          </div>

          {/* Card starts here */}
          <Card className="p-4 shadow-sm space-y-0">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Login to your account</h2>
              <p className="text-sm text-muted-foreground">Access your StudioFlow dashboard</p>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="w-5 h-5" />
              Sign in with Google
            </Button>

            {/* Divider */}
            <div className="text-center my-2 text-sm text-muted-foreground">or</div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  className="mt-1"
                  autoComplete="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setError('');
                    setEmail(e.target.value);
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium">Password</label>
                  <ForgotPassword />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={hidePass ? 'password' : 'text'}
                  autoComplete="current-password"
                  required
                  value={password}
                  className="pr-10"
                  placeholder="••••••••••••••••"
                  onChange={(e) => {
                    setError('');
                    setPassword(e.target.value);
                  }}
                />
                <div
                  onClick={toggleVisibility}
                  className="absolute inset-y-10 right-0 top-1/2 transform -translate-y-1/2 pr-3 cursor-pointer"
                >
                  {hidePass ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black py-5 font-bold"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  <div className="cursor-pointer flex justify-center">
                    Sign In
                    <ArrowRight className="ml-2 h-0 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Card>

          {/* Footer */}
          <p className="mt-2 text-center">
            Don't have an account?{' '}
            <Link href="/sign-up" className="font-bold hover:underline">
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
