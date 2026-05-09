import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from "motion/react";
import { supabase } from '../lib/supabase';
import AuthHero from '../components/Auth/AuthHero';
import AuthForm from '../components/Auth/AuthForm';

const AuthPage = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI state: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handlePostAuth();
      }
    };
    checkSession();
  }, []);

  const clearErrors = () => setErrors({});

  const handlePostAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrors({ email: 'Enter a valid email' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrors({ password: 'Invalid email or password' });
      } else {
        await handlePostAuth();
      }
    } catch {
      setErrors({ password: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }
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
            ? 'Email already in use. Try logging in.' 
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

  const toggleMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
    clearErrors();
  };

  return (
    <div className="h-[100dvh] bg-white flex flex-col lg:flex-row font-sans text-black selection:bg-accent/30 selection:text-black overflow-hidden relative">
      
      {/* ─── Left Section: Branding & Hero Context ─── */}
      <AuthHero />

      {/* ─── Right Section (Form Area) ─── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 h-full overflow-y-auto lg:overflow-hidden relative bg-muted/10">
        
        {/* Mobile Nav Controls */}
        <button 
          onClick={() => navigate('/')}
          className="lg:hidden absolute top-4 left-4 sm:top-8 sm:left-8 z-50 p-2.5 bg-white border-2 border-black shadow-[4px_4px_0px_#000000] hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="stroke-[3px]" />
        </button>
        
        {/* <div className="lg:hidden mb-12 text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            Nellai<span className="text-accent italic">.</span>Punjabi
          </h1>
          <div className="w-12 h-1 bg-black mx-auto mt-2"></div>
        </div> */}

        {/* Auth Form Container */}
        <AuthForm 
          authMode={authMode}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          name={name} setName={setName}
          showPassword={showPassword} setShowPassword={setShowPassword}
          loading={loading}
          errors={errors}
          clearErrors={clearErrors}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
          toggleMode={toggleMode}
        />

        {/* Mode Toggle Link */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <button 
                onClick={toggleMode}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
            >
                {authMode === 'login' ? (
                    <>New to the family? <span className="text-accent underline decoration-black underline-offset-4">Create Account</span></>
                ) : (
                    <>Already a member? <span className="text-accent underline decoration-black underline-offset-4">Log In</span></>
                )}
            </button>
        </div>

        {/* Floating Accent Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-none-none blur-[120px] pointer-events-none -z-0"></div>
      </div>
    </div>
  );
};

export default AuthPage;
