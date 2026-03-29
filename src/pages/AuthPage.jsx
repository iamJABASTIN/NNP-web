import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthPage = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state: 'initial' (Email+Password) | 'signup' (Email+Password+Name)
  const [authState, setAuthState] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearErrors = () => setErrors({});

  // ─── Post-auth handler (Task 4) ─────────────────────────────────
  const handlePostAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Step 1: Link anonymous session if it exists
      if (session?.user?.is_anonymous) {
        // As per task instructions code snippet
        await supabase.auth.linkIdentity({ provider: 'email' });
      }

      // Step 2: Fetch role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const role = profile?.role || 'customer';

      // Step 3: Redirect based on role
      const routes = {
        customer: '/menu',
        admin: '/admin',
        cook: '/kitchen',
        supplier: '/supplier',
      };

      navigate(routes[role] || '/menu');
    } catch (err) {
      console.error('Post-auth error:', err);
      navigate('/menu'); // Fallback
    }
  };

  // ─── INITIAL ATTEMPT (Login first) ───────────────────────────
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    if (!password || password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      // First attempt: Sign in with password
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const isNotFound = 
          error.status === 400 && (
            error.message?.toLowerCase().includes('invalid login credentials') ||
            error.message?.toLowerCase().includes('user_not_found')
          );
        
        // Supabase often returns 'Invalid login credentials' for both missing user 
        // and wrong password. In a strict "auto-detect" flow, we can check 
        // if user exists via signup with shouldCreateUser logic or by checking error.
        // For simplicity and to match the prompt perfectly:
        if (isNotFound) {
          setAuthState('signup');
        } else {
          setErrors({ password: error.message });
        }
      } else {
        await handlePostAuth();
      }
    } catch {
      setErrors({ password: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Handle Go Back ──────────────────────────────────────────
  const goBack = () => {
    setAuthState('initial');
    clearErrors();
  };

  // ─── STATE 3: New User (Sign-Up) ───────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!password || password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('rate limit')) {
          setErrors({ 
            password: 'Email limit reached. Disable "Confirm email" in Supabase Dashboard -> Auth -> Providers -> Email to skip this limit.' 
          });
        } else {
          setErrors({ password: error.message?.toLowerCase().includes('already') 
            ? 'Email already in use.' 
            : error.message });
        }
      } else {
        await handlePostAuth();
      }
    } catch {
      setErrors({ password: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };


  // Dynamic values based on authState
  const headingLabel = 
    authState === 'initial' ? 'Enter Email and Password' : 'Create your account';
  
  const buttonLabel = 
    authState === 'initial' ? 'Continue' : 'Create Account';

  const currentSubmit = 
    authState === 'initial' ? handleInitialSubmit : handleSignUp;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-4 font-sans text-black">
      <div className="w-full max-w-[420px]">
        {/* Back Chevron */}
        {authState !== 'initial' && (
          <button 
            onClick={goBack}
            className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors mb-6 uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
        )}

        {/* Restaurant Logo */}
        <div className="text-center mb-10 transition-all">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Nellai<span className="text-accent">.</span>Punjabi
          </h1>
          <p className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mt-1">Authentic Kitchen</p>
        </div>

        {/* Section Heading (Above Card) */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center animate-fade-slide">
          {headingLabel}
        </h2>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          <form onSubmit={currentSubmit} className="space-y-6">
            {/* Name Field (State 3 Only) */}
            {authState === 'signup' && (
              <div className="animate-fade-slide">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearErrors(); }}
                  placeholder="John Doe"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-white focus:border-black transition-all outline-none text-sm"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 px-1">{errors.name}</p>}
              </div>
            )}
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                disabled={authState === 'signup'}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all outline-none text-sm
                  ${authState === 'initial' 
                    ? 'border-gray-100 bg-white focus:border-black' 
                    : 'border-transparent bg-gray-50 text-gray-500 cursor-not-allowed'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 px-1 animate-fade-slide">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className={`animate-fade-slide`}>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-100 bg-white focus:border-black transition-all outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 px-1 animate-fade-slide">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-black transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {buttonLabel}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-8">
          Secure Login Powered by Supabase
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
