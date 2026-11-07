
import { useState } from 'react';
import { Sparkles, Eye, EyeOff, Mail, Lock, UserRound } from 'lucide-react';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('Your account system will be connected in the next integration step.');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a16] px-4 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#111326]/90 shadow-2xl backdrop-blur-2xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-violet-950 via-[#171936] to-blue-950 p-12 md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-400/20 p-2">
                <Sparkles className="h-6 w-6 text-violet-200" />
              </div>
              <span className="text-2xl font-semibold tracking-wide">ORLINA</span>
            </div>

            <div className="mt-28">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300">
                A space for you
              </p>
              <h1 className="mt-5 text-5xl font-semibold leading-tight">
                Your thoughts,
                <span className="block bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                  understood.
                </span>
              </h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                Think freely. Make sense of what matters. Turn meaningful conversations into action.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            A thoughtful space for every part of your journey.
          </p>
        </section>

        <section className="p-7 sm:p-10 md:p-12">
          <div className="mb-9 md:hidden">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles className="h-6 w-6 text-violet-300" />
              ORLINA
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-violet-300">
              Welcome to your space
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {mode === 'login'
                ? 'Sign in to continue your conversations.'
                : 'Begin your journey with ORLINA.'}
            </p>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setNotice(''); }}
              className={`rounded-lg py-2.5 text-sm font-medium transition ${mode === 'login' ? 'bg-violet-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setNotice(''); }}
              className={`rounded-lg py-2.5 text-sm font-medium transition ${mode === 'register' ? 'bg-violet-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">Full name</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0e1c] px-4 focus-within:border-violet-400">
                  <UserRound className="h-4 w-4 text-slate-500" />
                  <input required type="text" placeholder="Your full name" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">Email address</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0e1c] px-4 focus-within:border-violet-400">
                <Mail className="h-4 w-4 text-slate-500" />
                <input required type="email" placeholder="you@example.com" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0e1c] px-4 focus-within:border-violet-400">
                <Lock className="h-4 w-4 text-slate-500" />
                <input required minLength={8} type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="text-slate-500 hover:text-white">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="mb-2 block text-sm text-slate-300">Confirm password</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0e1c] px-4 focus-within:border-violet-400">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <input required minLength={8} type="password" placeholder="Enter your password again" className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600" />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={() => setNotice('Password recovery will be enabled when authentication is connected.')} className="text-xs text-violet-300 hover:text-violet-200">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110">
              {mode === 'login' ? 'Sign in to ORLINA' : 'Create my account'}
            </button>

            {notice && (
              <p role="status" className="rounded-lg border border-violet-400/20 bg-violet-400/10 p-3 text-xs leading-5 text-violet-200">
                {notice}
              </p>
            )}
          </form>

          <p className="mt-8 text-center text-xs leading-6 text-slate-500">
            By continuing, you agree to use ORLINA responsibly.
          </p>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
