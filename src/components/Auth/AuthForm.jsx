import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { NameInput, EmailInput, PasswordInput } from './AuthFields';

const AuthForm = ({ 
  authMode, 
  email, setEmail,
  password, setPassword,
  name, setName,
  showPassword, setShowPassword,
  loading, 
  errors, 
  clearErrors,
  handleLogin,
  handleSignUp
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[420px] bg-white border-4 border-black p-8 sm:p-10 shadow-[8px_8px_0px_#000000] relative z-10"
    >
      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Member Portal</p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          {authMode === 'login' ? 'Welcome Back' : 'Create Profile'}
        </h2>
      </div>

      <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} className="space-y-6">
        <AnimatePresence mode="wait">
          {authMode === 'signup' && (
            <motion.div 
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <NameInput 
                value={name} 
                onChange={(val) => { setName(val); clearErrors(); }} 
                error={errors.name} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <EmailInput 
          value={email} 
          onChange={(val) => { setEmail(val); clearErrors(); }} 
          error={errors.email} 
        />

        <PasswordInput 
          value={password} 
          onChange={(val) => { setPassword(val); clearErrors(); }} 
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          error={errors.password} 
        />

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
              <span>{authMode === 'login' ? 'Login' : 'Sign Up'}</span>
              <ArrowRight size={16} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[9px] font-black uppercase tracking-widest text-black/40">
          Secured Connection <span className="text-black/10 mx-2">|</span> 256-bit AES
        </p>
      </div>
    </motion.div>
  );
};

export default AuthForm;
