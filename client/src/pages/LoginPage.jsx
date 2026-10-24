import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/common/BrandLogo';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(identifier, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch {
      // The authentication context displays the server error.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-anulok-cream px-4 py-12 sm:py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-6 shadow-luxury sm:p-10">
        <div className="mb-8 text-center">
          <BrandLogo className="mb-4 justify-center" />
          <h1 className="font-serif text-2xl font-bold text-anulok-espresso">Welcome Back</h1>
          <p className="mt-1 text-xs text-stone-500">Sign in with your verified email or phone.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-identifier" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Email or Phone Number
            </label>
            <div className="relative">
              <input
                id="login-identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@example.com or mobile number"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-anulok-wood"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-anulok-wood"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-anulok-espresso px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-colors hover:bg-anulok-wood disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="h-4 w-4 text-anulok-amber" />
          </button>
        </form>

        <div className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-500">
          New to Anulok?{' '}
          <Link to="/register" className="font-bold text-anulok-wood hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
