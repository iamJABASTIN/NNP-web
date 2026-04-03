import React from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export const FormField = ({ label, error, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest pl-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 mt-1">{error}</p>}
  </div>
);

export const InputWrapper = ({ icon: Icon, children, className = "" }) => (
  <div className={`relative border-4 border-black transition-all focus-within:shadow-[4px_4px_0px_#f2ca50] group ${className}`}>
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
    {children}
  </div>
);

export const EmailInput = ({ value, onChange, disabled, error }) => (
  <FormField label="Email" error={error}>
    <InputWrapper icon={Mail} className={disabled ? 'bg-muted/30 opacity-60' : ''}>
      <input
        type="email" 
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="your@email.com"
        className="w-full pl-12 pr-4 py-4 bg-transparent outline-none font-bold text-sm placeholder:text-black/10"
      />
    </InputWrapper>
  </FormField>
);

export const PasswordInput = ({ value, onChange, showPassword, setShowPassword, error, placeholder = "••••••••" }) => (
  <FormField label="Password" error={error}>
    <InputWrapper icon={Lock}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 bg-white outline-none font-bold text-sm placeholder:text-black/10"
      />
      <button
        type="button" 
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </InputWrapper>
  </FormField>
);

export const NameInput = ({ value, onChange, error }) => (
  <FormField label="Full Name" error={error}>
    <InputWrapper icon={User}>
      <input
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Rahul S."
        className="w-full pl-12 pr-4 py-4 bg-white outline-none font-bold text-sm uppercase placeholder:text-black/10"
      />
    </InputWrapper>
  </FormField>
);
