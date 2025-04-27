// hooks/useGoogleOAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UseGoogleOAuthOptions {
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

export function useGoogleOAuth({ onSuccess, onError }: UseGoogleOAuthOptions = {}) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check for access token in localStorage or cookies on mount
  useEffect(() => {
    const token = localStorage.getItem('google_access_token') || Cookies.get('google_client_token');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
      onSuccess?.(token);
    }
  }, [onSuccess]);

  // Function to initiate OAuth flow
  const initiateOAuth = () => {
    // Google OAuth parameters
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/google/callback`;
    const scope = encodeURIComponent('https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
    // Store current path in cookie for continuation after auth
    Cookies.set('return_to', window.location.pathname, { secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    
    // Redirect to Google auth page
    setIsLoading(true);
    window.location.href = authUrl;
  };

  // Function to sign out
  const signOut = () => {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    Cookies.remove('google_client_token');
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  // Function to refresh the token
  const refreshToken = async () => {
    setIsLoading(true);
    try {
      const refreshToken = localStorage.getItem('google_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/google/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('google_access_token', data.access_token);
      setAccessToken(data.access_token);
      setIsAuthenticated(true);
      onSuccess?.(data.access_token);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh token');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    initiateOAuth,
    signOut,
    refreshToken,
  };
}