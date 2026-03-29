import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { supabase } from '../lib/supabase';
import eatingIllustration from '../assets/illustrators/eating.png';

const AuthPage = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state: 'initial' | 'signup'
  const [authState, setAuthState] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearErrors = () => setErrors({});

  // ─── Post-auth handler ─────────────────────────────────
  const handlePostAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      if (session?.user?.is_anonymous) {
        await supabase.auth.linkIdentity({ provider: 'email' });
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      const role = profile?.role || 'customer';
      const routes = {
        customer: '/menu', admin: '/admin',
        cook: '/kitchen', supplier: '/supplier',
      };

      navigate(routes[role] || '/menu');
    } catch (err) {
      console.error('Post-auth error:', err);
      navigate('/menu'); 
    }
  };

  // ─── Login handler ───────────────────────────
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    if (!password || password.length < 6) {
      setErrors({ password: 'Min 6 characters' });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const isNotFound = 
          error.status === 400 && (
            error.message?.toLowerCase().includes('invalid login credentials') ||
            error.message?.toLowerCase().includes('user_not_found')
          );
        
        if (isNotFound) {
          setAuthState('signup');
        } else {
          setErrors({ password: error.message });
        }
      } else {
        await handlePostAuth();
      }
    } catch {
      setErrors({ password: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Sign-Up Handler ──────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!password || password.length < 6) {
      setErrors({ password: 'Min 6 characters' });
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
          setErrors({ password: 'Rate limit reached. Try later.' });
        } else {
          setErrors({ password: error.message?.toLowerCase().includes('already') 
            ? 'Email already in use.' 
            : error.message });
        }
      } else {
        await handlePostAuth();
      }
    } catch {
      setErrors({ password: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setAuthState('initial');
    clearErrors();
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col lg:flex-row font-sans text-black selection:bg-accent/30 selection:text-black overflow-hidden relative">
      
      {/* ─── Left Section: Branding & Hero Context (Desktop Col 1-5) ─── */}
      <div className="hidden lg:flex w-full lg:col-span-12 xl:w-[45%] bg-white border-r-4 border-black relative overflow-hidden flex-col justify-center p-16">
        {/* Geometric Accent Like Hero.jsx */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-muted/50 -mr-32 -mt-32 rotate-45 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative z-10"
        > 
          <h1 className="text-6xl xl:text-8xl font-black leading-none uppercase tracking-tighter mb-8 bg-white pr-4 inline-block">
            TASTE<br />
            <span className="text-accent italic">TRADITION.</span>
          </h1>
          
          <div className="relative group w-fit">
            <div className="absolute -inset-2 bg-accent opacity-0 transition-opacity rounded-full blur-2xl"></div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img 
                src={eatingIllustration} 
                alt="Eating" 
                className="w-80 xl:w-96 transition-all duration-700 pointer-events-none"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Label */}
        <div className="absolute bottom-8 left-16">
          <h2 className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
            Nellai<span className="text-accent italic">.</span>Punjabi
          </h2>
        </div>
      </div>

      {/* ─── Right Section (Form Area) ─── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 h-full overflow-y-auto lg:overflow-hidden relative bg-muted/10">
        
        {/* Mobile Back Button (Top Left) */}
        <button 
          onClick={() => navigate('/')}
          className="lg:hidden absolute top-4 left-4 sm:top-8 sm:left-8 z-50 p-2.5 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="stroke-[3px]" />
        </button>
        
        {/* Mobile Logo Branding */}
        <div className="lg:hidden mb-12 text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Nellai<span className="text-accent italic">.</span>Punjabi
          </h1>
          <div className="w-12 h-1 bg-black mx-auto mt-2"></div>
        </div>

        <motion.div 
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] bg-white border-4 border-black p-8 sm:p-10 shadow-[8px_8px_0px_#000000] relative z-10"
        >
          {/* Back Button Animation */}
          <AnimatePresence>
            {authState !== 'initial' && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={goBack}
                className="flex items-center gap-1 text-[10px] font-black text-black/30 hover:text-black transition-colors mb-6 uppercase tracking-widest"
              >
                <ChevronLeft size={14} className="stroke-[3px]" />
                <span>Go Back</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Member Portal</p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
              {authState === 'initial' ? 'Welcome' : 'Join Us'}
            </h2>
          </div>

          <form onSubmit={authState === 'initial' ? handleInitialSubmit : handleSignUp} className="space-y-6">
            
            <AnimatePresence mode="wait">
              {authState === 'signup' && (
                <motion.div 
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative border-4 border-black group focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                    <input
                      type="text" value={name}
                      onChange={(e) => { setName(e.target.value); clearErrors(); }}
                      placeholder="e.g. Rahul S."
                      className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase placeholder:text-black/10"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 mt-1">{errors.name}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1">Email</label>
              <div className={`relative border-4 border-black transition-all ${authState === 'initial' ? 'focus-within:shadow-[4px_4px_0px_#f2ca50]' : 'bg-muted/30 opacity-60'}`}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type="email" value={email}
                  disabled={authState === 'signup'}
                  onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-transparent outline-none font-bold text-sm placeholder:text-black/10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1">Password</label>
              <div className="relative border-4 border-black focus-within:shadow-[4px_4px_0px_#f2ca50] transition-all">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white outline-none font-bold text-sm placeholder:text-black/10"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border-r-4 border-b-4 border-accent hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000000] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>{authState === 'initial' ? 'Proceed' : 'Create Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
              Secured Connection <span className="text-black/10 mx-2">|</span> 256-bit AES
            </p>
          </div>
        </motion.div>

        {/* Floating Accent Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      </div>
    </div>
  );
};

export default AuthPage;
