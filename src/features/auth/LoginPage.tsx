import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        login(
          {
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          },
          tokenResponse.access_token
        );
        navigate('/');
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    },
    scope: 'https://www.googleapis.com/auth/drive.appdata',
  });

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-bg-card rounded-2xl shadow-sm border border-border p-10 text-center">
        <div className="flex justify-center mb-6 text-accent-gold">
          <Sun size={48} strokeWidth={1.5} />
        </div>
        
        <h1 className="font-display text-4xl font-semibold text-text-primary mb-3">
          Omed-Bible
        </h1>
        <p className="font-body text-text-secondary italic mb-10 text-lg">
          La Parole, toujours avec vous.
        </p>
        
        <button
          onClick={() => handleLogin()}
          className="w-full flex items-center justify-center gap-3 bg-bg-secondary hover:bg-border text-text-primary font-sans font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
};
