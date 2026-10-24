import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/common/BrandLogo';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  password: ''
};

export default function RegisterPage() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch {
      // The authentication context displays the server error.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-anulok-cream px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg rounded-3xl border border-stone-200/80 bg-white p-6 shadow-luxury sm:p-10">
        <div className="mb-8 text-center">
          <BrandLogo className="mb-4 justify-center" />
          <h1 className="font-serif text-2xl font-bold text-anulok-espresso">
            Create An Account
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            Create your account to save your details and track your orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Full Name *
            </label>
            <div className="relative">
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-anulok-wood"
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label htmlFor="register-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Email Address <span className="font-normal normal-case">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-anulok-wood"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label htmlFor="register-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Indian Mobile Number *
            </label>
            <div className="relative">
              <input
                id="register-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream py-3 pl-10 pr-4 text-sm outline-none focus:border-anulok-wood"
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="register-age" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
                Age *
              </label>
              <input
                id="register-age"
                name="age"
                type="number"
                inputMode="numeric"
                min="1"
                max="120"
                required
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream px-4 py-3 text-sm outline-none focus:border-anulok-wood"
              />
            </div>
            <div>
              <label htmlFor="register-gender" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
                Gender *
              </label>
              <select
                id="register-gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-300 bg-anulok-cream px-4 py-3 text-sm outline-none focus:border-anulok-wood"
              >
                <option value="" disabled>Select an option</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="register-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-600">
              Password *
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={formData.password}
                onChange={handleChange}
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
            {loading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="h-4 w-4 text-anulok-amber" />
          </button>
        </form>

        <div className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-anulok-wood hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
