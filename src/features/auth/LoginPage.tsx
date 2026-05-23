import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/useAuthStore';
import { BookOpenText } from 'lucide-react';
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
    <div className="min-h-screen bg-bg-primary px-6 py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-border bg-bg-card shadow-[0_20px_60px_var(--color-shadow)] md:grid-cols-2">
        <section className="relative flex flex-col justify-between border-b border-border p-8 md:border-b-0 md:border-r md:p-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.14em] text-text-muted">
              <BookOpenText size={14} strokeWidth={1.5} />
              Omed Scripture
            </div>
            <h1 className="font-display text-4xl leading-tight text-text-primary md:text-5xl">
              Un espace calme pour lire, étudier et méditer les Écritures.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
              Omed rassemble lecture, comparaison des traductions, notes, surlignages et synchronisation cloud dans une interface sobre pensée pour la concentration.
            </p>
          </div>
          <p className="mt-10 text-sm uppercase tracking-[0.18em] text-text-muted">Lire. Méditer. Retenir.</p>
        </section>

        <section className="flex items-center p-8 md:p-12">
          <div className="w-full rounded-xl border border-border bg-bg-primary/70 p-7">
            <h2 className="font-display text-2xl text-text-primary">Connexion</h2>
            <p className="mt-2 text-sm text-text-secondary">Accédez à vos passages, notes et préférences synchronisés.</p>

            <button
              onClick={() => handleLogin()}
              className="mt-8 w-full flex items-center justify-center gap-3 rounded-md border border-border bg-bg-secondary px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-secondary/70"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5" />
              Continuer avec Google
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
