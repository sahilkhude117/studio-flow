'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect } from 'react'

const ProfilePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/sign-in')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <p className="text-center mt-10">Loading...</p>
  }

  if (!session) {
    return null
  }

  const { user } = session

  const getInitials = (name: string | null | undefined) => {
    return name
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg text-center space-y-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={user?.image ?? ''} alt={user?.name ?? 'User'} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-indigo-700">{user?.name || 'User'}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <Card className="bg-indigo-50">
          <CardContent className="p-4 text-left">
            <p className="text-sm text-gray-500 mb-1">Bio</p>
            <p className="text-base text-gray-700">
              Passionate user. Loves technology and new adventures. Always eager to learn something new.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/profile/edit')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Profile
          </Button>

          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Sign Out
          </Button>

          <Button
            onClick={() => router.push('/')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
