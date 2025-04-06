// app/(auth)/signup/page.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Apple, ArrowRight, Eye, EyeOff } from 'lucide-react'
import axios from "axios"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BACKEND_URL } from '@/lib/config'

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [hiddenPassword, setHiddenPassword] = useState(true);  
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const toggleVisibility = () => {
    setHiddenPassword(!hiddenPassword);
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if(!emailRegex.test(email)){
        setError('Invalid email address');
        setLoading(false);
        return;
    }

    if(!passwordRegex.test(password)){
        setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        setLoading(false);
        return;
    }

    try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup/`, {
          email,
          password,
          username: name
        })
        router.push('/sign-in')
    } catch (err) {
        setError('Something went wrong. Please try again.');
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-4">
              Join StudioFlow
            </h1>
            <p className="text-[#6B7280]">
              Automate your workflows
            </p>
          </div>

          {/* Form Card */}
          <Card className="p-6 shadow-sm">
            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id='name'
                    type="text"
                    autoComplete='text'
                    className="mt-1"
                    placeholder="Tony Stark"
                    value={name}
                    onChange={(e) => {
                      setError('')
                      setName(e.target.value)
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id='email'
                    name='email'
                    type="email"
                    autoComplete='email'
                    required
                    className="mt-1"
                    placeholder="@tonystark.in"
                    value={email}
                    onChange={(e)=> {
                      setError('')
                      setEmail(e.target.value)
                    }}
                  />
                </div>

                <div className='relative'>
                  <label className="text-sm font-medium">
                    Password
                  </label>
                  <div>
                  <Input
                    id='password'
                    name='password'
                    type={ hiddenPassword ? 'password' : 'text'}
                    autoComplete='password'
                    required
                    className="mt-1"
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setError('')
                      setPassword(e.target.value)
                    }}
                  />
                </div>
                <div
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-4 top-6 flex items-center cursor-pointer"
                >
                    {hiddenPassword ? <EyeOff size={20}/> : <Eye size={20}/> }
                </div>
                </div>
              </div>
              {/* Error Message */}
              {error && (
                  <div className="text-red-500 text-sm text-center">
                      {error}
                  </div>
              )}

              <Button
                type='submit'
                disabled={loading}
                className="w-full cursor-pointer bg-black py-5 font-bold"
                size="lg"
                onClick={handleSubmit}
              >
                {loading ? (
                    <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Acount...
                  </span>
                ) : (
                  <div className='flex justify-center'>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </Card>

          <p className="mt-8 text-center text-[#6B7280]">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className=" font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-[#6B7280] max-w-xs mx-auto">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className=" hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className=" hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}