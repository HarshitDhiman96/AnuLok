import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import BrandLogo from '../components/common/BrandLogo';

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const { addToast } = useToast();

  // Tab mode: 'login' | 'register'
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Registration multi-step state
  const [registerStep, setRegisterStep] = useState('details'); // 'details' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState('');

  // If already logged in, redirect to home or admin
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // Sync tab with URL parameter if present
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register' || mode === 'login') {
      setActiveTab(mode);
      if (mode === 'login') {
        setRegisterStep('details');
      }
    }
  }, [searchParams]);

  // Cooldown countdown timer for resend OTP
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  // Register form state (age, gender, name, email, phone, address, password)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'female',
    address: '',
    password: ''
  });

  const handleTabSwitch = (mode) => {
    setActiveTab(mode);
    setSearchParams({ mode });
    if (mode === 'login') {
      setRegisterStep('details');
    }
  };

  // Sign In Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      addToast('Please enter your email or phone number and password.', 'error');
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(loginData.identifier, loginData.password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // Toast displayed by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Validate Registration Details & Request Email OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const { name, email, phone, age, gender, address, password } = registerData;

    if (!name.trim()) {
      addToast('Please enter your full name.', 'error');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!phone.trim()) {
      addToast('Please enter your 10-digit mobile number.', 'error');
      return;
    }
    if (!age || Number(age) < 1 || Number(age) > 120) {
      addToast('Please enter a valid age between 1 and 120.', 'error');
      return;
    }
    if (!address.trim()) {
      addToast('Please enter your delivery address.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.sendRegistrationOtp(email.trim(), name.trim(), phone.trim());
      addToast(res.message || 'Verification code sent to your email.');
      if (res.devCode) {
        setDevOtpHint(res.devCode);
      }
      setRegisterStep('otp');
      setResendCooldown(60);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    try {
      const res = await api.sendRegistrationOtp(
        registerData.email.trim(),
        registerData.name.trim(),
        registerData.phone.trim()
      );
      addToast(res.message || 'New verification code sent.');
      if (res.devCode) {
        setDevOtpHint(res.devCode);
      }
      setResendCooldown(60);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Finalize Registration
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      addToast('Please enter the 6-digit verification code sent to your email.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: registerData.name.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim(),
        age: Number(registerData.age),
        gender: registerData.gender,
        address: registerData.address.trim(),
        password: registerData.password,
        otp: otpCode.trim()
      });
      navigate('/');
    } catch {
      // Toast displayed by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-anulok-cream py-10 sm:py-16 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-stone-200/90 shadow-luxury overflow-hidden animate-slide-up">
        {/* Brand Header */}
        <div className="p-8 sm:p-10 pb-6 text-center border-b border-stone-100 bg-gradient-to-b from-anulok-linen/40 to-white">
          <div className="flex justify-center mb-3">
            <BrandLogo />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood mt-2">
            The Anulok Private Atelier
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Experience handcrafted solid timber, honed marble, and Italian bouclé for your living sanctuary.
          </p>

          {/* Tab Selector Switcher */}
          <div className="mt-6 p-1 bg-stone-100 rounded-2xl flex max-w-xs mx-auto border border-stone-200/80">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-anulok-espresso text-white shadow-sm'
                  : 'text-stone-500 hover:text-anulok-espresso'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-anulok-espresso text-white shadow-sm'
                  : 'text-stone-500 hover:text-anulok-espresso'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: SIGN IN                                          */}
        {/* ======================================================== */}
        {activeTab === 'login' && (
          <div className="p-6 sm:p-10 space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                  Email or 10-Digit Mobile *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                    placeholder="you@domain.com or 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 mt-6"
              >
                {loading ? 'Signing In...' : 'Sign In to Anulok'} <ArrowRight className="w-4 h-4 text-anulok-amber" />
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              New to Anulok?{' '}
              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className="font-bold text-anulok-wood hover:underline"
              >
                Create an Account with Us
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CREATE ACCOUNT WITH FREE EMAIL OTP VERIFICATION   */}
        {/* ======================================================== */}
        {activeTab === 'register' && (
          <div className="p-6 sm:p-10">
            {registerStep === 'details' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        placeholder="e.g. Vikramaditya Rao"
                        className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="vikram@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      10-Digit Mobile *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Age *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={1}
                        max={120}
                        value={registerData.age}
                        onChange={(e) => setRegisterData({ ...registerData, age: e.target.value })}
                        placeholder="28"
                        className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Gender *
                    </label>
                    <select
                      value={registerData.gender}
                      onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                      className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-anulok-wood transition-colors capitalize"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                      <option value="non-binary">Non-Binary</option>
                      <option value="prefer-not-to-say">Prefer Not to Say</option>
                    </select>
                  </div>

                  {/* Complete Address */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Delivery Address (Street, City, State, Pincode) *
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        required
                        value={registerData.address}
                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                        placeholder="e.g. Villa 14, Palm Grove Meadows, Indiranagar, Bengaluru, Karnataka 560038"
                        className="w-full pl-10 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-1.5">
                      Account Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood transition-colors"
                      />
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 mt-6"
                >
                  {loading ? 'Verifying Details...' : 'Continue to Email Verification'} <ArrowRight className="w-4 h-4 text-anulok-amber" />
                </button>

                <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="font-bold text-anulok-wood hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Email OTP Verification Screen */
              <form onSubmit={handleVerifyOtpAndRegister} className="space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-anulok-sand flex items-center justify-center mx-auto text-anulok-wood">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-serif font-bold text-anulok-espresso">
                    Verify Your Email
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    We sent a 6-digit verification code to{' '}
                    <span className="font-semibold text-anulok-espresso">{registerData.email}</span>.
                  </p>

                  {devOtpHint && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-mono mt-1">
                      <span>Dev preview code:</span>
                      <strong className="tracking-wider">{devOtpHint}</strong>
                    </div>
                  )}
                </div>

                {/* 6-Digit Code Input */}
                <div>
                  <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block text-center mb-2">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full max-w-xs mx-auto block py-3 px-4 bg-anulok-cream border-2 border-stone-300 rounded-2xl text-center text-2xl font-mono font-bold tracking-[0.35em] text-anulok-espresso outline-none focus:border-anulok-wood transition-colors shadow-inner"
                  />
                  <p className="text-[11px] text-stone-400 text-center mt-2">
                    The code expires in 10 minutes.
                  </p>
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="w-full py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Create Account'}{' '}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setRegisterStep('details')}
                      className="text-stone-500 hover:text-anulok-espresso flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to edit
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendOtp}
                      className={`font-semibold transition-colors flex items-center gap-1 ${
                        resendCooldown > 0
                          ? 'text-stone-400 cursor-not-allowed'
                          : 'text-anulok-wood hover:text-anulok-espresso'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
